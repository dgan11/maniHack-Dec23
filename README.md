# Hackathon 2023 App Templates
Template repo for getting you started on developing a Studio App using the newest V3 Content Framework!

# 🚀 Available Scripts

In the project directory, you can run:

## ⚡️ start

```
yarn dev
```

Runs the app in the development mode.

## 👀 view dev build

This app is meant to run in an iframe inside of Manifold Studio CMS. To see it, choose "Development URL" when opening your app from the Developer panel. You'll be taken to the page that will serve your local app instead of production files.

Hot reloading is enabled, so the app should just reload whenever you make changes while `yarn dev` is running. That being said, it can be a little flaky at times so always triple check.


## 🦾 build

```
yarn build
```

or

```
yarn build
```

Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance. The build is minified and the filenames include the hashes.

## 🧶 lint

```
yarn lint
```

or

```
yarn lint:fix
```

Creates a `.eslintcache` file in which ESLint cache is stored. Running this command can dramatically improve ESLint's running time by ensuring that only changed files are linted.

Also does some minor formatting.

# Content Frameworks Documentation

See the Content Frameworks Technical Guide for technical details including how to use the CLI etc.
* https://www.notion.so/manifoldxyz/Manifold-Studio-App-Content-Frameworks-Technical-Guide-3bc8ba8a10e344558cf7b88034168c29#c35086fab8e04487af357c200096801b

See the Hackathon Participant Guide for a high level overview of the Content Frameworks in relation to the Hackathon.
* https://www.notion.so/manifoldxyz/Hackathon-Participant-Info-Centre-3ed6e1eb65aa4c66bf139ab3f6b1e974

If you'd like to see another example of the Content Framework in action as a reference check out the [Artist Proof Studio App](https://github.com/manifoldxyz/studio-app-artist-proof) repository.

