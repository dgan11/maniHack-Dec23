import { InstanceData, InstanceSchema } from '@manifoldxyz/studio-app-sdk';
import { Step } from '@manifoldxyz/studio-app-sdk-react';
import { schema } from '@/schema';

export type SingleMintInstance = InstanceData<InstanceSchema<typeof schema.fields>>;
export type SingleMintStep = Step<typeof schema.fields>;
