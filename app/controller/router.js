'use strict';

const constants = require('../constants');
const log = constants.log;

const router = module.exports;

router.init = init;

function init(app) {
    app.post('/api/v1/users', require('./users/create'));

    app.use(function(err, req, res, next) {
        log.error(err);
        res.status(500).json({
            error_code: 'E_INTERNAL',
            error_message: 'Internal server error',
        });
        process.exit(1);
    });
}