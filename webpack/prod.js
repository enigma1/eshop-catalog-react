'use strict';
const path = require('path');

const common = require('./config');
console.log('[Webpack] Use prod configuration\n');

module.exports = Object.assign({}, common, {
  output: {
    filename: 'main.js',
    devtoolNamespace: 'source-map',
    path: path.resolve(__dirname, './public/production')
  },
  mode: 'production',
});
