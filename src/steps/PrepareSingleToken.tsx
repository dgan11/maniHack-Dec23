import { Step, validateAsset } from '@manifoldxyz/studio-app-sdk-react';
import { schema } from '@/schema';
import { SelectContractStep } from './SelectContractStep';
import { UploadTokenStep } from './UploadTokenStep';

export function PrepareSingleToken() {
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
