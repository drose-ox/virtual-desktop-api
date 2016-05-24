'use strict';

const constants = require('../../constants');
const db = constants.db;
const params = constants.params;
const Corbeille = require('../../lib/model/corbeille');

module.exports = function(req, res, next) {
    try {
        var login = params.ensureType('string', req, 'body', 'login');
        var password = params.ensureType('string', req, 'body', 'password');
    } catch(err) {
        return next(err);
    }
    var version = 0;
    var connection = null;
    var corbeille = null;
    var user = null;
    return db.getConnection()
    .then(connection_ => {
        connection = connection_;
        return connection.beginTransaction();
    })
    .catch(next)
    .then(() => Corbeille.create(connection, `Corbeille de ${login}`))
    .then(function(corbeille_) {
        corbeille = corbeille_;
        return connection.query(`
            INSERT INTO utilisateur
            ( utl_id
            , utl_login
            , utl_password
            , utl_version
            , crb_id
            ) VALUES
            ( NULL
            , ${connection.escape(login)}
            , ${connection.escape(password)}
            , ${connection.escape(version)}
            , ${connection.escape(corbeille.crb_id)}
            )`);
    })
    .then(function(r) {
        user = {
            utl_id: r.result.insertId,
            utl_login: login,
            utl_password: password,
            utl_version: version,
            crb_id: corbeille.crb_id,
        };
        return connection.commit()
    })
    .then(r => res.status(201).json(user))
    .catch(err => {
        return connection.rollback()
        .then(() => {
            if (err.code
            && err.code === 'ER_DUP_ENTRY'
            && ('' + err).match(/'utl_login_UNIQUE'$/)) {
                return res.status(409).json({
                    error_code: 'E_USER_ALREADY_EXISTS',
                    error_message: 'This username is already taken',
                });
            }
            return next(err);
        });
    });
}