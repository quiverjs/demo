#!/bin/bash

cd `dirname $0`/..

node_modules/.bin/quiver-server . --config ./config.js \
  --server-port 8081 --main 'demo proxied image thumbnail handler'