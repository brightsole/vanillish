/* eslint-disable import/no-extraneous-dependencies */
const browserEnv = require('browser-env');
require('mock-local-storage');

browserEnv(['window']);
global.window.localStorage = global.localStorage;
