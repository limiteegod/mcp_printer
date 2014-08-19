var digestUtil = require("../util/DigestUtil.js");
var userControl = require("./UserControl.js");

var CmdFactory = function(){};

CmdFactory.prototype.handle = function(headNode, bodyStr, cb)
{
    var decodedBodyStr = digestUtil.check(headNode, bodyStr);
    var cmdGroup = headNode.cmd.match(/[A-Z]+/);
    var backBodyNode = {};
    //用户登录
    if(cmdGroup[0] == "A")
    {
       userControl.handle(headNode, JSON.parse(decodedBodyStr), function(err, backBodyNode){
           var msgNode = digestUtil.generate(headNode, JSON.stringify(backBodyNode));
           cb(err, msgNode);
       });
    }
};

var cmdFactory = new CmdFactory();
module.exports = cmdFactory;