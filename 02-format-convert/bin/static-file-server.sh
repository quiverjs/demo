#!/bin/bash

cd `dirname $0`/..

node_modules/.bin/quiver-server . --config ./config.js --main 'quiver file directory handler'