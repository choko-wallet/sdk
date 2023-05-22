import ECPairFactory, { ECPairInterface } from 'ecpair';
import * as ecc from "tiny-secp256k1";
import { Network, Payment, Psbt, payments, Transaction, address, Signer, crypto } from 'bitcoinjs-lib';
import { isTaprootInput } from "bitcoinjs-lib/src/psbt/bip371";
import { AddressType } from './types';
import { toXOnly } from './utils';

const privateKeyToKeychain = (privateKey: Uint8Array, opt?: {network: Network}): ECPairInterface => {
  // create a bitcoin address from the private key
  const keychain = ECPairFactory(ecc);

  return keychain.fromPrivateKey(Buffer.from(privateKey), opt)
}

const publicKeyToPayment = (pubKey: Uint8Array, network: Network, addressType: AddressType): Payment => {
  if (!pubKey || pubKey.length === 0) return null;

  switch (addressType) {
    case AddressType.P2PKH:
      return payments.p2pkh({ pubkey: Buffer.from(pubKey), network })
    case AddressType.P2WPKH || AddressType.M44_P2WPKH:
      return payments.p2wpkh({ pubkey: Buffer.from(pubKey), network })
    case AddressType.P2TR || AddressType.M44_P2TR:
      return payments.p2tr({ internalPubkey: Buffer.from(toXOnly(pubKey)), network })
    case AddressType.P2SH_P2WPKH:
      const data = payments.p2wpkh({ pubkey: Buffer.from(pubKey), network });
      return payments.p2sh({ pubkey: Buffer.from(pubKey), network, redeem: data })
    default:
      return null;
  }
}

const paymentToAddress = (payment: Payment): string => {
  if (payment && payment.address) {
    return payment.address
  } else {
    return ""
  }
}

const paymentToScriptPk = (payment: Payment): string => {
  return payment.output.toString("hex")
}

const tapTweakHash = (pubKey: Buffer, h: Buffer | undefined): Buffer => {
  return crypto.taggedHash(
    "TapTweak",
    Buffer.concat(h ? [pubKey, h] : [pubKey])
  );
}

const tweakSigner = (signer: Signer, opts?: {network: Network, tweakHash: Buffer}): Signer => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  let privateKey: Uint8Array | undefined = signer.privateKey!;
  if (!privateKey) {
    throw new Error("Private key is required for tweaking signer!");
  }
  if (signer.publicKey[0] === 3) {
    privateKey = ecc.privateNegate(privateKey);
  }

  const tweakedPrivateKey = ecc.privateAdd(
    privateKey,
    tapTweakHash(Buffer.from(toXOnly(new Uint8Array(signer.publicKey))), opts.tweakHash)
  );
  if (!tweakedPrivateKey) {
    throw new Error("Invalid tweaked private key!");
  }

  return privateKeyToKeychain(Buffer.from(tweakedPrivateKey), {
    network: opts.network,
  });
}

const signPsbt = (
  signer: ECPairInterface,
  addressType: AddressType,
  network: Network,
  psbt: Psbt,
  opts = {
    autoFinalized: true, 
  }
): Psbt => {
  const toSign: {
    index: number,
    publicKey: Uint8Array,
    sighashTypes?: number[]
  }[] = [];

  const selfAccount = publicKeyToPayment(signer.publicKey, network, addressType);
  const selfAddr = paymentToAddress(selfAccount);

  psbt.data.inputs.forEach((input, index) => {
    let script: Buffer = null;

    if (input.witnessUtxo) {
      script = input.witnessUtxo.script;
    } else if (input.nonWitnessUtxo) {
      const tx = Transaction.fromBuffer(input.nonWitnessUtxo);

      const output = tx.outs[psbt.txInputs[index].index];
      script = output.script;
    }

    const isSigned = input.finalScriptSig || input.finalScriptWitness;
    if (script && !isSigned) {
      if (selfAddr === address.fromOutputScript(script, network)) {
        toSign.push({
          index, 
          publicKey: signer.publicKey,
          sighashTypes: input.sighashType ? [input.sighashType] : null
        })
      }
    }
  })

  toSign.forEach(input => {
    if (isTaprootInput(psbt.data.inputs[input.index])) {
      // TODO: missing options
      const tweakedSigner = tweakSigner(signer)
      psbt.signInput(input.index, tweakedSigner, input.sighashTypes)
    } else {
      psbt.signInput(input.index, signer, input.sighashTypes);
    }

    if (opts.autoFinalized !== false) {
      psbt.validateSignaturesOfInput(input.index, 
        (
          pubkey: Buffer,
          msghash: Buffer,
          signature: Buffer
        ): boolean => ECPairFactory(ecc).fromPublicKey(pubkey).verify(msghash, signature)
      )
    }
  })

  return psbt
}

export {signPsbt, privateKeyToKeychain, publicKeyToPayment, paymentToAddress, paymentToScriptPk}