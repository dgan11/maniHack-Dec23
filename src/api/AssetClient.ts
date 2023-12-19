import { ASSET_UPLOADER_STUDIO_CLIENT_ID, Network } from '@manifoldxyz/studio-app-sdk';

export class AssetClient {
  private static baseUrl = `https://studio.api.manifoldxyz.dev/asset_uploader/${ASSET_UPLOADER_STUDIO_CLIENT_ID}`;
  private constructor() {}
  public static async saveMintedTokenId(tokenId: string, networkId: Network, assetId: number) {
    const body = {
      assetId,
      networkId,
      tokenId,
    };

    return fetch(`${this.baseUrl}/asset/${assetId}/mint`, {
      body: JSON.stringify(body),
      method: 'POST',
    });
  }
}
