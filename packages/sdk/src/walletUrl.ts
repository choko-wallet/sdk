// Copyright 2021-2022 @choko-wallet/sdk authors & contributors
// SPDX-License-Identifier: Apache-2.0

export default function getWalletUrl (type?: string): string {
  const deploymentType = type || process.env.DEPLOYMENT_ENV;

  switch (deploymentType) {
    case 'LOCAL': return 'http://localhost:3000';
    case 'STAGING': return 'https://staging.choko.app';
    case 'PRODUCTION': return 'https://choko.app';
    default:
      return 'http://localhost:3000';
  }
}
