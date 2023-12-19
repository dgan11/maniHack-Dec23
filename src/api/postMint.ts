import { Interface } from '@ethersproject/abi';
import type { TransactionReceipt } from '@ethersproject/providers';
import { ERC721ABI, ERC1155ABI } from '@manifoldxyz/contract-abis';
import { Asset, Network, StudioContractSpec } from '@manifoldxyz/studio-app-sdk';
import { isTestnet } from '@/common/functions';
import { AssetClient } from './AssetClient';

function parseMintLogs(
  { mintSpec, walletIsContract }: { mintSpec: StudioContractSpec; walletIsContract: boolean },
  logs: TransactionReceipt['logs'],
): string[] {
  const isERC1155 = mintSpec === StudioContractSpec.ERC1155;
  const tokenIds: string[] = [];
  if (walletIsContract) {
    if (isERC1155) {
      const iface = new Interface(ERC1155ABI);
      for (const log of logs) {
        try {
          const parsed = iface.parseLog(log);
          if (parsed.args.id) {
            tokenIds.push(parsed.args.id.toString());
            break;
          }
        } catch (e) {
          continue;
        }
      }
    } else {
      for (const log of logs) {
        const iface = new Interface(ERC721ABI);
        try {
          const parsed = iface.parseLog(log);
          if (parsed.args.tokenId) {
            tokenIds.push(parsed.args.tokenId.toString());
          }
        } catch (e) {
          continue;
        }
      }
    }
  } else {
    // store the minted token ID internally for the UX
    if (isERC1155) {
      const iface = new Interface(ERC1155ABI);
      const firstLog = logs[0];
      if (!firstLog) {
        console.error('No logs');
      } else {
        const parsed = iface.parseLog(firstLog);
        tokenIds.push(parsed.args.id.toString());
      }
    } else {
      for (const log of logs) {
        const iface = new Interface(ERC721ABI);
        const parsed = iface.parseLog(log);
        tokenIds.push(parsed.args.tokenId.toString());
      }
    }
  }

  return tokenIds;
}

export async function postAssetMint(
  {
    mintSpec,
    walletIsContract,
    chainId,
    asset,
  }: {
    asset: Asset;
    contractAddress: string;
    mintSpec: StudioContractSpec;
    walletIsContract: boolean;
    chainId: Network;
  },
  receipt: TransactionReceipt,
): Promise<void> {
  const tokenIds = parseMintLogs({ mintSpec, walletIsContract }, receipt.logs);

  if (!tokenIds.length) {
    throw new Error('No token id');
  }

  const singleTokenId = tokenIds[0];
  if (!singleTokenId) {
    throw new Error('No token id');
  }

  // save minted token id to instance

  await AssetClient.saveMintedTokenId(singleTokenId, chainId, asset.id);

  // Notify to discord webhook
  if (!isTestnet(chainId)) {
    console.log('TODO: notify to discord webhook');
    //   try {
    //     await DiscordAPIClient.notifyOnMinted(
    //       chainId,
    //       contractAddress,
    //       singleTokenId,
    //       mintSpec.toLowerCase(),
    //     );
    //   } catch (e) {
    //     console.error(e);
    //   }
  }
}
