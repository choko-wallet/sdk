//[object Object]
// SPDX-License-Identifier: Apache-2.0

import type { IUserOperation } from '../types';
import { Address, WalletClient, PublicClient, LocalAccount, TransactionSerializable, Hex, encodeFunctionData, toBytes, encodePacked, parseAbi } from 'viem';

import { getPublicClient, getViemChainConfig, getWalletClient } from '@choko-wallet/rpc';
import { encodeContractCall } from '@choko-wallet/abi';

import superagent from 'superagent';

 
export const AAFACTORY_ABI = parseAbi([
  'function deployCounterFactualWallet(address _owner, address _entryPoint, address _handler, uint _index) public returns (address proxy)',
  'function getAddressForCounterfactualWallet(address _owner, uint _index) external view returns (address _wallet)'
]);

export const AAWALLET_ABI = parseAbi([
  'function getNonce(uint256 batchId) public view returns (uint256)',
  'function exec(address dest, uint value, bytes calldata func) external',
  'function execBatch(address[] calldata dest, bytes[] calldata func) external',
  'function execFromEntryPoint(address dest, uint value, bytes calldata func, uint8 operation, uint256 gasLimit) external returns (bool success)'
]);

export const MULTISEND_ABI = parseAbi([
  'function multiSend(bytes memory transactions) public payable'
]);

export const ENTRYPOINT_ABI = parseAbi([
  'struct UserOperation {address sender; uint256 nonce; bytes initCode; bytes callData; uint256 callGasLimit; uint256 verificationGasLimit; uint256 preVerificationGas; uint256 maxFeePerGas; uint256 maxPriorityFeePerGas; bytes paymasterAndData; bytes signature;}',
  'function getRequestId(UserOperation calldata userOp) public view returns (bytes32)'
]);

export type BiconomyUserOperation = {
  sender: string;
  nonce: number;
  initCode: string;
  callData: string;
  callGasLimit: number;
  verificationGasLimit: number;
  preVerificationGas: number;
  maxFeePerGas: number;
  maxPriorityFeePerGas: number;
  paymasterAndData: string;
  signature: string;
};

// Biconomy Impl
export const fixtures: {[key: string]: Address} = {
  entryPoint: '0x119df1582e0dd7334595b8280180f336c959f3bb',
  accountFactory: '0xf59cda6fd211303bfb79f87269abd37f565499d8',
  fallbackHandler: '0x0bc0c08122947be919a02f9861d83060d34ea478',
  multiSend: '0x2f65bed438a30827d408b7c6818ec5a22c022dd1'
};
const biconomyServicesUrl = {
  biconomyGaslessTxListener: 'wss://sdk-ws.prod.biconomy.io/connection/websocket',
  biconomyRelayService: 'https://sdk-relayer.prod.biconomy.io/api/v1/relay',
  biconomySigningService: 'https://us-central1-biconomy-staging.cloudfunctions.net/signing-service'
};

const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';

export class ContractAccount {
  userOp: IUserOperation;

  baseAccount: LocalAccount;

  walletClient: WalletClient;
  publicClient: PublicClient;

  chainId: number;
  accountIndex: bigint;

  caAddress: Address;
  isDeployed: boolean;

  constructor (baseAccount: LocalAccount, chainId: number, index = 0) {
    this.accountIndex = BigInt(index);
    this.chainId = chainId;
    this.publicClient = getPublicClient(chainId);
    this.walletClient = getWalletClient(chainId);
    this.baseAccount = baseAccount;

    this.userOp = {
      sender: ADDRESS_ZERO,
      nonce: BigInt(0),
      initCode: {
        needsDeployment: false,
        factoryAddress: fixtures.accountFactory,
        calldata: '0x'
      },
      callData: '0x',
      callGasLimit: BigInt(2000000),
      verificationGasLimit: BigInt(2000000),
      preVerificationGas: BigInt(21000),
      maxFeePerGas: BigInt(61072872608),
      maxPriorityFeePerGas: BigInt(1500000000),
      paymasterAndData: '0x',
      signature: '0x'
    };

    this.caAddress = ADDRESS_ZERO;
    this.isDeployed = false;
  }

