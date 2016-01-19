#!/bin/sh
$(dirname $0)/build.sh
node_modules/mocha/bin/_mocha test --ui tdd
