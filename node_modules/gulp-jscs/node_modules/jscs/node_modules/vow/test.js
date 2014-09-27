var vow = require('./lib/vow'),
    q = require('q');

var p = vow.fulfill(1);
console.log(
    p.isResolved(),
    p.isFulfilled(),
    p.valueOf());

var p = new vow.Promise(function (resolve) { resolve(1) });
console.log(
    p.isResolved(),
    p.isFulfilled(),
    p.valueOf());

var promise = vow.resolve(new vow.Promise(function (resolve) { resolve(1) }));
console.log(
    promise.isResolved(),
    promise.isFulfilled(),
    p.valueOf());
