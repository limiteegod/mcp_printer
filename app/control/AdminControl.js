var async = require('async');
var esut = require('easy_util');
var log = esut.log;
var digestUtil = esut.digestUtil;
var pageUtil = esut.pageUtil;
var dc = require('../config/DbCenter.js');
var ec = require('../config/ErrCode.js');
var prop = require('../config/Prop.js');

var AdminControl = function(){
    var self = this;
    self.cmd = {'AD01':0, 'AD02':1, 'AD03':2, 'AD04':3};
    self.cmdArray = [{id:0, code:'AD01', fromType:prop.digestFromType.CACHE, des:"直接出票成功"},
        {id:1, code:'AD02', fromType:prop.digestFromType.CACHE, des:'添加地域'},
        {id:2, code:'AD03', fromType:prop.digestFromType.CACHE, des:'添加联赛'},
        {id:3, code:'AD04', fromType:prop.digestFromType.CACHE, des:'修改联赛'}];
};

AdminControl.prototype.handle = function(headNode, bodyStr, userCb)
{
    var self = this;
    async.waterfall([
        //是否是支持的cmd
        function(cb)
        {
            var cmd = self.cmd[headNode.cmd];
            if(cmd == undefined)
            {
                cb(ec.E9000);
            }
            else
            {
                cb(null);
            }
        },
        //先解密
        function(cb)
        {
            var key = null;
            var decodedBodyStr = digestUtil.check(headNode, key, bodyStr);
            try {
                var bodyNode = JSON.parse(decodedBodyStr);
                cb(null, bodyNode);
            }
            catch (err)
            {
                cb(ec.E9003);
            }
        },
        //check the param
        function(bodyNode, cb){
            var method = 'check' + headNode.cmd;
            self[method](null, headNode, bodyNode, function(err){
                cb(err, bodyNode);
            });
        },
        //业务处理
        function(bodyNode, cb){
            var cmd = 'handle' + headNode.cmd;
            self[cmd](null, headNode, bodyNode, cb);
        }
    ], function (err, bodyNode) {
        userCb(err, bodyNode);
    });
};


AdminControl.prototype.checkAD01 = function(user, headNode, bodyNode, cb)
{
    cb(null);
};

AdminControl.prototype.checkAD02 = function(user, headNode, bodyNode, cb)
{
    cb(null);
};

AdminControl.prototype.checkAD03 = function(user, headNode, bodyNode, cb)
{
    cb(null);
};

AdminControl.prototype.checkAD04 = function(user, headNode, bodyNode, cb)
{
    cb(null);
};

/**
 * find one's all operations
 * @param user
 * @param headNode
 * @param bodyNode
 * @param cb
 */
AdminControl.prototype.handleAD01 = function(user, headNode, bodyNode, cb)
{
    var backBodyNode = {};
    cb(null, backBodyNode);
};

/**
 * save area
 * @param user
 * @param headNode
 * @param bodyNode
 * @param cb
 */
AdminControl.prototype.handleAD02 = function(user, headNode, bodyNode, cb)
{
    var backBodyNode = {};
    var areaTable = dc.main.get("area");
    areaTable.save(bodyNode.area, [], function(err, data){
        if(err)
        {
            cb(ec.E9999);
        }
        else
        {
            cb(err, backBodyNode);
        }
    });
};

/**
 * save area
 * @param user
 * @param headNode
 * @param bodyNode
 * @param cb
 */
AdminControl.prototype.handleAD03 = function(user, headNode, bodyNode, cb)
{
    var backBodyNode = {};
    var leagueTable = dc.main.get("league");
    leagueTable.save(bodyNode.league, [], function(err, data){
        if(err)
        {
            cb(ec.E9999);
        }
        else
        {
            cb(err, backBodyNode);
        }
    });
};

/**
 * @param user
 * @param headNode
 * @param bodyNode
 * @param cb
 */
AdminControl.prototype.handleAD04 = function(user, headNode, bodyNode, cb)
{
    var backBodyNode = {};
    var leagueTable = dc.main.get("league");
    leagueTable.update(bodyNode.cond, bodyNode.data, [], function(err, data){
        cb(null, backBodyNode);
    });
};

var adminControl = new AdminControl();
module.exports = adminControl;