'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapObject = mapObject;
exports.values = values;
exports.omit = omit;
function mapObject(obj, callback) {
  return Object.keys(obj).map(function (key) {
    return callback(obj[key], key);
  });
}

function values(obj) {
  return Object.keys(obj).map(function (key) {
    return obj[key];
  });
}

function omit(obj, omitKeys) {
  if (typeof omitKeys === 'string') omitKeys = [omitKeys];
  var retObj = {};
  Object.keys(obj).filter(function (key) {
    return omitKeys.indexOf(key) === -1;
  }).forEach(function (key) {
    retObj[key] = obj[key];
  });
  return retObj;
}