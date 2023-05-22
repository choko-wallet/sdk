import { AddressType, TxInput, TxOutput, Utxo } from "./types"
import { toXOnly } from "./utils"

import {payments, Psbt, networks} from "bitcoinjs-lib";

const utxoToInput = (utxo: Utxo, publicKey: Uint8Array): TxInput =>  {
  switch (utxo.addressType) {
    case AddressType.P2TR || AddressType.M44_P2TR:
      return {
        data: {
          hash: utxo.txId, 
          index: utxo.outputIndex,
          witnessUtxo: {
            value: utxo.sat,
            script: Buffer.from(utxo.scriptPk, 'hex')
          },

          tapInternalKey: Buffer.from( toXOnly(publicKey) )
        },

        utxo,
      }

    case AddressType.P2SH_P2WPKH || AddressType.M44_P2WPKH || AddressType.P2PKH:
      return {
        data: {
          hash: utxo.txId,
          index: utxo.outputIndex,
          witnessUtxo: {
            value: utxo.sat,
            script: Buffer.from(utxo.scriptPk, 'hex')
          }
        },

        utxo,
      }
    
    case AddressType.P2SH_P2WPKH:
      const redeemData = payments.p2wpkh({ pubkey: Buffer.from(publicKey) });  
      return {
          data: {
            hash: utxo.txId,
            index: utxo.outputIndex,
            witnessUtxo: {
              value: utxo.sat,
              script: Buffer.from(utxo.scriptPk, 'hex')
            },

            redeemScript: redeemData.output
          },

          utxo,
        }
      
    default:
      return null;
  }

}

const composePsbt = (inputs: TxInput[], outputs: TxOutput[], network = networks.bitcoin ): Psbt => {
  const psbt = new Psbt({ network });

  inputs.forEach((input, index) => {
    if (input.utxo.addressType === AddressType.P2PKH) {
      //@ts-ignore
      psbt.__CACHE.__UNSAFE_SIGN_NONSEGWIT = true;
    }

    psbt.addInput(input.data);
    psbt.setInputSequence(index, 0xfffffffd); // support RBF
  });

  outputs.forEach(output => {
    psbt.addOutput(output)
  })

  return psbt;
}

const signPsbt = (psbt: Psbt): Psbt => {
  // TODO: sign the damn thing
  return psbt;
}

const calculateNetworkFee = (psbt: Psbt, feeRate = 5): number => {
  let txSize = psbt.extractTransaction(true).toBuffer().length;
  psbt.data.inputs.forEach(i => {
    if (i.finalScriptWitness) {
      txSize -= i.finalScriptWitness.length * 0.75
    }
  })

  return Math.ceil(txSize * feeRate)
}


export {utxoToInput, composePsbt, calculateNetworkFee, signPsbt}