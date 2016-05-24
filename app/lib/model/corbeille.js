'use strict';

const constants = require('../../constants');

const corbeille = module.exports;

corbeille.create = create;

function create(connection, label) {
    var version = 0;
    return connection.query(`
        INSERT INTO corbeille
        ( crb_id
        , crb_label
        , crb_version
        ) VALUES
        ( NULL
        , ${connection.escape(label)}
        , ${connection.escape(version)}
        )`)
    .then(function(r) {
        return {
            crb_id: r.result.insertId,
            crb_label: label,
            crb_version: version,
        };
    });
}