'use strict';

const constants = require('./constants');
const log = constants.log;
const express = constants.express;
const errorhandler = constants.errorhandler;
const bodyParser = constants.bodyParser;
const methodOverride = constants.methodOverride;
const morgan = constants.morgan;
const compression = constants.compression;
const mysql = constants.mysql;

const router = constants.router;
const mysqlSettings = constants.mysqlSettings;
const db = constants.db;
const env = constants.env;

const app = express();

if (env == 'development') {
    app.locals.pretty = true;
    app.use(errorhandler({
        dumpExceptions: true,
        showStack: true,
    }));
}

if (env == 'production' || env == 'testing') {
    app.use(errorhandler());
}

app.enable('trust proxy');
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '1mb',
}));
app.use(bodyParser.json({
    extended: true,
    limit: '1mb',
}));
app.use(methodOverride());
app.use(morgan('\u001b[90m:method :url - \u001b[31m:response-time ms\u001b[90m \u001b[0m'));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,X-HTTP-Method-Override,Accept,Content-Type');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    if (req.method === 'OPTIONS') {
        return res.end();
    }
    return next();
});
app.use(compression());
router.init(app);
const pool = mysql.createPool(mysqlSettings);
db.init(pool);
process.on('exit', exitHandler);
process.on('SIGINT', exitHandler);
process.on('uncaughtException', exitHandler);
log.info(`Listening on port ${constants.serverPort}... (${app.settings.env} mode)`);
app.listen(constants.serverPort);

function exitHandler(options, err) {
    log.error(arguments);
    constants.db.pool.end(function (err) {
        if (err) {
            log.error(err);
        }
    });
    process.exit();
}