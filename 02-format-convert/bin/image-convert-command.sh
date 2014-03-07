#!/bin/bash

cd `dirname $0`/..

node_modules/.bin/quiver-command . --config ./config.js --main 'demo resize image handler' \
  < static/images/blue-hat.jpg > temp/out.jpg