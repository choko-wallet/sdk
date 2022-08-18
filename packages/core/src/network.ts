// Copyright 2021-2022 @choko-wallet/core authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Color, HexString, Image } from './types';

import { u8aToHex } from '@skyekiwi/util';

import { knownNetworks } from '@choko-wallet/known-networks';

import * as Util from './util';

export interface INetwork {
  providers: Record<string, string>;
  info: string;
  text: string;

  homepage?: string;
  isChild?: boolean;
  isDevelopment?: boolean;
  isDisabled?: boolean;
  isUnreachable?: boolean;
  paraId?: number;
  summary?: string;
  color?: Color;
  logo?: Image;

  serialize(): Uint8Array;
}

export class Network implements INetwork {
  providers: Record<string, string>;
  info: string;
  text: string;

  homepage?: string;
  isChild?: boolean;
  isDevelopment?: boolean;
  isDisabled?: boolean;
  isUnreachable?: boolean;
  paraId?: number;
  summary?: string;
  color?: Color;
  logo?: Image;

  constructor (config: {
    info: string,
    providers: Record<string, string>,
    text: string,

    homepage?: string,
    isChild?: boolean,
    isDevelopment?: boolean,
    isDisabled?: boolean,
    isUnreachable?: boolean,
    paraId?: number,
    summary?: string,
    color?: Color,
    logo?: Image,
  }) {
    this.providers = config.providers;
    this.info = config.info;
    this.text = config.text;

    this.homepage = config.homepage;
    this.isChild = config.isChild;
    this.isDevelopment = config.isDevelopment;
    this.isDisabled = config.isDisabled;
    this.isUnreachable = config.isUnreachable;
    this.paraId = config.paraId;
    this.summary = config.summary;
    this.color = config.color;
    this.logo = config.logo;
  }

  public static serializedLength (): number {
    return 8;
  }

  public serialize (): Uint8Array {
    return Util.xxHash(this.info);
  }

  public static deserialize (data: Uint8Array): INetwork {
    if (data.length !== Network.serializedLength()) {
      throw new Error('Invalid network length');
    }

    const hash = u8aToHex(data);

    if (hash in knownNetworks) {
      return knownNetworks[hash];
    } else {
      throw new Error(`Unknown network: ${hash}`);
    }
  }
}

export declare type KnownNetworks = Record<HexString, INetwork>;
