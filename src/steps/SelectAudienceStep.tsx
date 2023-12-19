import { FieldInput, Step } from '@manifoldxyz/studio-app-sdk-react';
import { schema } from '@/schema';

export function SelectAudienceStep() {
  return (
    <>
      <label className="text-sm">Select an Audience</label>
      <FieldInput field={schema.fields.audience} />
    </>
  );
}

const selectAudienceStep: Step<typeof schema.fields> = {
  Component: SelectAudienceStep,
  description: 'Select and audience you want to use',
  label: 'Audience',
  title: 'Select Audience',
  validate: async (data) => {
    // return {
    //   error: 'Missing required information from asset.',
    //   status: validateAsset(data.tokenAsset),
    // };
    // TODO
    console.log('👨‍👩‍👦‍👦 Audience data: ', data);
    return {
      error: '',
      valid: true,
    };
  },
};

export default selectAudienceStep;
