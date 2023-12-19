import { f, InstanceSchema } from '@manifoldxyz/studio-app-sdk';

/**
 * @dev A central Scehma re-used by the CLI and the Studio App
 *      to define the fields that will be used to create the app
 */
export const schema = new InstanceSchema({
  name: f.String({ isImmutable: true, isPublic: true }),
  yourWallet: f.Address({ isPublic: true }),
});
