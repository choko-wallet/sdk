// Copyright 2021-2022 @choko-wallet/account authors & contributors
// SPDX-License-Identifier: Apache-2.0

export {};
// import type { IUserOperation } from '../types';

// import superagent from 'superagent';
// import { Address, fromHex, Hex, LocalAccount, PublicClient, TransactionSerializable, WalletClient } from 'viem';

// import { encodeContractCall, loadAbi } from '@choko-wallet/abi';
// import { getPublicClient, getViemChainConfig, getWalletClient } from '@choko-wallet/rpc';

// // Stackup Impl
// export const fixtures: {[key: string]: Address} = {
//   entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
//   accountFactory: '0x9406Cc6185a346906296840746125a0E44976454'
// };

// const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';

// export class ContractAccount {
//   userOp: IUserOperation;

//   baseAccount: LocalAccount;

//   walletClient: WalletClient;
//   publicClient: PublicClient;

//   chainId: number;
//   accountIndex: number;

//   caAddress: Address;
//   isDeployed: boolean;

//   constructor (baseAccount: LocalAccount, chainId: number, index = 0) {
//     this.accountIndex = index;
//     this.chainId = chainId;
//     this.publicClient = getPublicClient(chainId);
//     this.walletClient = getWalletClient(chainId);
//     this.baseAccount = baseAccount;

//     this.userOp = {
//       sender: ADDRESS_ZERO,
//       nonce: BigInt(0),
//       initCode: {
//         needsDeployment: false,
//         factoryAddress: fixtures.accountFactory,
//         calldata: '0x'
//       },
//       callData: '0x',
//       callGasLimit: BigInt(35000),
//       verificationGasLimit: BigInt(70000),
//       preVerificationGas: BigInt(60000),
//       maxFeePerGas: BigInt(0),
//       maxPriorityFeePerGas: BigInt(0),
//       paymasterAndData: '0x',
//       signature: '0x'
//     };

//     this.caAddress = ADDRESS_ZERO;
//     this.isDeployed = false;
//   }

//   // Helper Functions
//   private async isCADeployed (): Promise<boolean> {
//     const caAddress = await this.getAddress();
//     const bytes = await this.publicClient.getBytecode({ address: caAddress });

//     const isDeployed = bytes !== '0x';

//     this.isDeployed = isDeployed;

//     return isDeployed;
//   }

//   private encodeInitCode (data: {needsDeployment: boolean, factoryAddress: Address, calldata: Hex}): Hex {
//     if (data.needsDeployment) {
//       return `${data.factoryAddress}${data.calldata.slice(2)}`;
//     } else {
//       return '0x';
//     }
//   }

//   // we opne this up so that ContractAccount can use it as well
//   public async getAddress (): Promise<Address> {
//     if (this.caAddress !== ADDRESS_ZERO) {
//       return this.caAddress;
//     }

//     const addr = await this.publicClient.readContract({
//       address: fixtures.accountFactory,
//       abi: loadAbi('aa-walletFactory'),
//       functionName: 'getAddress',
//       args: [this.baseAccount.address, this.accountIndex]
//     }) as Address;

//     this.caAddress = addr;

//     return addr;
//   }

//   // Builder Functions
//   public async setAddress (): Promise<ContractAccount> {
//     const addr = await this.getAddress();

//     this.userOp.sender = addr;

//     return this;
//   }

//   public async maybeIncludeInitCode (): Promise<ContractAccount> {
//     if (this.isCADeployed()) {
//       return this;
//     } else {
//       const deployWithFactory = encodeContractCall('aa-walletFactory', 'createAccount', [
//         this.baseAccount.address, this.accountIndex
//       ]);

//       this.userOp.initCode = {
//         needsDeployment: true,
//         factoryAddress: fixtures.accountFactory,
//         calldata: deployWithFactory
//       };

//       return this;
//     }
//   }

//   public async fetchNonce (): Promise<ContractAccount> {
//     if (!this.userOp.initCode.needsDeployment) {
//       const caAddress = await this.getAddress();

//       this.userOp.nonce = await this.publicClient.readContract({
//         address: caAddress,
//         abi: loadAbi('aa-wallet'),
//         functionName: 'getNonce',
//         args: []
//       }) as bigint;
//     } else {
//       this.userOp.nonce = BigInt(0);
//     }

//     return this;
//   }

//   // TODO: get gasPrice the EIP1559 style
//   public async fetchGasPrice (): Promise<ContractAccount> {
//     const gasPrice = await this.publicClient.getGasPrice();

//     this.userOp.maxFeePerGas = gasPrice;
//     this.userOp.maxPriorityFeePerGas = gasPrice;

//     return this;
//   }

//   public setExecution (tx: TransactionSerializable[]): ContractAccount {
//     if (tx.length == 0) {
//       throw new Error('No transaction provided');
//     }

//     if (tx.length === 1) {
//       this.userOp.callData = encodeContractCall('aa-wallet', 'execute', [
//         tx[0].to, tx[0].value || BigInt(0), tx[0].data || '0x'
//       ]);
//     } else {
//       this.userOp.callData = encodeContractCall('aa-wallet', 'executeBatch', [
//         tx.map((t) => t.to),
//         tx.map((t) => t.data || '0x')
//       ]);
//     }

//     return this;
//   }

