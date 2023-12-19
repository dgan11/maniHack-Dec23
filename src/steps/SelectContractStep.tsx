import { FieldInput, Step, useField } from '@manifoldxyz/studio-app-sdk-react';
import { schema } from '@/schema_basic';

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

const selectContractStep: Step<typeof schema.fields> = {
  Component: SelectContractStep,
  description: 'Select or create the contract on which to mint.',
  label: 'Contract',
  title: 'Select Contract',
  validate: async (data) => {
    if (!data.network) {
      return {
        error: 'Please select a network.',
        status: false,
      };
    }
    if (!data.contract) {
      return {
        error: 'Please select a contract.',
        status: false,
      };
    }
    return {
      error: '',
      status: true,
    };
  },
};

export default selectContractStep;
