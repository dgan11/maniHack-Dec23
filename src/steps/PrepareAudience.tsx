import { FormFieldInput, Step, useForm } from '@manifoldxyz/studio-app-sdk-react';
import { schema } from '@/schema';

export function PrepareAudience() {
  const loyalCollectorsArgs = useForm(schema.fields.loyalCollectorsArgs);
  
  return (
    <div className="flex flex-col gap-2 p-4">
      <FormFieldInput
        field={schema.fields.loyalCollectorsArgs.fields.collectors}
        formSchema={schema.fields.loyalCollectorsArgs}
        fieldKey="collectors"
        defaultValue={[]}
      />
    </div>
  );
}

const prepareAudienceStep: Step<typeof schema.fields> = {
  Component: PrepareAudience,
  description:
    'Build audience for loyalty badges by selecting the contracts you would like to use.',
  label: 'Build audience',
  title: 'Create audience for loyalty badges',
  validate: async (data) => {
    const errors = [];
    if (!data.loyalCollectorsArgs?.collectors) {
      return {
        error: 'Please specify loyal collectors.',
        valid: false,
      };
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

export default prepareAudienceStep;