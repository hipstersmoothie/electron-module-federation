## Startup

Install deps:

```sh
yarn
```

### Setup Design System

In one terminal build and serve the design system

```sh
cd packages/design-system
yarn build
cd dist
python3 -m http.server 3001
```

This will create a versioned build of the design system. Create a file in the `dist/` folder called `version-config.json`

```json
{
  "design_system": "1.0.1"
}
```

You can now make a change to the design system, bump the version, and run a new build.
To use the build simply update the version file.

### Setup App

In another terminal start the app

```sh
cd packages/app
yarn build
yarn start
```

Now if you makes changes in the design system, rebuild, and reserve you can refresh the electron app and see the changes.
