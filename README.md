## Startup

Install deps:

```sh
yarn
```

In one terminal build and serve the design system

```sh
cd packages/design-system
yarn build
cd dist
python3 -m http.server 3001
```

In another terminal start the app

```sh
cd packages/app
yarn build
yarn start
```

Now if you makes changes in the design system, rebuild, and reserve you can refresh the electron app and see the changes.
