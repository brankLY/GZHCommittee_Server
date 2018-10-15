#!/usr/bin/env bash

set -e
echo
echo "#####  Delete Chaincode folder if exists  #####"
echo
echo

PARENT_DIR=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )

CHAINCODE_DIR=$PARENT_DIR/../../chaincode
if [ -d $CHAINCODE_DIR ]; then
   if [ -L $CHAINCODE_DIR ]; then
      rm $CHAINCODE_DIR
   else
      rm -rf $CHAINCODE_DIR
   fi
fi


CHAINCODE_URL="git@github.com:XDMu/GZHCommittee_Contract.git"

echo "##### Clone Chaincode to ops/chaincode #####"
git clone $CHAINCODE_URL $CHAINCODE_DIR
rm -rf $CHAINCODE_DIR/.git


# echo
# echo "##### Join Channel #####"
# echo
# DEBUG=bc:* node $PARENT_DIR/join-channel.js
# echo

echo
echo "##### Install Chaincode #####"
DEBUG=bc:* node $PARENT_DIR/install.js
echo


echo
echo "##### Instantiate Chaincode #####"
DEBUG=bc:* node $PARENT_DIR/instantiate.js
echo

