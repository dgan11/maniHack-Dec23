import { ethers } from 'ethers';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  FieldInput,
  StudioApp,
  StudioAppProps,
  validateAddressOrENS,
} from '@manifoldxyz/studio-app-sdk-react';
/**
 * @dev always import your schema from a different file called `schema.ts`
 *      that way the CLI will also reference the same file organically
 *
 * @note You cannot actually successfully save data using the Save & Next button
 *       until you have your schema published using the CLI. Publishing schema
 *       requires you to have a real App ID to work with. You can create a new
 *       App at https://studio.manifold.xyz/developer/apps. You can then publish
 *       your schema anytime using `yarn studio-app schema <app-id> src/schema.ts`
 *       where <app-id> is the ID of the App you created.
 */
import { schema } from './schema_basic';

/**
 * Needed for ENS name lookup on mainnet
 * User would have to provide this
 */
const provider = new ethers.providers.JsonRpcProvider(
  'https://mainnet.infura.io/v3/6bea709024aa4593b21ca1a28f8fcbb1',
);

const StepOneComponent = () => {
  return (
    <>
      <div className="box-border flex w-full flex-col gap-2 px-4 pb-2">
        <div className="box-border flex w-full gap-4 rounded-md border bg-gray-100 p-4">
          <h3 className="w-[160px]">Campaign Name</h3>
          <div className="grid items-center gap-3">
            <label className="text-sm text-gray-500">What should we call this campaign</label>
            <FieldInput field={schema.fields.name} />
          </div>
        </div>
        <div className="box-border flex w-full gap-4 rounded-md border bg-gray-100 p-4">
          <h3 className="w-[160px]">Your Wallet Address</h3>
          <div className="grid items-center gap-3">
            <label className="text-sm text-gray-500">
              Specify and address as 0xabc..123 or x.eth
            </label>
            <FieldInput field={schema.fields.yourWallet} />
          </div>
        </div>
      </div>
    </>
  );
};

/**
 * Helper we pass into the Steps array later
 * here data looks like this
 * @param data { name: string; yourWallet: string }
 * @returns [boolean, string]:
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validateStepOneData = async (data: any) => {
  if (!data.name) {
    return { error: 'Enter a name for your campaign', valid: false };
  }
  if (!data.yourWallet) {
    return { error: 'Enter your wallet address', valid: false };
  }
  const { message, valid } = await validateAddressOrENS(provider, data.yourWallet);
  return { error: message, valid: valid };
  // return { error: '', valid: true };
};

const args: StudioAppProps<typeof schema.fields> = {
  instanceSchema: schema,
  steps: [
    {
      Component: () => (
        <div>
          <StepOneComponent />
        </div>
      ),
      description: 'Configure your wallet and your name here',
      label: 'Wallet & Name',
      title: 'Setup Wallet And Name',
      validate: validateStepOneData,
    },
  ],
  success: {
    externalCTA: {
      label: 'View test page',
      url: 'https://www.google.com',
    },
  },
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <StudioApp {...args} />
  </React.StrictMode>,
);
