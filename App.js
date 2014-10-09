var express = require('express'), app = express();
var http = require('http');
var async = require('async');
var httpServer = http.createServer(app);
var io = require('socket.io')(httpServer);
var cmdFactory = require("./app/control/CmdFactory.js");
var pageControl = require("./app/control/PageControl.js");
var errCode = require("./app/config/ErrCode.js");
var monitorFactory = require('./app/common/MonitorFactory.js');
var dc = require('./app/config/DbCenter.js');
var prop = require('./app/config/Prop.js');

var esut = require('easy_util');
var digestUtil = esut.digestUtil;
var log = esut.log;


//app.use(express.logger());

var App = function(io){
    var self = this;
    self.io = io;
};

App.prototype.start = function()
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
        //start web
        function(cb)
        {
            self.startWeb();
            cb(null, "success");
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

App.prototype.startWeb = function()
{
    var self = this;

    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');

    //是Connect內建的middleware，设置此处可以将client提交过来的post请求放入request.body中
    app.use(express.bodyParser());
    //是Connect內建的，可以协助处理POST请求伪装PUT、DELETE和其他HTTP methods
    app.use(express.methodOverride());
    //route requests
    app.use(app.router);
    //public文件夹下面的文件，都暴露出来，客户端访问的时候，不需要使用public路径
    app.use(express.static('/data/app/node_kissy/public'));

    app.configure('development', function(){
        app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
    });

    app.configure('production', function(){
        app.use(express.errorHandler());
    });

    app.get('/', function(req, res){
        res.render('index', {
            title: 'Express',
            youAreUsingJade:true
        });
    });

    app.get('/:name', function(req, res, next){
        var path = req.params.name.match(/^([a-zA-Z0-9_]+)(\.html)$/);
        if(path)
        {
            var jadePathArray = path[1].split("_");
            var jadePath = jadePathArray.join("/");
            var headNode = {cmd:jadePathArray};
            pageControl.handle(headNode, req.query, function(err, data){
                if(err) throw err;
                //console.log(data);
                res.render(jadePath, data);
            });
        }
        else
        {
            next();
        }
    });

    app.post("/mcp-filter/main/interface.htm", function(req, res){
        var message = req.body.message;
        self.handle(message, function(backMsgNode){
            res.json(backMsgNode);
            log.info(backMsgNode);
        });
    });

    app.get("/mcp-filter/main/interface.htm", function(req, res){
        var message = req.query.message;
        self.handle(message, function(backMsgNode){
            res.json(backMsgNode);
            log.info(backMsgNode);
        });
    });

    //zzc print notify
    app.post("/main/zzc_notify.htm", function(req, res){
    });


    self.io.on('connection', function(socket){

        console.log('a user connected');

        socket.on('message', function(msg){

            monitorFactory.handle(msg, function(err, headNode, bodyNode){
                var decodedBodyStr = digestUtil.generate(headNode, null, JSON.stringify(bodyNode));
                var msgNode = {head:headNode, body:decodedBodyStr};
                self.io.emit("message", JSON.stringify(msgNode));
            });
        });

        socket.on('disconnect', function(){
        });
    });

    httpServer.listen(9082);
};

App.prototype.handle = function(message, cb)
{
    var self = this;
    log.info(message);
    try {
        var msgNode = JSON.parse(message);
        var headNode = msgNode.head;
        var bodyStr = msgNode.body;
        cmdFactory.handle(headNode, bodyStr, function(err, bodyNode) {
            var key = headNode.key;
            headNode.key = undefined;
            if(key == undefined)
            {
                key = digestUtil.getEmptyKey();
                if(headNode.digestType == '3des')
                {
                    headNode.digestType = "3des-empty";
                }
            }
            if (bodyNode == undefined) {
                bodyNode = {};
            }
            if (err) {
                bodyNode.repCode = err.repCode;
                bodyNode.description = err.description;
            }
            else
            {
                bodyNode.repCode = errCode.E0000.repCode;
                bodyNode.description = errCode.E0000.description;
            }
            log.info(bodyNode);
            var decodedBodyStr = digestUtil.generate(headNode, key, JSON.stringify(bodyNode));
            cb({head: headNode, body: decodedBodyStr});
        });
    }
    catch (err)
    {
        cb({head:{cmd:'E01'}, body:JSON.stringify(errCode.E2058)});
        return;
    }
};

new App(io).start();


