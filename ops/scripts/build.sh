#!/usr/bin/env bash

set -v

echo
docker-compose -f ops/api/docker-compose.yaml down

echo
docker rmi $(docker images | grep dappjupiter | awk '{print $3}')

echo
docker build --no-cache -t dappjupiter:0.0.1 .

echo
docker tag dappjupiter:0.0.1 dappjupiter:latest

echo
docker images | grep dappjupiter
