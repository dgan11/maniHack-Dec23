import { Network } from '@manifoldxyz/studio-app-sdk';

export function isTestnet(network: Network) {
  switch (network) {
    case Network.MAINNET:
    case Network.BASE:
    case Network.MATIC:
    case Network.OPTIMISM:
      return false;
    case Network.GOERLI:
      return true;
    default:
      throw new Error(`Unsupported network ${network}`);
  }
}
