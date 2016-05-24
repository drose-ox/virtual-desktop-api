'use strict';

const db = module.exports;
db.pool = null;

db.init = init;
db.getConnection = getConnection;

function init(pool) {
    db.pool = pool;
}

function getConnection() {
    return new Promise(function(resolve, reject) {
        db.pool.getConnection(function(err, connection) {
            if (err) {
                return reject(err);
            }
            return resolve(wrappedConnection(connection));
        });
    });
}

function wrappedConnection(connection) {
    return {
        beginTransaction: function beginTransaction() {
            return new Promise(function(resolve, reject) {
                connection.beginTransaction(err => err ? reject(err) : resolve());
            });
        },
        rollback: function rollback() {
            return new Promise(function(resolve, reject) {
                connection.rollback(resolve);
            });
        },
        commit: function commit() {
            return new Promise(function(resolve, reject) {
                connection.commit(err => err ? reject(err) : resolve());
            });
        },
        query: function query(query) {
            return new Promise(function(resolve, reject) {
                return connection.query(query, function(err, rows, fields) {
                    if (err) {
                        return reject(err);
                    }
                    return resolve({
                        result: rows,
                        results: rows,
                        rows: rows,
                        fields: fields,
                    });
                });
            });
        },
        release: connection.release.bind(connection),
        escape: connection.escape.bind(connection),
    };
}