#!/bin/bash

curl ipfs.io/ipfs/"$1"

node /home/node/app/index.js "$1"

chmod +x /home/node/app/setup_python.sh
/home/node/app/setup_python.sh

cp -a /home/node/app/export/. /iexec

