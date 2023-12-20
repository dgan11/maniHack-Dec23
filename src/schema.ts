import { f, InstanceSchema, StudioContractSpec } from '@manifoldxyz/studio-app-sdk';

export const schema = new InstanceSchema({
  contract: f.StudioContract({
    network: 'network',
    specs: [StudioContractSpec.ERC721, StudioContractSpec.ERC1155],
  }),

  loyalCollectorsArgs: f.Form({
    collectors: f.AudienceAllowlist(),
  }),

  erc1155MintArgs: f.Form({
    amounts: f.Array(f.Number()),
    // TODO: change to address when available
    recipients: f.Array(f.String()),
  }),

  /** fields that are relevant to an erc 721 mint */
  // eslint-disable-next-line sort-keys
  erc721MintArgs: f.Form({
    // TODO: change to address when available
    recipient: f.String(),
  }),

  /** initial deploy network */
  network: f.Network([1, 5, 10, 8453]),
  tokenAsset: f.Asset({
    isImmutable: false,
    isPublic: true,
  }),
});
