#!/usr/bin/env bash

echo
echo "####### Start DappJupiter API Server ########"
echo

echo
echo "### stop DappJupiter container if exists ###"
echo

docker-compose -f ops/api/docker-compose.yaml down

docker volume prune -f

echo
echo "### start DappJupiter ###"
echo

docker-compose -f ops/api/docker-compose.yaml up -d

sleep 2

echo
docker ps -a | egrep "dappjupiter|dappswagger"
echo

echo
docker logs dappjupiter
echo
