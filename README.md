# babel-plugin-transform-es2015-modules-amd-if-required

[![Build Status](https://travis-ci.org/kayneb/babel-plugin-transform-es2015-modules-amd-if-required.svg?branch=master)](https://travis-ci.org/kayneb/babel-plugin-transform-es2015-modules-amd-if-required)
[![Coverage Status](https://coveralls.io/repos/kayneb/babel-plugin-transform-es2015-modules-amd-if-required/badge.svg)](https://coveralls.io/r/kayneb/babel-plugin-transform-es2015-modules-amd-if-required)

Transforms ES2015 modules to AMD modules, only if they aren't already AMD modules or require configs.

## Installation

```sh
$ npm install babel-plugin-transform-es2015-modules-amd-if-required
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "plugins": ["transform-es2015-modules-amd-if-required"]
}
```

### Via CLI

```sh
$ babel --plugins transform-es2015-modules-amd-if-required script.js
```

### Via Node API

```javascript
require("babel-core").transform("code", {
  plugins: ["transform-es2015-modules-amd-if-required"]
});
```

# License
See [LICENSE.md](./LICENSE.md)