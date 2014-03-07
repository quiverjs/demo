#!/bin/bash

cd `dirname $0`/..

curl http://localhost:8080 -X POST --data-binary @static/images/blue-hat.jpg > temp/out.jpg