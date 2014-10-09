var dc = require('../config/DbCenter.js');
var esut = require('easy_util');
var log = esut.log;
var digestUtil = esut.digestUtil;
var pageUtil = esut.pageUtil;
var prop = require('../config/Prop.js');

var MonitorPageControl = function(){};

MonitorPageControl.prototype.handle = function(headNode, bodyNode, cb)
{
    console.log(bodyNode);
    var self = this;
    var cmd = headNode.cmd;
    self[cmd[1]](headNode, bodyNode, cb);
};


MonitorPageControl.prototype.client = function(headNode, bodyNode, cb)
{
    var self = this;
    var backBodyNode = {title:"client"};
    var machineTable = db.get("machine");
    machineTable.find({}, {ip:1}).toArray(function(err, data){
        backBodyNode.rst = data;
        cb(null, backBodyNode);
    });
};

MonitorPageControl.prototype.detailTicket = function(headNode, bodyNode, cb)
{
    var self = this;
    var backBodyNode = {title:"client"};
    var ticketCol = dc.mg.get("ticket");
    ticketCol.findOne({_id:bodyNode.id}, {}, [], function(err, data){
        if(data)
        {
            data.status = prop.getEnumById("ticketStatusArray", data.status);
            data.game = prop.getGameInfo(data.gameCode);
            console.log(data);
            backBodyNode.rst = data;
        }
        else
        {
            backBodyNode.rst = {};
        }
        cb(null, backBodyNode);
    });
};

MonitorPageControl.prototype.manTicket = function(headNode, bodyNode, cb)
{
    var self = this;
    var backBodyNode = {title:"票据管理"};
    var ticketCol = dc.mg.get("ticket");
    ticketCol.findOne({_id:bodyNode.id}, {}, [], function(err, data){
        if(data)
        {
            data.status = prop.getEnumById("ticketStatusArray", data.status);
            data.game = prop.getGameInfo(data.gameCode);
            console.log(data);
            backBodyNode.rst = data;
        }
        else
        {
            backBodyNode.rst = {};
        }
        cb(null, backBodyNode);
    });
};

MonitorPageControl.prototype.viewTicket = function(headNode, bodyNode, cb)
{
    var self = this;
    var backBodyNode = {title:"view tickets"};
    pageUtil.parse(bodyNode, backBodyNode);
    backBodyNode.ticketStatusArray = prop.ticketStatusArray;
    backBodyNode.games = prop.games;
    var ticketCol = dc.mg.get("ticket");
    var cursor = ticketCol.find(backBodyNode.cond, {}).sort(backBodyNode.sort).skip(backBodyNode.skip).limit(backBodyNode.limit);
    cursor.toArray(function(err, data){
        for(var key in data)
        {
            var ticket = data[key];
            ticket.status = prop.getEnumById("ticketStatusArray", ticket.status);
            ticket.game = prop.getGameInfo(ticket.gameCode);
        }
        backBodyNode.rst = data;

        backBodyNode.count = cursor.count(function(err, count){
            backBodyNode.count = count;
            cb(null, backBodyNode);
        });
    });
};

MonitorPageControl.prototype.mongo = function(headNode, bodyNode, cb) {
    var self = this;
    var backBodyNode = {title:"monitor the mongodb"};
    var rst = [];
    printMgDb.get(null, function(err, data){
        for(var key in data)
        {
            var obj = {name:data[key].collectionName};
            rst[rst.length] = obj;
        }
        backBodyNode.rst = rst;
        console.log(backBodyNode);
        cb(null, backBodyNode);
    });
};

var monitorPageControl = new MonitorPageControl();
module.exports = monitorPageControl;