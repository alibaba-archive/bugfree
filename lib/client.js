/*!
 * bugfree - lib/bugfree.js
 *
 * Copyright(c) 2013 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var debug = require('debug')('bugfree');
var urllib = require('urllib');
var utility = require('utility');
var eventproxy = require('eventproxy');

/**
 * Create a bugfree API client.
 *
 * @param {Object} options
 *  - {String} api, api root url, e.g.: 'http://your-bugfree-host/api3.php'
 *  - {String} apiKey
 *  - {String} username
 *  - {String} password
 */
function Client(options) {
  this.api = options.api;
  this.apiKey = options.apiKey;
  this.username = options.username;
  this.password = options.password;
  this._session = null;
}

Client.prototype.getBug = function (id, callback) {
  this.request('get', 'getbug', {id: id}, {}, callback);
};

Client.prototype.updateBug = function (data, callback) {
  this.request('post', 'updatebug', data, {}, callback);
};

Client.prototype.getsid = function (callback) {
  this.request('post', 'getsid', {}, {}, callback);
};

Client.prototype.login = function (callback) {
  if (this._session && this._session.timeout > Date.now()) {
    // has logined
    return callback();
  }

  var ep = eventproxy.create();
  ep.fail(callback);

  var that = this;
  that.getsid(ep.done('session'));

  ep.on('session', function (session) {
    var auth = utility.md5(utility.md5(that.username + utility.md5(that.password)) + that.apiKey + session.rand);
    var data = {
      username: that.username,
      auth: auth,
    };

    data[session.sessionname] = session.sessionid;
    that.request('post', 'login', data, {}, function (err, info, res) {
      if (err) {
        return callback(err);
      }
      if (info.status !== 'success') {
        err = new Error(that.username + ' login fail, ' + info.info);
        err.name = 'BugFreeLoginFailError';
        err.data = info;
        return callback(err);
      }
      session.timeout = info.timeout * 1000 - 30000; // before 30 seconds check
      that._session = session;
      callback(null, info);
    });
  });
};

Client.prototype.request = function (method, mode, data, options, callback) {
  var that = this;
  var url = that.api + '?mode=' + mode;
  data = data || {};
  if (that._session && !data[that._session.sessionname]) {
    // auto add session id
    data[that._session.sessionname] = that._session.sessionid;
  }
  options = options || {};
  options.timeout = options.timeout || that.requestTimeout;
  options.method = method || 'POST';
  options.dataType = options.dataType || 'json';
  options.data = data;
  urllib.request(url, options, function (err, resData, res) {
    debug('%s %s %j: status: %s, resData: %d bytes, err: %j',
      method, url, data, res && res.statusCode, resData && resData.length || 0, err);

    that.handleResult(err, resData, res, function (err, result) {
      if (err) {
        err.url = url;
        err.method = method;
      }
      callback(err, result, res);
    });
  });
};

Client.prototype.handleResult = function (err, result, res, callback) {
  var statusCode = res && res.statusCode;
  var headers = res && res.headers || {};
  if (err) {
    if (err.name === 'SyntaxError') {
      err.name = this.constructor.name + 'ReponseFormatError';
      if (res) {
        err.message = 'Parse ' + this.contentType + ' error: ' + err.message;
      }
    } else {
      err.name = this.constructor.name + err.name;
    }
  } else if (statusCode > 300) {
    var errorInfo = result || {};
    err = new Error(errorInfo.message ? errorInfo.message : 'Unknow Error ' + statusCode);
    if (errorInfo.name) {
      err.name = this.constructor.name + errorInfo.name;
    } else {
      err.name = this.constructor.name + statusCode + 'Error';
    }
    err.errors = errorInfo.errors;
  }

  if (err) {
    err.headers = headers;
    if (Buffer.isBuffer(result)) {
      result = result.toString();
    }
    err.data = { resBody: result };
    err.statusCode = statusCode;
    result = null;
  }

  callback(err, result);
};

exports.create = function (options) {
  return new Client(options);
};
