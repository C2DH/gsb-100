# gsb-100
Ostbelgien

## BUILD
```sh
yarn build
```

## REACT SNAP (MAKE IT STATIC)

Run this command after making the first build.
```sh
yarn snap
```

## Release procedure
Github Actions will build and push new images to docker hub whenever the `master` branch is updated.
In this case it will be tagged as *latest* on docker. Whenever a new tag is created,
the action uses it to tag the docker repo accordingly.

1. increment version in package.json
2. Do `yarn install`, commit and push your branch.
3. Create a pull request to `master`. Name it with **new version**, squash and merge.
4. Locally, check out and pull master; tag it with the new version, e.g. `git tag v1.0.0`
5. Push tags to GitHub: `git push origin --tags`

Note: the action may take up to 10 minutes.
