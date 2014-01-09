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

Nfs.prototype.upload = function (filepath, callback) {
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
  var tfsOptions = this.genTfsOptionsByKey(key);
  this.client.removeFile(tfsOptions.uid, tfsOptions.filename, callback);
};

Nfs.prototype.download = function (key, savePath, callback) {
  this.client.download(key, savePath, callback);
};


Nfs.prototype.uploadBuffer = Nfs.prototype.upload;

exports.create = function (options) {
  return new Nfs(options);
};
