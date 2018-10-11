#!/usr/bin/env bash

echo
echo "####### Start gzhcommittee_server API Server ########"
echo

echo
echo "### stop gzhcommittee_server container if exists ###"
echo

docker-compose -f ops/api/docker-compose.yaml down

docker volume prune -f

echo
echo "### start gzhcommittee_server ###"
echo

docker-compose -f ops/api/docker-compose.yaml up -d

sleep 2

echo
docker ps -a | egrep "gzhcommittee_server|gzhcommittee_serverswagger"
echo

echo
docker logs gzhcommittee_server
echo
