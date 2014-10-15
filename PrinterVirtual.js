var CronJob = require("cron").CronJob;
var util = require("util");
var DOMParser = require('xmldom').DOMParser;
var XMLSerializer = require('xmldom').XMLSerializer;
var moment = require('moment');
var async = require('async');
var platInterUtil = require('./app/util/PlatInterUtil.js');
var zzcInterUtil = require('./app/util/ZzcInterUtil.js');

var esut = require('easy_util');
var digestUtil = esut.digestUtil;
var log = esut.log;

var dc = require('./app/config/DbCenter.js');
var prop = require('./app/config/Prop.js');
var zzc = prop.zzc;


var PrinterVirtual = function(){
    var self = this;
};


PrinterVirtual.prototype.start = function()
{
    var self = this;
    async.waterfall([
        //connect mdb
        function(cb)
        {
            dc.init(function(err, db){
                cb(err);
            });
        },
        //start get tickets from plat
        function(cb)
        {
            self.getTicketFromPlat();
            cb(null);
        },
        //start print
        function(cb)
        {
            self.startPrintJob();
            cb(null);
        }
    ], function (err, result) {
        if(err)
        {
            console.log('err: ', err); // -> null
        }
        else
        {
            console.log('result: ', result); // -> 16
        }
    });
};

PrinterVirtual.prototype.saveTickets = function(tickets)
{
    var self = this;
    var ticketCol = dc.mg.get("ticket");
    for(var key in tickets)
    {
        var ticket = tickets[key];
        ticket._id = ticket.id; //rewrite the mgdb id
        ticket.status = prop.ticketStatus.received;
        var name = ticket.gameCode + "_" + ticket.playTypeCode + "_" + ticket.betTypeCode;
        var col = dc.mg.pool.getConn().conn.collection(name);
        col.save(ticket, [], function(err, data){
        });
        ticketCol.save(ticket, [], function(err, data){
        });
    }
};

PrinterVirtual.prototype.getTicketFromPlat = function()
{
    var self = this;
    self.getJob = new CronJob('*/5 * * * * *', function () {
        var hasNextPage = true;
        async.whilst(
            function() { return hasNextPage;},
            function(whiCb) {
                async.waterfall([
                    //get orders
                    function(cb)
                    {
                        var bodyNode = {size:10};
                        platInterUtil.getSimple("P12", bodyNode, function(err, backMsgNode){
                            var backBodyNode = backMsgNode.body;
                            log.info(backBodyNode);
                            //if has next page, continue get tickets
                            hasNextPage = backBodyNode.pi.hasNextPage;
                            cb(null, backBodyNode.rst);
                        });
                    },
                    //get tickets
                    function(orders, cb)
                    {
                        for(var key in orders)
                        {
                            var order = orders[key];
                            var bodyNode = {orderId:order.orderId};
                            platInterUtil.getSimple("P06", bodyNode, function(err, backMsgNode){
                                var backBodyNode = backMsgNode.body;
                                log.info(backBodyNode);
                                self.saveTickets(backBodyNode.tickets);
                            });
                        }
                        cb(null, "OK");
                    }
                ], function (err, result) {
                    if(err)
                    {
                        console.log('err: ', err);
                    }
                    else
                    {
                        whiCb();
                        console.log('result: ', result);
                    }
                });
            },
            function(err) {
                console.log('1.1 err: ', err); // -> undefined
            }
        );
    }, null, false, 'Asia/Shanghai');
    self.getJob.start();
};


/**
 * print the ticket
 */
PrinterVirtual.prototype.startPrintJob = function()
{
    var self = this;
    self.printJob = new CronJob('*/5 * * * * *', function () {
        self.print("F01_00_00");
        self.print("F01_00_01");
        self.print("F01_00_02");
    });
    self.printJob.start();
};

/**
 * print the ticket
 */
PrinterVirtual.prototype.print = function(name)
{
    var self = this;
    var col = dc.mg.pool.getConn().conn.collection(name);
    var continuable = true;
    var ticketArray = [];
    async.whilst(
        function() { return continuable;},
        function(whiCb) {
            col.findAndRemove({}, {}, {}, function(err, data){
                if(data)
                {
                    self.printSuccess(data, function(){
                        whiCb();
                    });
                }
                else
                {
                    whiCb();
                    continuable = false;
                }
            });
        },
        function(err) {
            console.log('1.1 err: ', err); // -> undefined
        }
    );
};

/**
 * print success
 * @param name
 */
PrinterVirtual.prototype.printSuccess = function(ticket, cb)
{
    var self = this;
    var platBody = {ticketId:ticket.id, code:0, rNumber:ticket.numbers};
    platInterUtil.getSimple("P02", platBody, function(err, data){
        var ticketCol = dc.mg.get("ticket");
        ticketCol.update({_id:ticket.id}, {$set:{platCode:data.body.repCode, platDes:data.body.description,
                status:prop.ticketStatus.man}},
            [], function(err, data){
                cb(null);
            });
    });
};

var p = new PrinterVirtual();
p.start();