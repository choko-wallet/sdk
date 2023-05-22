import { OrdUnit, UTXO_DUST, Utxo } from "./types";

const splitOrdUtxo = (utxo: Utxo): OrdUnit[] => {

  const ords: OrdUnit[] = [];
  let leftSat = utxo.sat;


  for (let ord of utxo.ords) {
    const id = ord.id;
    const offset = ord.offset;

    let splitSat = offset - (utxo.sat = leftSat);
    if (leftSat - splitSat < UTXO_DUST) {
      splitSat -= UTXO_DUST
    }

    if (splitSat < 0) {
      if (ords.length === 0) {
        ords.push({
          sat: leftSat,
          ords: [{
            id: id, 
            outputOffset: offset,
            unitOffset: 0
          }]
        });

        leftSat = 0;
      } else {
        ords[ords.length - 1].ords.push({
          id, 
          outputOffset: offset,
          unitOffset: ords[ords.length - 1].sat
        })
      }
      continue;
    }

    if (leftSat - splitSat) {
      if (splitSat > UTXO_DUST) {
        ords.push({ sat: UTXO_DUST, ords: [] })
        ords.push({ sat: UTXO_DUST, ords: [{
          id, outputOffset: offset, unitOffset: 0,
        }]})
      } else {
        ords.push({ sat: UTXO_DUST + splitSat, ords: [{
          id, outputOffset: offset, unitOffset: 0
        }] })
      }
    }

    leftSat -= splitSat + UTXO_DUST;
  }

  if (leftSat > UTXO_DUST) {
    ords.push({ sat: leftSat, ords: [] })
  } else if (leftSat > 0) {
    if (ords.length > 0) {
      ords[ords.length - 1].sat += leftSat
    } else {
      ords.push({ sat: leftSat, ords: [] })
    }
  }

  return ords
}

const getNonOrdSat = (ords: OrdUnit[]): number => {
  return ords
    .filter(ord => ord.ords.length == 0)
    .reduce((pre, cur) => pre + cur.sat, 0);
}

const getLastUnitSat = (ords: OrdUnit[]): number => {
  const l = ords[ords.length - 1];

  if (l.ords.length === 0) {
    return l.sat
  }

  return 0
}

const hasOrd = (ord: OrdUnit): boolean => {
  return ord.ords.length > 0;
}

export { hasOrd, splitOrdUtxo, getNonOrdSat, getLastUnitSat };