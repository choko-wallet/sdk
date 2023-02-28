// Copyright 2021-2022 @choko-wallet/auth-client authors & contributors
// SPDX-License-Identifier: Apache-2.0

export { initProofOfOwnership as initEmailProofOfOwnership, validateProofOfOwnership as validateEmailProofOfOwnership } from './email';

export { initProofOfOwnership as initGAProofOfOwnership, validateProofOfOwnership as validateGAProofOfOwnership } from './ga';

export { validateProofOfOwnership as validateOAuthProofOfOwnership } from './oauth';

export { linkUsage, validateUsage } from './usage';
