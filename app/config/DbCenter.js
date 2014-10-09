var async = require('async');
var prop = require('./Prop.js');
var esdb = require('easy_db');
var esut = require('easy_util');
var Database = esdb.Database;
var Table = esdb.Table;
var Column = esdb.Column;
var log = esut.log;

var DbCenter = function(){
    var self = this;
};

DbCenter.prototype.init = function(cb)
{
    var self = this;
    async.waterfall([
        //the mongodb
        function(cb){
            self._initMg(function(err){
                cb(err);
            });
        },
        //check the mongodb
        function(cb){
            self._checkMg(function(err){
                cb(err);
            });
        }
    ], function (err, result) {
        cb(err);
    });
};

DbCenter.prototype._initMg = function(cb)
{
    var self = this;
    var db = new Database(prop.dbs[0]);

    //add tables
    var ticket = new Table(db, "ticket", []);
    db.put(ticket);
    var admin = new Table(db, "admin", []);
    db.put(admin);
    self.mg = db;
    self.mg.init(cb);
};

DbCenter.prototype._checkMg = function(cb)
{
    var self = this;
    var adminTable = self.mg.get("admin");
    var admin = {_id:"admin", password:"123456"};
    adminTable.findOne({_id:admin._id}, [], function(err, data){
        if(err)
        {
            cb(err);
        }
        else
        {
            if(!data)
            {
                adminTable.save(admin, [], function(err, data){
                    cb(null);
                });
            }
            else
            {
                cb(null);
            }
        }
    });
};

module.exports = new DbCenter();

