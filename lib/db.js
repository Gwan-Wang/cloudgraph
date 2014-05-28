var mysql = require('mysql');
var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'cgdb'
});

exports.query = function(query, cb) {
    return db.query(query, cb);
};

exports.escape = function(obj) {
    return db.escape(obj);
};

exports.escapeId = function(obj) {
    return mysql.escapeId(obj);
};

exports.close = function() {
    db.destroy();
};