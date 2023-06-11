// Copyright 2021-2022 @choko-wallet/core authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Version } from './types';

import { padSize, stringToU8a, u8aToString, unpadSize } from '@skyekiwi/util';

export class DappDescriptor {
  displayName: string;
  infoName: string;
  version: number;

  constructor (config: {
    displayName: string;
    infoName: string;
    version: Version;
  }) {
    if (config.infoName.length > 32) {
      throw new Error('name too long - DappDescriptor.contructor');
    }

    if (config.displayName.length > 32) {
      throw new Error('name too long - DappDescriptor.contructor');
    }

    this.displayName = config.displayName;
    this.infoName = config.infoName;
    this.version = config.version;
  }

  /**
    * get the length of serialized bytes
    * @returns {number} size of the serialized bytes
  */
  public static serializedLength (): number {
    return 68 + // displayName 4 bytes size + 64 bytes data
      68 + // infoName 4 bytes size + 64 bytes data
      1; // version ( pad(repeat) to 2 bytes )
  }

  /**
   * serialize DappDescriptor
   * @returns {Uint8Array} serialized DappDescriptor
  */
  public serialize (): Uint8Array {
    const name = stringToU8a(this.infoName);
    const nameContainer = new Uint8Array(68);

    nameContainer.set(padSize(name.length), 0);
    nameContainer.set(name, 4);

    const displayName = stringToU8a(this.displayName);
    const displayNameContainer = new Uint8Array(68);

    displayNameContainer.set(padSize(displayName.length), 0);
    displayNameContainer.set(displayName, 4);

    const res = new Uint8Array(DappDescriptor.serializedLength());

    res.set(nameContainer, 0);
    res.set(displayNameContainer, 68);
    res.set([this.version], 68 + 68);

    return res;
  }

  /**
    * deserialize DappDescriptor
    * @param {Uint8Array} data serialized DappDescriptor
    * @returns {DappDescriptor} DappDescriptor object
  */
  public static deserialize (data: Uint8Array): DappDescriptor {
    if (data.length !== DappDescriptor.serializedLength()) {
      throw new Error('invalid data length - DappDescriptor.deserialize');
    }

    const nameLength = unpadSize(data.slice(0, 4));
    const name = data.slice(4, 4 + nameLength);
    const nameStr = u8aToString(name);

    const displayNameLength = unpadSize(data.slice(68, 72));
    const displayName = data.slice(4 + 68, 4 + 68 + displayNameLength);
    const displayNameStr = u8aToString(displayName);
    const version = data.slice(68 + 68, 68 + 68 + 1)[0];

    const descriptor = new DappDescriptor({
      displayName: displayNameStr,
      infoName: nameStr,
      version
    });

    return descriptor;
  }
}
