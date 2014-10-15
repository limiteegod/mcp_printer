var http = require('http');
var querystring = require('querystring');
var prop = require('../config/Prop.js');
var esut = require('easy_util');
var log = esut.log;
var digestUtil = esut.digestUtil;
var options = prop.platform.site;
var PlatInterUtil = function(){};

PlatInterUtil.prototype.get= function(userId, userType, channelCode, userKey, cmd, body, cb)
{
    body.uniqueId = digestUtil.createUUID();
    var bodyStr = JSON.stringify(body);
    var head = {userId:userId, userType:userType, channelCode:channelCode, digest:"", digestType:"3des", cmd:cmd, ver:prop.platform.ver};
    var encodedBody = bodyStr;
    if(head.digestType.length > 0)
    {
        encodedBody = digestUtil.generate(head, userKey, bodyStr);
    }
    var msgJson = {head:head, body:encodedBody};
    var msgToSend = JSON.stringify(msgJson);
    var post_data  = querystring.stringify({
        message:msgToSend
    });
    var headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length':post_data.length
    };
    options.headers = headers;
    var req = http.request(options, function(res) {
        res.setEncoding('utf8');
        var data = '';
        res.on('data', function (chunk) {
            data += chunk;
        });

        res.on('end', function(){
            var msgNode = JSON.parse(data);
            var bodyStr = digestUtil.check(msgNode.head, userKey, msgNode.body);
            msgNode.body = JSON.parse(bodyStr);
            cb(null, msgNode);
        });
    });
    req.setTimeout(20000, function(){
        cb(new Error("time out"), null);
    });
    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });
    req.write(post_data, "utf8");
    req.end();
};

PlatInterUtil.prototype.getSimple = function(cmd, body, cb)
{
    var self = this;
    var station = prop.station;
    self.get(station.userId, station.userType, station.channelCode, station.key, cmd, body, cb);
};

var platInterUtil = new PlatInterUtil();

module.exports = platInterUtil;



