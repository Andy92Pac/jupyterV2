#!/bin/bash

node /home/node/app/index.js "$1"

chmod +x /home/node/app/setup_python.sh
/home/node/app/setup_python.sh

node /home/node/app/poco.js

cp -a /home/node/app/export/. /iexec

