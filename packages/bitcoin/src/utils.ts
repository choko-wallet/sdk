const toXOnly = (pubKey: Uint8Array) =>
  pubKey.length === 32 ? pubKey : pubKey.slice(1, 33);

export { toXOnly }