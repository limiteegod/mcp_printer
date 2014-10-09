var ErrCode = function()
{
    var self = this;
    self.E0000 = {repCode:"0000", description:"系统处理成功"};
    self.E0001 = {repCode:"0001", description:"参数错误"};
    self.E0002 = {repCode:"0002", description:"user not exists"};
    self.E0003 = {repCode:"0003", description:"wrong name or wrong password."};
    self.E0004 = {repCode:"0004", description:"message has expired"};
    self.E0005 = {repCode:"0005", description:"user not login"};
    self.E9999 = {repCode:"9999", description:"系统内部错误"};
};
module.exports = new ErrCode();