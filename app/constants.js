'use strict';

const constants = module.exports;

constants.log = require('winston');
constants.express = require('express');
constants.errorhandler = require('errorhandler');
constants.bodyParser = require('body-parser');
constants.methodOverride = require('method-override');
constants.morgan = require('morgan');
constants.compression = require('compression');
constants.lodash = require('lodash');
constants._ = constants.lodash;
constants.mysql = require('mysql');

constants.router = require('./controller/router');
constants.db = require('./lib/db');
constants.params = require('./lib/params');

constants.env = process.env.NODE_ENV || 'development';
constants.serverPort = 3000;

const log = constants.log;
const env = constants.env;

if (env === 'development') {
    constants.mysqlSettings = {
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'virtual-desk',
    };
} else {
    log.error(`mysql settings not set for env == ${env} in lib/constants.js`);
    process.exit(1);
}