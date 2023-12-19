import { StudioApp, StudioAppProps } from '@manifoldxyz/studio-app-sdk-react';
import { mintToken } from './jobs/mintToken';
import { schema } from './schema';
import configureRecipientsStep from './steps/ConfigureRecipients';
import prepareSingleTokenStep from './steps/PrepareSingleToken';

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
  // steps: [uploadTokenStep, selectContractStep],
  steps: [prepareSingleTokenStep, configureRecipientsStep],
};

export function SingleMintApp() {
  return <StudioApp {...singleMintArgs} />;
}
