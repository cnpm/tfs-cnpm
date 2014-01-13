/*!
 * tfs-cnpm - lib/tfs.js
 * Author: dead_horse <dead_horse@qq.com>
 */


/**
 * Module dependencies.
 */
var tfs = require('tfs');
var utility = require('utility');

var Nfs = function (options) {
  if (!options || !options.appkey || !options.rootServer) {
    throw new Error('need options.appkey and options.rootServer');
  }

  this.client = tfs.createClient(options);
  this.imageServers = options.imageServers;
};

Nfs.prototype.upload = function (filepath, options, callback) {
  if (typeof options === 'function') {
    callback = options;
  }
  this.client.uploadPrivate(filepath, function (err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, {
      key: result.name
    });
  });
};

Nfs.prototype.remove = function (key, callback) {
  this.client.removeFile(key, callback);
};

Nfs.prototype._download = function (key, saveTo, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = null;
  }
  options = options || {};
  this.client.download(key, saveTo, callback, options.timeout);
};

Nfs.prototype.download = function (key, savePath, options, callback) {
  this._download(key, savePath, options, callback);
};

Nfs.prototype.downloadStream = function (key, writeStream, options, callback) {
  this._download(key, writeStream, options, callback);
};

Nfs.prototype.uploadBuffer = Nfs.prototype.upload;

exports.create = function (options) {
  return new Nfs(options);
};
