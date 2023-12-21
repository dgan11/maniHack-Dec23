import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { FieldInput, StudioApp, StudioAppProps, useField } from '@manifoldxyz/studio-app-sdk-react';
import { schema } from './schema';

const BadgeAssetsComponent = () => {
  const badges = useField(schema.fields.badgeAsset);
  const [badgeAssets, setBadgeAssets] = useState([{ id: '', asset: '' }]);
  const [error, setError] = useState('');

  // Function to handle badge assets change
  const handleBadgeInputChange = (index, field, value) => {
    const newBadgeAssets = [...badgeAssets];
    newBadgeAssets[index][field] = value;
    setBadgeAssets(newBadgeAssets);

    // Perform validation
    if (newBadgeAssets.some((_ba) => !_ba.id || !_ba.asset)) {
      setError('Please fill in all badge asset fields');
    } else {
      setError('');
      // Set the data
      badges.set(newBadgeAssets.map((_ba) => ({ id: parseInt(_ba.id), asset: _ba.asset })));
    }
  };

  // Function to add new badge asset input fields
  const addBadgeAsset = () => {
    setBadgeAssets([...badgeAssets, { id: '', asset: '' }]);
  };

  return (
    <>
      <br />
      <label>Badge Asset</label>
      {badgeAssets.map((badgeAsset, index) => (
        <div key={index}>
          <input
            type="number"
            placeholder="ID"
            value={badgeAsset.id}
            onChange={(e) => handleBadgeInputChange(index, 'id', e.target.value)}
          />
          <input
            type="text"
            placeholder="Asset URL"
            value={badgeAsset.asset}
            onChange={(e) => handleBadgeInputChange(index, 'asset', e.target.value)}
          />
        </div>
      ))}
      <button onClick={addBadgeAsset}>Add Badge Asset</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <br />
    </>
  );
};

const BadgeRulesComponent = () => {
  const rules = useField(schema.fields.badgeRules);
  const [badgeRules, setBadgeRules] = useState([
    { name: '', id: '', description: '', multiplier: '' },
  ]);
  const [error, setError] = useState('');

  // Function to handle rules change
  const handleRulesInputChange = (index, field, value) => {
    const newRules = [...badgeRules];
    newRules[index][field] = value;
    setBadgeRules(newRules);

    // Perform validation
    if (newRules.some((r) => !r.name || !r.id || !r.description || !r.multiplier)) {
      setError('Please fill in all rules fields');
    } else {
      setError('');
      rules.set(
        newRules.map((r) => ({
          name: r.name,
          id: parseInt(r.id),
          description: r.description,
          multiplier: parseInt(r.multiplier),
        })),
      );
    }
  };

  // Function to add new badge asset input fields
  const addRule = () => {
    setBadgeRules([...badgeRules, { name: '', id: '', description: '', multiplier: '' }]);
  };

  return (
    <>
      <label>Badge Rules</label>
      {badgeRules.map((rule, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder="name"
            value={rule.name}
            onChange={(e) => handleRulesInputChange(index, 'name', e.target.value)}
          />
          <input
            type="number"
            placeholder="ID"
            value={rule.id}
            onChange={(e) => handleRulesInputChange(index, 'id', e.target.value)}
          />
          <input
            type="text"
            placeholder="description"
            value={rule.description}
            onChange={(e) => handleRulesInputChange(index, 'description', e.target.value)}
          />
          <input
            type="number"
            placeholder="multiplier"
            value={rule.multiplier}
            onChange={(e) => handleRulesInputChange(index, 'multiplier', e.target.value)}
          />
        </div>
      ))}
      <button onClick={addRule}>Add Rule</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <br />
    </>
  );
};

const StepOneComponent = () => {
  return (
    <>
      <label>What should we call this campaign</label>
      <FieldInput field={schema.fields.name} />
      <br />
      <BadgeAssetsComponent />
      <br />
      <BadgeRulesComponent />
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validateStepOneData = async (data: any) => {
  if (!data.name) {
    return { error: 'Enter a name for your campaign', valid: false };
  }
  // if (!data.audience) {
  //   return { error: 'Enter your wallet address', valid: false };
  // }

  return { error: '', valid: true };
};

const StepTwoComponent = () => {
  return (
    <>
      <label>Select an Audience</label>
      <FieldInput field={schema.fields.audience} />
      <br />
    </>
  );
};

const validateStepTwoData = () => {
  return { error: '', valid: true };
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
    {
      Component: () => (
        <div>
          <StepTwoComponent />
        </div>
      ),
      description: 'Audience',
      label: 'Audience',
      title: 'audience',
      validate: validateStepTwoData,
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