  // Helper Functions
  private async isCADeployed (): Promise<boolean> {
    const caAddress = await this.getAddress();
    const bytes = await this.publicClient.getBytecode({ address: caAddress });

    const isDeployed = bytes !== '0x';

    this.isDeployed = isDeployed;

    return isDeployed;
  }

  private encodeInitCode (data: {needsDeployment: boolean, factoryAddress: Address, calldata: Hex}): Hex {
    if (data.needsDeployment) {
      return `${data.factoryAddress}${data.calldata.slice(2)}`;
    } else {
      return '0x';
    }
  }

  // we opne this up so that ContractAccount can use it as well
  public async getAddress (): Promise<Address> {
    if (this.caAddress !== ADDRESS_ZERO) {
      return this.caAddress;
    }

    const addr = await this.publicClient.readContract({
      address: fixtures.accountFactory,
      abi: AAFACTORY_ABI,
      functionName: 'getAddressForCounterfactualWallet',
      args: [this.baseAccount.address, this.accountIndex]
    }) ;

    this.caAddress = addr;

    return addr;
  }

  // Builder Functions
  public async setAddress (): Promise<ContractAccount> {
    const addr = await this.getAddress();

    this.userOp.sender = addr;

    return this;
  }

  public async maybeIncludeInitCode (): Promise<ContractAccount> {
    if (this.isCADeployed()) {
      return this;
    } else {
      const deployWithFactory = encodeFunctionData({
        abi: AAFACTORY_ABI,
        functionName: 'deployCounterFactualWallet',
        args: [this.baseAccount.address, fixtures.entryPoint, fixtures.fallbackHandler, this.accountIndex]
      });

      this.userOp.initCode = {
        needsDeployment: true,
        factoryAddress: fixtures.accountFactory,
        calldata: deployWithFactory
      };

      return this;
    }
  }

  public async fetchNonce (): Promise<ContractAccount> {
    if (!this.userOp.initCode.needsDeployment) {
      const caAddress = await this.getAddress();

      this.userOp.nonce = await this.publicClient.readContract({
        address: caAddress,
        abi: AAWALLET_ABI,
        functionName: 'getNonce',
        args: [BigInt(0)]
      }) ;
    } else {
      this.userOp.nonce = BigInt(0);
    }

    return this;
  }

  // TODO: get gasPrice the EIP1559 style
  public async fetchGasPrice (): Promise<ContractAccount> {
    const gasPrice = await this.publicClient.getGasPrice();

    this.userOp.maxFeePerGas = gasPrice;
    this.userOp.maxPriorityFeePerGas = gasPrice;

    return this;
  }

  public setExecution (tx: TransactionSerializable[], withEntryPoint = false): ContractAccount {
    if (tx.length == 0) {
      throw new Error('No transaction provided');
    }

    if (withEntryPoint) {
      if (tx.length === 1) {
        this.userOp.callData = encodeFunctionData({
          abi: AAWALLET_ABI,
          functionName: 'execFromEntryPoint',
          args: [tx[0].to, tx[0].value || BigInt(0), tx[0].data || '0x', 0, BigInt(1000000)]
        });
      } else {
        const encodedTx = `${tx.map((t) => {
          return encodePacked(
            ['uint8', 'address', 'uint256', 'uint256', 'bytes'],
            [0, t.to, t.value || BigInt(0), BigInt(toBytes(t.data).length), t.data || '0x00']
          ).slice(2);
        }).join('')}`;

        const multicallCalldata = encodeFunctionData({
          abi: MULTISEND_ABI,
          functionName: 'multiSend',
          args: [`0x${encodedTx}`]
        });

        this.userOp.callData = encodeFunctionData({
          abi: AAWALLET_ABI,
          functionName: 'execFromEntryPoint',
          args: [fixtures.multiSend, BigInt(0), multicallCalldata, 1, BigInt(1000000)]
        });
      }
    } else {
      if (tx.length === 1) {
        this.userOp.callData = encodeFunctionData({
          abi: AAWALLET_ABI,
          functionName: 'exec',
          args: [tx[0].to, tx[0].value || BigInt(0), tx[0].data || '0x']
        });
      } else {
        this.userOp.callData = encodeFunctionData({
          abi: AAWALLET_ABI,
          functionName: 'execBatch',
          args: [
            tx.map((t) => t.to),
            tx.map((t) => t.data || '0x')
          ]
        });
      }
    }

    return this;
  }

