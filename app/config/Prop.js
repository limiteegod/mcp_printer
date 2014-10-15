var esdb = require('easy_db');

var target = 'dev';
var exports = {};

var argv = process.argv;
var kvs = {};
for(var key in argv)
{
    if(key > 1)
    {
        var kv = argv[key].split("=");
        kvs[kv[0]] = kv[1];
    }
}
if(kvs.target)
{
    target = kvs.target;
}

//runtime target
exports.target = target;

var zzc = {};
if(target == 'dev' || target == 'home')
{
    //平台地址
    var platform = {};
    platform.site = {
        hostname: '127.0.0.1',
        port: 9090,
        path: '/mcp-filter/main/interface.htm',
        method: 'POST'
    };
    platform.ver = "s.1.01";
    exports.platform = platform;


    var station = {userId:'C0001', channelCode:'C0001', userType:2, key:'cad6011f5f174a359d9a36e06aada07e'};
    exports.station = station;

    zzc.site = {
        hostname: '122.0.68.5',
        port: 8046,
        path: '/greatwallweb/main',
        method: 'POST'
    };
    zzc.key = 'hy123456';
    zzc.partnerid = '008611';
    zzc.version = '1.0';
    zzc.dateFmt = 'YYYYMMDDHHmmss';
    zzc.user = {};
    zzc.user.idCard = '130123198907250098';
    zzc.user.userId = '008611';
    zzc.user.phone = '18612100000';
    zzc.user.realname = 'jiuge';
}
if(target == 'test')
{
    //平台地址
    var platform = {};
    platform.site = {
        hostname: '182.254.129.17',
        port: 9090,
        path: '/mcp-filter/main/interface.htm',
        method: 'POST'
    };
    platform.ver = "s.1.01";
    exports.platform = platform;
}
else if(target == 'run')
{
    //平台地址
    var platform = {};
    platform.site = {
        hostname: '127.0.0.1',
        port: 8081,
        path: '/mcp-filter/main/interface.htm',
        method: 'POST'
    };
    platform.ver = "s.1.01";
    exports.platform = platform;
}

exports.zzc = zzc;

//ticket status
exports.ticketStatus = {"received":1000, "send":2000, "send_failure":2500, "send_success":2800, "success":3000,
    "failure":4000, 'man':5000};

//ticket status
exports.ticketStatusArray = [{id:1000, code:'received', des:"已经接收"}, {id:2000, code:'send', des:"正在发送"},
    {id:2500, code:'send_failure', des:"发送失败"},
    {id:2800, code:'send_success', des:"发送成功"},
    {id:3000, code:'success', des:"出票成功"},
    {id:4000, code:'failure', des:"出票失败"},
    {id:5000, code:'man', des:"手工处理"}];

exports.games =
[
    {id:'F01', name:'双色球', playTypes:
        [
            {id:'00', name:'普通', betTypes:
                [
                    {id:'00', name:'单式'},
                    {id:'01', name:'复式'},
                    {id:'02', name:'胆拖'}
                ]
            }
        ]
    }
];

//init the game tree
for(var key in exports.games)
{
    var game = exports.games[key];
    exports.games[game.id] = game;
    for(var pKey in game.playTypes)
    {
        var playType = game.playTypes[pKey];
        playType.parent = game;
        game[playType.id] = playType;

        for(var bkey in playType.betTypes)
        {
            var betType = playType.betTypes[bkey];
            betType.parent = playType;
            playType[betType.id] = betType;
        }
    }
};

/**
 * get the game info
 * @param gameCode
 * @param playTypeCode
 * @param betTypeCode
 * @returns {*}
 */
exports.getGameInfo = function(gameCode, playTypeCode, betTypeCode)
{
    var self = this;
    var obj;
    if(gameCode)
    {
        obj = self.games[gameCode];
    }
    if(playTypeCode)
    {
        obj = obj[playTypeCode];
    }
    if(betTypeCode)
    {
        obj = obj[betTypeCode];
    }
    return obj;
};

exports.getEnumById = function(name, id)
{
    var self = this;
    var array = self[name];
    for(var key in array)
    {
        if(array[key].id == id)
        {
            return array[key];
        }
    }
};

//game type
exports.gameType = {'normal':1, 'gaopin':2, 'jingcai':3};

//暂时支持3种密钥来源
exports.digestFromType = {"NONE":0, "DB":1, "CACHE":2};
exports.digestFromTypeArray = [
    {id:0, code:'NONE', des:"无"},
    {id:1, code:'DB', des:"数据库"},
    {id:2, code:'CACHE', des:"缓存"}
];

//config db basic type
var dbs = [{
    config:{'url':'mongodb://127.0.0.1:27017/print'},
    type:esdb.prop.dbType.mongodb
}];
exports.dbs = dbs;

module.exports = exports;




