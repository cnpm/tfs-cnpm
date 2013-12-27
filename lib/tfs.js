/*!
 * tfs-cnpm - lib/tfs.js 
 * Author: dead_horse <dead_horse@qq.com>
 */


/**
 * Module dependencies.
 */
var tfs = require('tfs');
var utility = require('utility');

var defaultOptions = {
  rootServer: 'restful-store.daily.tbsite.net:3800',
  appkey: 'tfscom',
  imageServers: [
    'img01.daily.taobaocdn.net',
    'img02.daily.taobaocdn.net'
  ]
};

var Nfs = function (options) {
  options = options || {};
  for (var key in defaultOptions) {
    if (!options[key]) {
      options[key] = defaultOptions[key];
    }
  }

  this.client = tfs.createClient(options);
  this.imageServers = options.imageServers;
  this.index = 0;
};

Nfs.prototype.url = function (key) {
  var url = 'http://' + this.imageServers[this.index] + this.genTfsOptionsByKey(key).path;
  this.index = (this.index + 1) % this.imageServers.length;
  return url;
};

Nfs.prototype.upload = function (filepath, options, callback) {
  var tfsOptions = this.genTfsOptionsByKey(options.key);
  this.client.uploadFile(filepath, tfsOptions.uid, tfsOptions.filename, callback);
};

Nfs.prototype.remove = function (key, callback) {
  var tfsOptions = this.genTfsOptionsByKey(key);
  this.client.removeFile(tfsOptions.uid, tfsOptions.filename, callback);
};

Nfs.prototype.genTfsOptionsByKey = function (key) {
  var uid = parseInt(utility.md5(key), 16) % 100000;
  var filename = key.slice(key.lastIndexOf('/') + 1);
  return {
    uid: uid.toString(),
    filename: filename,
    path: '/L1/1/' + uid + '/' + filename
  };
};

Nfs.prototype.uploadBuffer = Nfs.prototype.upload;

exports.create = function (options) {
  return new Nfs(options);
};
