// Copyright 2021-2023 @choko-wallet/ens authors & contributors
// SPDX-License-Identifier: Apache-2.0

// import { callDataExecTransactionBatch } from '@choko-wallet/account-abstraction';
// import { chainIdToProvider, UserAccount } from '@choko-wallet/core';
// import { defaultMpcAccountOption } from '@choko-wallet/core/accountOption';
// import { Signer } from '@choko-wallet/core/signer';
// import { IMiniEthTransaction } from '@choko-wallet/core/types';
// import { hexToU8a } from '@skyekiwi/util';
// import * as ethers from 'ethers';
// import { joinSignature } from 'ethers/lib/utils';

// import { encodeRegisterSubdomain, encodeSetEthAddr, encodeSetResolve, ENS_REGISTRY_ADDRESS, GOERLI_PUBLIC_RESOLVER, resolveENSAddress } from '.';

// const subDomainOwner = "PRIVATE_KEY";

import ECPairFactory from 'ecpair';
import * as ecc from "tiny-secp256k1";

import {secureGenerateRandomKey} from '@skyekiwi/crypto'
import {hexToU8a} from '@skyekiwi/util';

describe('@choko-wallet/account-abstraction/contract', function () {
  it('place holder', async () => {
    
    const privKey = hexToU8a('0603b0695e8150f3dc0cb05e269cafd96c4aef3d82793aa7292052b30d56508c');
    // create a bitcoin address from the private key
    const keychain = ECPairFactory(ecc);

    const addr = keychain.fromPrivateKey(Buffer.from(privKey)).publicKey;

    console.log(addr)

    // const provider = chainIdToProvider[5];
    // console.log(`Resolve to  ${ await resolveENSAddress(provider, "test.choko.app") }`)

    // const realWallet = new ethers.Wallet(subDomainOwner, provider);

    // let fakeMpcAccount = new UserAccount(defaultMpcAccountOption);
    // fakeMpcAccount.publicKeys[2] = hexToU8a(realWallet.publicKey.substring(2));

    // //
    // const mpcSignFunc = async (msg: Uint8Array, account: UserAccount, auth: string): Promise<Uint8Array> => {
    //     //
    //     const rawSig = realWallet._signingKey().signDigest(msg);
    //     const hexSig = joinSignature(rawSig);

    //     return hexToU8a(hexSig.substring(2));
    // }

    // const signer = new Signer(fakeMpcAccount, mpcSignFunc);

    // const subDomain = "auth";
    // const fullName = `${subDomain}.choko.app`;

    // const regName = {
    //     to: ENS_REGISTRY_ADDRESS,
    //     value: ethers.utils.parseEther("0"),
    //     data: encodeRegisterSubdomain(subDomain, signer.getEthereumAddress())
    // };

    // const setResolver = {
    //     to: ENS_REGISTRY_ADDRESS,
    //     value: ethers.utils.parseEther("0"),

    //     data: encodeSetResolve(fullName, "0xd7a4F6473f32aC2Af804B3686AE8F1932bC35750")
    // };

    // const setAddr = {
    //     to: GOERLI_PUBLIC_RESOLVER,
    //     value: ethers.utils.parseEther("0"),

    //     data: encodeSetEthAddr(fullName, "0x2FA2AE9d448Df2f81BD35d8267cc495B51D0438B"),
    // }

    // const batchedCalldata = callDataExecTransactionBatch([
    //     regName, setResolver, setAddr
    // ]);

    // const tx = {
    //     to: "0x40A2aCCbd92BCA938b02010E17A5b8929b49130D",
    //     value: ethers.utils.parseEther("0"),

    //     data: batchedCalldata,
    //     gasLimit: 200000
    // }

    // const x = await signer.sendTransaction(tx as unknown as IMiniEthTransaction, 5);
    // console.log(x)
  });
});
