import { BigNumber } from '@ethersproject/bignumber';
import { ERC721CreatorABI, ERC1155CreatorABI } from '@manifoldxyz/contract-abis';
import { Job, JobProgress, Network, Task } from '@manifoldxyz/studio-app-sdk';
import { SingleMintInstance } from '@/common/types';

interface BaseMintArgs {
  /** can be '{{<taskRef>.output.<outputName>}}', or actual contract address */
  contractAddress: string;
  /** network on which this tx should be done */
  network: Network;
}

interface NewERC721MintArgs extends BaseMintArgs {
  /** wallet address of the recipient */
  recipient: string;
  /** tokenURI for the new token */
  uri: string;
}

interface NewERC1155MintArgs extends BaseMintArgs {
  /** array of recipients to mint to */
  recipients: [string, ...string[]];
  /** amount of tokens to mint according to each recipient in the list */
  amounts: [number, ...number[]];
  /** token uris */
  uris: [string, ...string[]];
}

export function createMintERC721Task({
  contractAddress,
  network,
  recipient,
  uri,
}: NewERC721MintArgs): Task {
  return {
    // adminCheck: {
    //   contractSpec: 'erc721',
    //   creatorContractAddress: contractAddress,
    // },
    description: 'Mint a new ERC-721 token',
    inputs: {
      abi: ERC721CreatorABI,
      address: contractAddress,
      args: [recipient, uri],
      autoRecover: true,
      method: 'mintBase(address,string)',
      networkId: network,
      value: BigNumber.from(0),
    },
    name: 'Mint new token',
    ref: 'mintNewToken721',
    type: 'tx',
  };
}

export function createMintERC1155Task({
  contractAddress,
  amounts,
  recipients,
  uris,
  network,
}: NewERC1155MintArgs): Task {
  const totalMintAmount = amounts.reduce((a, b) => a + b, 0);
  const description = `Mint ${totalMintAmount} cop${
    totalMintAmount > 1 ? 'ies' : 'y'
  } of a new ERC-1155 token`;
  return {
    adminCheck: {
      contractSpec: 'erc1155',
      creatorContractAddress: contractAddress,
    },
    description,
    inputs: {
      abi: ERC1155CreatorABI,
      address: contractAddress,
      args: [recipients, amounts, uris],
      autoRecover: true,
      method: 'mintBaseNew(address[],uint256[],string[])',
      networkId: network,
      value: BigNumber.from(0),
    },
    name: 'Mint new ERC 1155 token',
    ref: 'mintNewToken1155',
    type: 'tx',
  };
}

/** job definition for a simple mint token function */
export function mintToken(
  data: Readonly<SingleMintInstance>,
  _previousData: Readonly<Partial<SingleMintInstance>>,
  _instanceId: number,
): Job {
  if (!data.contract) {
    throw new Error('No contract specified.');
  }
  // TODO: add contract spec details to schema
  const contractSpec = data.contract.spec.toLowerCase();
  if (contractSpec !== 'erc721' && contractSpec !== 'erc1155') {
    throw new Error(`Unsupported contract spec ${contractSpec}.`);
  }

  if (!data.network) {
    throw new Error('No network specified.');
  }

  if (!data.tokenAsset) {
    throw new Error('No token asset specified.');
  }
  if (!data.tokenAsset.id) {
    throw new Error('Make sure that the token asset is uploaded.');
  }

  let recipients: [string, ...string[]];
  let amounts: [number, ...number[]];
  if (contractSpec === 'erc721') {
    if (!data.erc721MintArgs?.recipient) {
      throw new Error('Invalid recipient for token mint specified.');
    }
    recipients = [data.erc721MintArgs.recipient];
    amounts = [1];
  } else {
    if (!data.erc1155MintArgs?.recipients?.length) {
      throw new Error('Invalid recipients for token mint specified.');
    }
    if (!data.erc1155MintArgs?.amounts?.length) {
      throw new Error('Invalid amounts for token mint specified.');
    }
    if (data.erc1155MintArgs.recipients.length !== data.erc1155MintArgs.amounts.length) {
      throw new Error('Each recipient should have a corresponding amount.');
    }
    recipients = data.erc1155MintArgs.recipients as [string, ...string[]];
    amounts = data.erc1155MintArgs.amounts as [number, ...number[]];
  }

  // task: request switch network to data.network
  // task: upload token asset
  const assetUploadTask: Task = {
    description: 'Upload token asset to decentralised storage',
    inputs: {
      assetId: data.tokenAsset.id,
    },
    name: 'Upload token asset',
    ref: 'uploadAsset',
    type: 'arweave-upload',
  };

  // task: deploy contract if not already deployed
  const studioContractDeployTask: Task = {
    description: "Deploy contract if it's not already deployed",
    inputs: {
      contractId: data.contract.id,
      networkId: data.network,
    },
    name: 'Deploy contract',
    ref: 'deployContract',
    type: 'studio-contract-deploy',
  };

  // task: mint token
  const mintTokenArgs: BaseMintArgs = {
    contractAddress: '{{deployContract.output.contractAddress}}',
    network: data.network,
  };

  const uris = Array<string>(recipients.length).fill('{{uploadAsset.output.asset.arweaveURL}}') as [
    string,
    ...string[],
  ];

  const mintTokenTask =
    contractSpec === 'erc721'
      ? createMintERC721Task({
          ...mintTokenArgs,
          recipient: recipients[0],
          uri: uris[0],
        })
      : createMintERC1155Task({
          ...mintTokenArgs,
          amounts,
          recipients,
          uris,
        });

  return {
    description: 'Preparing and executing token minting',
    identifier: 'token-mint',
    onProgress: (progress: JobProgress) => {
      console.log('progress', progress);
      // if (progress.stage === 'complete-task') {
      //   if (progress.task.ref === 'mintNewToken721') {
      //     console.log('minted 721 token', progress.result);
      //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
      //     const { events, output } = progress.result as any;
      //     // output = tx receipt
      //     console.log('events', events, 'output', output);
      //     postAssetMint(
      //       {
      //         asset: tokenAsset,
      //         chainId: network,
      //         // TODO: somehow get the contract address from the task output
      //         contractAddress: '',
      //         mintSpec: StudioContractSpec.ERC721,
      //         walletIsContract: false,
      //       },
      //       output,
      //     );
      //   } else if (progress.task.ref === 'mintNewToken1155') {
      //     console.log('minted 1155 token', progress.result);
      //   }
      // }
    },
    tasks: [assetUploadTask, studioContractDeployTask, mintTokenTask],
    title: 'Mint Token',
  };
}
