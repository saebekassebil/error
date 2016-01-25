'use strict';

var template = require('string-template');
var extend = require('xtend/mutable');
var isWordBoundary = /[_.-](\w|$)/g;

module.exports = TypedError;

function TypedError(args) {
    if (!args)
      throw new Error('TypedError: must specify options');
    if (!args.type)
      throw new Error(args.type, 'TypedError: must specify options.type');
    if (!args.message)
      throw new Error(args.message, 'TypedError: must specify options.message');

    if (args.fullType)
      throw new Error('TypedError: fullType field is reserved');

    var message = args.message;
    if (args.type && !args.name) {
        var errorName = camelCase(args.type) + 'Error';
        args.name = errorName[0].toUpperCase() + errorName.substr(1);
    }

    extend(createError, args);
    createError._name = args.name;

    return createError;

    function createError(opts) {
        var result = new Error();

        Object.defineProperty(result, 'type', {
            value: result.type,
            enumerable: true,
            writable: true,
            configurable: true
        });

        var options = extend({}, args, opts);
        if (!options.fullType) {
            options.fullType = options.type;
        }

        extend(result, options);
        if (opts && opts.message) {
            result.message = template(opts.message, options);
        } else if (message) {
            result.message = template(message, options);
        }

        return result;
    }
}

function camelCase(str) {
    return str.replace(isWordBoundary, upperCase);
}

function upperCase(_, x) {
    return x.toUpperCase();
}

function has(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
}