//   public async setPaymasterAndData (paymasterUrl: string): Promise<ContractAccount> {
//     // Following UserOp.js >> preset/middleware/paymaster.ts
//     this.userOp.verificationGasLimit = this.userOp.verificationGasLimit * BigInt(3);

//     const response = await superagent
//       .post(paymasterUrl)
//       .send({
//         method: 'pm_sponsorUserOperation',
//         params: [
//           this.toJson(),
//           fixtures.entryPoint,
//           {}
//         ]
//       });

//     const paymasterData = JSON.parse(response.body.text) as unknown as {
//       paymasterAndData: Hex;
//       preVerificationGas: Hex;
//       verificationGasLimit: Hex;
//       callGasLimit: Hex;
//     };

//     this.userOp.paymasterAndData = paymasterData.paymasterAndData;
//     this.userOp.preVerificationGas = fromHex(paymasterData.preVerificationGas, 'bigint');
//     this.userOp.verificationGasLimit = fromHex(paymasterData.verificationGasLimit, 'bigint');
//     this.userOp.callGasLimit = fromHex(paymasterData.callGasLimit, 'bigint');

//     return this;
//   }

//   public async signUserOp (): Promise<ContractAccount> {
//     const typedData = {
//       domain: { verifyingContract: await this.getAddress(), chainId: this.chainId },
//       types: {
//         WalletTx: [
//           { name: 'sender', type: 'address' },
//           { name: 'nonce', type: 'uint256' },
//           { name: 'initCode', type: 'bytes' },
//           { name: 'callData', type: 'bytes' },
//           { name: 'callGasLimit', type: 'uint256' },
//           { name: 'verificationGasLimit', type: 'uint256' },
//           { name: 'preVerificationGas', type: 'uint256' },
//           { name: 'maxFeePerGas', type: 'uint256' },
//           { name: 'maxPriorityFeePerGas', type: 'uint256' },
//           { name: 'paymasterAndData', type: 'bytes' }
//         ]
//       },
//       message: {
//         sender: this.userOp.sender,
//         nonce: this.userOp.nonce,
//         initCode: this.encodeInitCode(this.userOp.initCode),
//         callData: this.userOp.callData,
//         callGasLimit: this.userOp.callGasLimit,
//         verificationGasLimit: this.userOp.verificationGasLimit,
//         preVerificationGas: this.userOp.preVerificationGas,
//         maxFeePerGas: this.userOp.maxFeePerGas,
//         maxPriorityFeePerGas: this.userOp.maxPriorityFeePerGas,
//         paymasterAndData: this.userOp.paymasterAndData
//       },
//       primaryType: 'WalletTx'
//     } as const;

//     this.userOp.signature = await this.baseAccount.signTypedData(typedData);

//     return this;
//   }

//   public async manualDeployContractIfNeeded (): Promise<void> {
//     if (!this.isCADeployed()) {
//       await this.walletClient.sendTransaction({
//         account: this.baseAccount,
//         chain: getViemChainConfig(this.chainId),
//         data: encodeContractCall('aa-walletFactory', 'createAccount', [
//           this.baseAccount.address, // EOA account
//           this.accountIndex // account index
//         ]),
//         to: fixtures.accountFactory
//       });
//     }
//   }

//   public toJson (): string {
//     /* eslint-disable sort-keys */
//     return JSON.stringify({
//       sender: this.userOp.sender,
//       nonce: `0x${this.userOp.nonce.toString(16)}`,
//       initCode: this.encodeInitCode(this.userOp.initCode),
//       callData: this.userOp.callData,
//       callGasLimit: `0x${this.userOp.callGasLimit.toString(16)}`,
//       verificationGasLimit: `0x${this.userOp.verificationGasLimit.toString(16)}`,
//       preVerificationGas: `0x${this.userOp.preVerificationGas.toString(16)}`,
//       maxFeePerGas: `0x${this.userOp.maxFeePerGas.toString(16)}`,
//       maxPriorityFeePerGas: `0x${this.userOp.maxPriorityFeePerGas.toString(16)}`,
//       paymasterAndData: this.userOp.paymasterAndData,
//       signature: this.userOp.signature
//     });
//     /* eslint-enable */
//   }

//   /* END POINTS */
//   /// direct execution
//   public async execute (tx: TransactionSerializable[], deployIfNeede = true): Promise<Hex> {
//     if (deployIfNeede) {
//       await this.manualDeployContractIfNeeded();
//     }

//     const userOp = await this.setAddress()
//       .then((builder) => builder.setExecution(tx));

//     return await this.walletClient.sendTransaction({
//       account: this.baseAccount,
//       chain: getViemChainConfig(this.chainId),

//       to: userOp.userOp.sender,
//       value: BigInt(0),
//       data: userOp.userOp.callData
//     });
//   }

//   public async gaslessExecute (tx: TransactionSerializable[], bundler: string): Promise<void> {
//     const userOp = await this.setAddress()
//       .then((builder) => builder.setExecution(tx))
//       .then((builder) => builder.fetchNonce())
//       .then((builder) => builder.fetchGasPrice())
//       .then((builder) => builder.setPaymasterAndData('NONE'))
//       .then((builder) => builder.signUserOp())
//       .then((builder) => builder.toJson());

//     const res = await superagent
//       .post(bundler)
//       .send({
//         id: 1234,
//         jsonrpc: '2.0',
//         method: 'eth_sendUserOperation',
//         params: [JSON.parse(userOp), fixtures.entryPoint]
//       });

//     console.log(res);
//   }
// }
