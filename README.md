# gsb-100
Ostbelgien

## development
```sh
yarn install
yarn start
```
or better using Makefile
```sh
yarn install
make run-dev
```
Build is performed every time the `master` branch is update (see below for use in production). To test build:
```sh
yarn build
```

## Deployment and release procedure
Github Actions will build and push new images to docker hub whenever the `master` branch is updated.
In this case it will be tagged as *latest* on docker. Whenever a new tag is created,
the action uses it to tag the docker repo accordingly.

1. increment version in package.json
2. Do `yarn install`, commit and push your branch.
3. Create a pull request to `master`. Name it with **new version**, squash and merge.
4. Locally, check out and pull master; tag it with the new version, e.g. `git tag v1.0.0`
5. Push tags to GitHub: `git push origin --tags`

Note: the action may take up to 10 minutes.


## React SNAP (MAKE IT STATIC)
TO test that snap works correctly, run this command after making the first build.
```sh
yarn snap
```
The Dockerfile-snap generate a docker image which runs the crawl and store the resulting html files:
```sh
make build-docker-snap-image MAPBOX_ACCESS_TOKEN=<your access token here>
```
A simpler approach, if you have already run the `yarn build && yarn snap` command:
```sh
make build-docker-snap-copy-image
```
