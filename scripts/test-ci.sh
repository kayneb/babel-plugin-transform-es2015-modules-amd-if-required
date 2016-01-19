#!/bin/sh
$(dirname $0)/build.sh
./node_modules/istanbul/lib/cli.js cover ./node_modules/mocha/bin/_mocha -- --ui tdd -R spec ./test