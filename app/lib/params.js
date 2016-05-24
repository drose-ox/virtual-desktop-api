'use strict';

const constants = require('../constants');
const _ = constants.lodash;

module.exports = {
    asIntegerList: asIntegerList,
    asBoolean: asBoolean,
    asNumber: asNumber,
    asStringNumber: asStringNumber,
    asTimestamp: asTimestamp,
    asDate: asDate,
    asInteger: asInteger,
    asString: asString,
    asObject: asObject,
    withoutWhitespace: withoutWhitespace,
    strip: strip,
    empty: empty,
    ensureType: ensureType,
};

function asIntegerList(value, default_value, separator, keepStrings) {
    separator = separator || ',';
    keepStrings = asBoolean(keepStrings, false);
    var valueNoWS = withoutWhitespace('' + value);
    if (!valueNoWS.match(new RegExp('^(\\d+' + separator + ')+(\\d+' + separator + '?)*$'))) {
        return default_value;
    }
    var splitted = valueNoWS.split(separator);
    if (!keepStrings) {
        splitted = _.map(splitted, function(item) {
            return asInteger(item);
        });
    }
    return splitted;
}

function asBoolean(value, default_value) {
    if (typeof default_value == 'undefined') {
        default_value = false;
    }
    if (value === 'true' || value === '1' || value === 1 || value === true) {
        return true;
    }
    if (value === 'false' || value === '0' || value === 0 || value === false || value === '') {
        return false;
    }
    return default_value;
}

function asNumber(value, default_value) {
    var asFloat = parseFloat(value);
    if (isNaN(asFloat)) {
        return default_value;
    }
    return asFloat;
}

function asStringNumber(value, default_value) {
    if (('' + value).match(/^\d+$/)) {
        return value;
    }
    return default_value;
}

function asTimestamp(value, default_value) {
    if (value instanceof Date) {
        value = value.getTime();
    }
    return asStringNumber(value, default_value);
}

function asDate(value, default_value) {
    if (value instanceof Date) {
        return value;
    }
    value = new Date('' + value);
    return value === 'Invalid Date' ? default_value : value;
}

function asInteger(value, default_value) {
    var asInt = parseInt(value, 10);
    if (isNaN(asInt)) {
        return default_value;
    }
    return asInt;
}

function asString(value, default_value, on_empty_value) {
    if (typeof on_empty_value == 'undefined') {
        on_empty_value = '';
    }
    if (value === null || typeof value === 'undefined') {
        return default_value;
    }
    value = '' + value;
    if (!value.length) {
        return on_empty_value;
    }
    return value;
}

function asObject(value, default_value) {
    var object = default_value;
    try {
        object = JSON.parse(value);
    } catch (e) {
        object = default_value;
    }
    return object;
}

function withoutWhitespace(input_string) {
    return input_string.replace(/\s/g, '');
}

function strip(input_string) {
    return input_string.replace(/^\s+|\s+$/g, '');
}

function empty(mixed_var) {
    var undef = null;
    var i = null;
    var len = null;
    var emptyValues = [undef, null, false, 0, '', '0'];
    for (i = 0, len = emptyValues.length; i < len; i++) {
        if (mixed_var === emptyValues[i]) {
            return true;
        }
    }
    if (typeof mixed_var === 'object') {
        for (var key in mixed_var) {
            if (mixed_var[key]) {
                return false;
            }
        }
        return true;
    }
    return false;
}

function ensureType(expectedType, req, paramListName, paramName) {
    var paramValue = req[paramListName][paramName];
    var actualType = typeof paramValue;
    var fn = false;
    _.each(_.keys(module.exports), function(key) {
        if ('as' + expectedType.toLowerCase() === key.toLowerCase()) {
            fn = module.exports[key];
            return;
        }
    });
    var dummy = {};
    var okValue = fn(paramValue, dummy);
    if (okValue === dummy) {
        var message = 'expected type \'' + expectedType + '\' for request \'' + paramListName + '.' + paramName + '\', but got \'' + actualType + '\' (\'' + paramValue + '\')';
        throw new Error(message);
    }
    return okValue;
}