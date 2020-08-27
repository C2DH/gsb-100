run-dev:
	REACT_APP_GIT_TAG=$(shell git describe --tags --abbrev=0 HEAD) \
	REACT_APP_GIT_BRANCH=$(shell git rev-parse --abbrev-ref HEAD) \
	REACT_APP_GIT_REVISION=$(shell git rev-parse --short HEAD) \
	yarn start

run-build:
	REACT_APP_GIT_TAG=$(shell git describe --tags --abbrev=0 HEAD) \
	REACT_APP_GIT_BRANCH=$(shell git rev-parse --abbrev-ref HEAD) \
	REACT_APP_GIT_REVISION=$(shell git rev-parse --short HEAD) \
	yarn build

build-docker-image:
	docker build -t c2dhunilu/gsb-100 \
	--build-arg MAPBOX_ACCESS_TOKEN=$(MAPBOX_ACCESS_TOKEN) \
	--build-arg GIT_TAG=$(shell git describe --tags --abbrev=0 HEAD) \
	--build-arg GIT_BRANCH=$(shell git rev-parse --abbrev-ref HEAD) \
	--build-arg GIT_REVISION=$(shell git rev-parse --short HEAD) .

build-docker-snap-copy-image:
	docker build -f Dockerfile-snap-copy -t c2dhunilu/gsb-100-snap .

build-docker-snap-image:
	docker build -f Dockerfile-snap -t c2dhunilu/gsb-100-snap \
	--build-arg MAPBOX_ACCESS_TOKEN=$(MAPBOX_ACCESS_TOKEN) \
	--build-arg GIT_TAG=$(shell git describe --tags --abbrev=0 HEAD) \
	--build-arg GIT_BRANCH=$(shell git rev-parse --abbrev-ref HEAD) \
	--build-arg GIT_REVISION=$(shell git rev-parse --short HEAD) .
