'use strict';

var should = require('should');

describe('client.test.js', function () {
  var client;

  it.only('should init client', function() {
    client = require('./client');
    should.exist(client);
  });

  describe('getsid()', function () {
    it('should get session info', function (done) {
      client.getsid(function (err, session) {
        should.not.exist(err);
        session.should.have.keys('status', 'code', 'info', 'sessionname', 'sessionid', 'rand');
        session.status.should.equal('success');
        session.code.should.equal(0);
        session.sessionname.should.equal('PHPSESSID');
        session.sessionid.should.length(32);
        session.rand.should.length(5);
        done();
      });
    });
  });

  describe('login()', function () {
    it('should login success', function (done) {
      client.login(function (err, info) {
        should.not.exist(err);
        info.should.have.keys('status', 'info', 'code', 'timeout');
        client._session.timeout.should.equal(info.timeout * 1000 - 30000);
        info.timeout.should.above(Date.now() / 1000 + 3600 * 20);
        done();
      });
    });

    it('should login again success', function (done) {
      client.login(function (err, info) {
        should.not.exist(err);
        done();
      });
    });
  });

  // http://bugfree.corp.taobao.com/bug/257528
  var bugid = 257528;

  describe('getBug()', function () {
    it('should return a bug', function (done) {
      client.getBug(bugid, function (err, bug) {
        should.not.exist(err);
        // console.log(bug);
        bug.id.should.equal(String(bugid));
        done();
      });
    });
  });

  describe('updateBug()', function () {
    it('should update a bug status and add note', function (done) {
      var note = 'commit by @唐逸 at ' + Date() + ':<br><br>' +
        '这是一个 fixbug commit. <a href="http://gitlab.alibaba-inc.com/edp/alimovie/commit/97c1d509025d4fe7d211abbf94b2744589820bd4" target="_blank">97c1d5</a>';

      var data = {
        id: bugid,
        no_bbcode_transfer: 1,
        bug_status: 'Resolved',
        solution: 'see commit log',
        action_note: note,
        ResolvedBuild: '97c1d5',
      };
      client.updateBug(data, function (err, result) {
        should.not.exist(err);
        result.should.eql({ status: 'success', code: 0, info: '操作成功', BugID: '257528' });
        done();
      });
    });

    it('should relation a bug with note', function (done) {
      var note = 'commit by @唐逸 at ' + Date() + ':<br><br>' +
        '这是一个关联bug commit. <a href="http://gitlab.alibaba-inc.com/edp/alimovie/commit/97c1d509025d4fe7d211abbf94b2744589820bd4" target="_blank">97c1d5</a>';
      var data = {
        id: bugid,
        no_bbcode_transfer: 1,
        action_note: note,
      };
      client.updateBug(data, function (err, result) {
        should.not.exist(err);
        result.should.eql({ status: 'success', code: 0, info: '操作成功', BugID: '257528' });
        done();
      });
    });
  });

});
