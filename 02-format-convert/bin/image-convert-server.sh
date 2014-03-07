#!/bin/bash

cd `dirname $0`/..

node_modules/.bin/quiver-server . --main 'demo resize image handler'