import { useState } from 'react';
import { FormFieldInput, useField, useForm, useSession } from '@manifoldxyz/studio-app-sdk-react';
import { SingleMintStep } from '@/common/types';
import { schema } from '@/schema';

export function AirdropField({ spec }: { spec: string }) {
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

export function ConfigureRecipients() {
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

// TODO(jaxon): continue here
export const configureRecipientsStep: SingleMintStep = {
  Component: ConfigureRecipients,
  description: 'Configure Recipients',
  label: 'Mint Recipient',
  title: 'Configure Recipients',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export default configureRecipientsStep;
