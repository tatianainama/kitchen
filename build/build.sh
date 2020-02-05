#!/bin/bash
docker build -f Dockerfile.base  . -t ktchn
docker build -f Dockerfile.build  --no-cache .  -t ktchn_build
docker create --name build_output -it ktchn_build
docker cp build_output:/kitchn/ktchn/dist/bundle.js backend_output/
docker cp build_output:/kitchn/recipes/build/ frontend_output/
docker rm -f build_output
