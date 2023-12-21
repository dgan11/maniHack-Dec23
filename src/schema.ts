import { f, InstanceSchema } from '@manifoldxyz/studio-app-sdk';

/**
 * @dev A central Scehma re-used by the CLI and the Studio App
 *      to define the fields that will be used to create the app
 */
export const schema = new InstanceSchema({
  name: f.String({ isPublic: true }),
  audience: f.AudienceBlueprint({ isPublic: true }),

  badgeAsset: f.Array(
    f.Struct({
      id: f.Number(),
      asset: f.String(),
    }),
    { isPublic: true },
  ),

  badgeRules: f.Array(
    f.Struct({
      name: f.String(),
      id: f.Number(),
      description: f.String(),
      multiplier: f.Number(),
    }),
    { isPublic: true },
  ),
});
