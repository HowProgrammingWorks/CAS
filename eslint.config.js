'use strict';

const init = require('eslint-config-metarhia');

init[0].languageOptions.globals['crypto'] = true;

module.exports = init;
