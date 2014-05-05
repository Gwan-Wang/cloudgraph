var DAO = require('./DAO');
var db = require('../db');

var table = 'Node';

module.exports = Node;

function Node(type, name) {
    this.id = 0;
    this.type = type ? type : 0;
    this.name = name ? name : '';
    this.description = null;
    this.x = 0;
    this.y = 0;
    this.icon_url = '';
    this.level = 0;
}

Node.fromRow = function(row) {
    var node = new Node();
    for (var p in row) {
        if (typeof(node[p]) != 'undefined') {
            node[p] = row[p];
        }
    }
    return node;
};

Node.prototype.save = function(cb) {

};

Node.prototype.update = function(cb) {
    var query = 'UPDATE ' + table + ' SET ' + db.escape(this) + ' WHERE id = ' + this.id;
    db.query(query, function(err) {
        if (err) { return cb(err); }
        cb();
    });
};

/*
 * support query property:
 *
 *   id, name
 *
 * e.g.:
 *
 *   Node.find({id: 1}, function(err, nodes) {
 *       if (err) { throw err; }
 *       for (var i in nodes) {
 *           console.log(nodes[i]);
 *       }
 *   });
 */
Node.find = function(target, cb) {
    DAO.find({
        table: table,
        supportQueryProperties: ['id', 'name'],
        target: target
    }, function(err, rows) {
        if (err) { return cb(err); }

        var nodes = [];
        for (var i = 0; i < rows.length; ++i) {
            nodes[i] = Node.fromRow(rows[i]);
        }

        return cb(null, nodes);
    });
};