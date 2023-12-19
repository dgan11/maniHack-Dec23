import { FieldInput, Step, validateAsset } from '@manifoldxyz/studio-app-sdk-react';
import { schema } from '@/schema';

export function UploadTokenStep() {
  return (
    <>
      <label className="text-sm">Upload the asset to be minted below</label>
      <FieldInput field={schema.fields.tokenAsset} />
    </>
  );
}

const uploadTokenStep: Step<typeof schema.fields> = {
  Component: UploadTokenStep,
  description: 'Upload the asset to be minted',
  label: 'Token',
  title: 'Upload Token Asset',
  validate: async (data) => {
    return {
      error: 'Missing required information from asset.',
      status: validateAsset(data.tokenAsset),
    };
  },
};

export default uploadTokenStep;
