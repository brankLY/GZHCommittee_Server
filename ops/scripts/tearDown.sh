#!/usr/bin/env bash


PARENT_DIR=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
COMPOSE_FILE=$PARENT_DIR/../network/docker-compose.yml

docker-compose -f $COMPOSE_FILE down

docker kill $(docker ps -a | grep "5813dc05-c645-4cb2-ad73-159a9375517b" | awk '{print $1}')
docker rm $(docker ps -a | grep "5813dc05-c645-4cb2-ad73-159a9375517b" | awk '{print $1}')
docker rmi $(docker images | grep "5813dc05-c645-4cb2-ad73-159a9375517b" | awk '{print $3}')