  public async setPaymasterAndData (): Promise<ContractAccount> {
    // Following UserOp.js >> preset/middleware/paymaster.ts
    this.userOp.verificationGasLimit = this.userOp.verificationGasLimit * BigInt(3);

    const paymasterData = await superagent
      .post(biconomyServicesUrl.biconomySigningService)
      .set('x-api-key', 'RgL7oGCfN.4faeb81b-87a9-4d21-98c1-c28267ed4428')
      .send({ userOp: JSON.parse(this.toJson()) });

    if (paymasterData.body.code !== 200) {
      throw new Error('fetching biconomy paymaster data error - AA:fetchPaymasterAndData');
    }

    this.userOp.paymasterAndData = paymasterData.body.data.paymasterAndData;

    return this;
  }

  public async signUserOp (): Promise<ContractAccount> {
    const remote = await this.publicClient.readContract({
      address: fixtures.entryPoint,
      abi: ENTRYPOINT_ABI,
      functionName: 'getRequestId',
      args: [JSON.parse(this.toJson())]
    });

    this.userOp.signature = await this.baseAccount.signMessage({
      message: { raw: remote }
    });

    return this;
  }

  public async manualDeployContractIfNeeded (): Promise<void> {
    if (!this.isCADeployed()) {
      await this.walletClient.sendTransaction({
        to: fixtures.accountFactory,
        data: encodeContractCall('aa-walletFactory', 'createAccount', [
          this.baseAccount.address, // EOA account
          this.accountIndex // account index
        ]),
        account: this.baseAccount,
        chain: getViemChainConfig(this.chainId)
      });
    }
  }

  public toJson (): string {
    return JSON.stringify({
      sender: this.userOp.sender,
      nonce: `0x${this.userOp.nonce.toString(16)}`,
      initCode: this.encodeInitCode(this.userOp.initCode),
      callData: this.userOp.callData,
      callGasLimit: `0x${this.userOp.callGasLimit.toString(16)}`,
      verificationGasLimit: `0x${this.userOp.verificationGasLimit.toString(16)}`,
      preVerificationGas: `0x${this.userOp.preVerificationGas.toString(16)}`,
      maxFeePerGas: `0x${this.userOp.maxFeePerGas.toString(16)}`,
      maxPriorityFeePerGas: `0x${this.userOp.maxPriorityFeePerGas.toString(16)}`,
      paymasterAndData: this.userOp.paymasterAndData,
      signature: this.userOp.signature
    });
  }

  /* ENDPOINTS */
  /// direct execution
  public async execute (tx: TransactionSerializable[], deployIfNeede = true): Promise<Hex> {
    if (deployIfNeede) {
      await this.manualDeployContractIfNeeded();
    }

    const userOp = await this.setAddress()
      .then((builder) => builder.setExecution(tx));

    return await this.walletClient.sendTransaction({
      account: this.baseAccount,
      chain: getViemChainConfig(this.chainId),

      to: userOp.userOp.sender,
      value: BigInt(0),
      data: userOp.userOp.callData
    });
  }

  public async gaslessExecute (tx: TransactionSerializable[]): Promise<void> {
    const userOp = await this.setAddress()
      .then((builder) => builder.setExecution(tx, true))
      .then((builder) => builder.fetchNonce())
      .then((builder) => builder.fetchGasPrice())
      .then((builder) => builder.setPaymasterAndData())
      .then((builder) => builder.signUserOp())
      .then((builder) => builder.toJson())
      .catch((e) => {
        console.error(e);
      });

    try {
      await superagent
        .post(biconomyServicesUrl.biconomyRelayService)
        .send({
          jsonrpc: '2.0',
          id: 1234,
          method: 'eth_sendUserOperation',
          params: [JSON.parse(userOp as string), fixtures.entryPoint, this.chainId, {
            dappAPIKey: 'RgL7oGCfN.4faeb81b-87a9-4d21-98c1-c28267ed4428'
          }]
        });
    } catch (e) {
      console.log(e);
    }
  }
}
