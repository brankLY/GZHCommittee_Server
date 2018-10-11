#!/usr/bin/env bash

set -v

echo
docker-compose -f ops/api/docker-compose.yaml down

echo
docker rmi $(docker images | grep gzhcommittee_server | awk '{print $3}')

echo
docker build --no-cache -t gzhcommittee_server:0.0.1 .

echo
docker tag gzhcommittee_server:0.0.1 gzhcommittee_server:latest

echo
docker images | grep gzhcommittee_server
