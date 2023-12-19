import { Interface } from '@ethersproject/abi';
import type { TransactionReceipt } from '@ethersproject/providers';
import { BigNumber } from 'ethers';
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import {
  ERC721ABI,
  ERC721CreatorABI,
  ERC1155ABI,
  ERC1155CreatorABI,
} from '@manifoldxyz/contract-abis';
import {
  Asset,
  ASSET_UPLOADER_STUDIO_CLIENT_ID,
  InstanceData,
  InstanceSchema,
  Job,
  JobProgress,
  Network,
  StudioContractSpec,
  Task,
} from '@manifoldxyz/studio-app-sdk';
import {
  FieldInput,
  FormFieldInput,
  Step,
  StudioApp,
  StudioAppProps,
  useField,
  useForm,
  useSession,
  validateAsset,
} from '@manifoldxyz/studio-app-sdk-react';
import { schema } from './schema';

export type SingleMintInstance = InstanceData<InstanceSchema<typeof schema.fields>>;
export type SingleMintStep = Step<typeof schema.fields>;

// ################### postMint.ts START ###################
export class AssetClient {
  private static baseUrl = `https://studio.api.manifoldxyz.dev/asset_uploader/${ASSET_UPLOADER_STUDIO_CLIENT_ID}`;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
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
// ################### postMint.ts END ###################

// <<<<<<<<<<<<<<<<<<< mintToken.ts job START <<<<<<<<<<<<<<<<<<<
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

function createMintERC721Task({
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

function createMintERC1155Task({
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
// <<<<<<<<<<<<<<<<<<< mintToken.ts job END <<<<<<<<<<<<<<<<<<<

// ==================== ConfigureRecipients Start ====================
function AirdropField({ spec }: { spec: string }) {
  if (!spec || (spec !== 'erc721' && spec !== 'erc1155')) {
    throw new Error('Unrecognised contract spec ' + spec);
  }

  const is721 = spec === 'erc721';

  if (is721) {
    return (
      <label className="flex flex-col text-sm">
        Configure recipient
        <FormFieldInput
          field={schema.fields.erc721MintArgs.fields.recipient}
          formSchema={schema.fields.erc721MintArgs}
          fieldKey="recipient"
          defaultValue={''}
        />
      </label>
    );
  }
  // is 1155

  return (
    <label className="flex flex-col text-sm">
      Configure recipients
      {/* <FormFieldInput
      defaultValue={session.creator?.address}
      field={schema.fields.erc1155MintArgs.fields.recipients}
      formSchema={schema.fields.erc1155MintArgs}
      fieldKey="recipients"
    /> */}
      TODO: some input form here
    </label>
  );
}

function ConfigureRecipients() {
  const currentContract = useField(schema.fields.contract);
  const erc721Form = useForm(schema.fields.erc721MintArgs);
  const erc1155Form = useForm(schema.fields.erc1155MintArgs);
  const session = useSession();
  const [isAirdrop, setIsAirdrop] = useState(false);

  function onMintTargetChanged(event: React.ChangeEvent<HTMLInputElement>) {
    const changedToAirdrop = event.target.value === 'true';
    setIsAirdrop(changedToAirdrop);
    if (!changedToAirdrop) {
      // set default recipient to self
      erc721Form.recipient.set(session.creator.address);
      erc1155Form.recipients.set([session.creator.address]);
    }
  }

  if (!currentContract.current) {
    return <div>Contract not selected; please go back to previous step.</div>;
  }
  const is721 = currentContract.current.spec.toLowerCase() === 'erc721';

  return (
    <>
      <fieldset className="flex flex-col gap-2 p-4">
        <legend>Mint...</legend>
        <label>
          <input
            type="radio"
            checked={!isAirdrop}
            value="false"
            onChange={onMintTargetChanged}
          />{' '}
          to myself
        </label>
        <label>
          <input
            type="radio"
            checked={isAirdrop}
            value="true"
            onChange={onMintTargetChanged}
          />{' '}
          an airdrop
        </label>
      </fieldset>
      {isAirdrop && <AirdropField spec={currentContract.current.spec.toLowerCase()} />}
      {!isAirdrop && !is721 && (
        <label>
          Quantity to mint:
          <FormFieldInput
            field={schema.fields.erc1155MintArgs.fields.amounts}
            formSchema={schema.fields.erc1155MintArgs}
            fieldKey="amounts"
          />
        </label>
      )}
    </>
  );
}

const configureRecipientsStep: SingleMintStep = {
  Component: ConfigureRecipients,
  description: 'Configure Recipients',
  label: 'Mint Recipient',
  title: 'Configure Recipients',
  validate: async (data: any) => {
    if (!data.contract) {
      return {
        error: 'Please ensure a contract is selected.',
        valid: false,
      };
    }
    if (data.contract.spec === 'erc1155') {
      if (!data.erc1155MintArgs?.recipients?.length) {
        return {
          error: 'Please specify recipients.',
          valid: false,
        };
      }
      if (!data.erc1155MintArgs?.amounts?.length) {
        return {
          error: 'Please specify amounts.',
          valid: false,
        };
      }

      if (data.erc1155MintArgs.recipients.length !== data.erc1155MintArgs.amounts.length) {
        return {
          error: 'Please ensure each recipient has an entered amount.',
          valid: false,
        };
      }
    }
    if (data.contract.spec === 'erc721') {
      if (!data.erc721MintArgs?.recipient?.length) {
        return {
          error: 'Please select a recipient.',
          valid: false,
        };
      }
    }
    // TODO: actually validate addresses; amounts
    return {
      error: '',
      valid: true,
    };
  },
};

/**
 * React component for uploading the asset to be minted
 * Child of PrepareSingleToken
 */
export function UploadTokenStep() {
  return (
    <>
      <label className="text-sm">Upload the asset to be minted below</label>
      <FieldInput field={schema.fields.tokenAsset} />
    </>
  );
}

/**
 * React component for selecting the contract and network on which to mint on
 * Child of PrepareSingleToken
 */
export function SelectContractStep() {
  const network = useField(schema.fields.network);

  return (
    <>
      <label className="text-sm">Select the network you want to mint on</label>
      <FieldInput field={schema.fields.network} />

      <label className="text-sm">Select the contract you want to mint on</label>
      <FieldInput
        field={schema.fields.contract}
        disabled={!network.current}
      />
    </>
  );
}

function PrepareSingleToken() {
  return (
    <div className="flex flex-col gap-2 p-4">
      <UploadTokenStep />
      <SelectContractStep />
    </div>
  );
}

const prepareSingleTokenStep: Step<typeof schema.fields> = {
  Component: PrepareSingleToken,
  description: 'Upload the asset to be minted and select the contract on which to mint.',
  label: 'Create Token',
  title: 'Create your new token',
  validate: async (data) => {
    const errors = [];
    if (!data.network) {
      errors.push('network');
    }

    if (!data.contract) {
      errors.push('contract');
    }

    if (!data.tokenAsset) {
      errors.push('token asset');
    } else {
      if (!validateAsset(data.tokenAsset)) {
        errors.push('data for token asset');
      }
    }

    let errorMessage = '';
    if (errors.length) {
      errorMessage += 'Incomplete data: please check ';
      errorMessage += errors.join(', ');
      errorMessage += ' field';
      if (errors.length > 1) {
        errorMessage += 's';
      }
      errorMessage += '.';
    }

    return {
      error: errorMessage,
      valid: !errors.length,
    };
  },
};

export default prepareSingleTokenStep;

/**
 * Args to pass into the studio app
 * This will include all the jobs, steps
 * (including their components and validation functions)
 * and the instance schema (for the instance data)
 */
const singleMintArgs: StudioAppProps<typeof schema.fields> = {
  instanceSchema: schema,
  jobs: {
    mintToken: mintToken,
  },
  preview: {
    onAfterPublish: async (data) => {
      // make fetch call to register asset as minted to API
      console.log('on after publish called', data);
    },
    onBeforePublish: async (data, jobs, alreadyPublished) => {
      console.log('on before publish called', data, alreadyPublished);
      if (!jobs.mintToken) {
        throw new Error('mintToken job not found');
      }
      if (!alreadyPublished) {
        await jobs.mintToken.start();
      } else {
        console.log('already published, skipping mint (retrying)');
        await jobs.mintToken.start();
      }

      console.log('minted');
    },
  },
  steps: [prepareSingleTokenStep, configureRecipientsStep],
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    {/* <StudioApp {...args} /> */}
    <StudioApp {...singleMintArgs} />
  </React.StrictMode>,
);
