#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ManifoldAwsFrontendStackLib } from '@manifoldxyz/aws-frontend-stack-lib';

const app = new cdk.App();

// Only released by hand for production
// @dev: No need to define bundlePath since '../dist' is already the default
// https://github.com/manifoldxyz/manifold-aws-frontend-stack-lib/blob/main/lib/index.ts#L220
// new ManifoldAwsFrontendStackLib(app, 'StudioAppArtistProofWebsite', {
//   websiteName: 'StudioAppArtistProof',
//   bucketDeploymentMemoryLimit: 512,
//   domainName: 'studio-app-artist-proof.manifold.xyz',
//   env: {
//     account: '743799374440',
//     region: 'us-east-1',
//   },
// });

// Only released by hand as well for staging
// @dev: No need to define bundlePath since '../dist' is already the default
// https://github.com/manifoldxyz/manifold-aws-frontend-stack-lib/blob/main/lib/index.ts#L220
new ManifoldAwsFrontendStackLib(app, 'StudioAppArtistProofStagingWebsite', {
  websiteName: 'StudioAppArtistProofStaging',
  bucketDeploymentMemoryLimit: 512,
  env: {
    account: '743799374440',
    region: 'us-east-1',
  },
});
