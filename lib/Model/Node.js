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
    this.resources = [];
}

Node.prototype.fetchResources = function(cb) {
    var node = this;

    DAO.find({
        table: 'NodeResource',
        supportQueryProperties: ['node_id'],
        target: {
            node_id: node.id
        },
        order: 'node_id'
    }, function(err, rows) {
        if (err) { return cb(err); }

        for (var i in rows) {
            node.resources[i] = rows[i]['resource_id'];
        }
        cb();
    });
};

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
        var cnt = 0;
        for (var i in rows) {
            nodes[i] = Node.fromRow(rows[i]);

            nodes[i].fetchResources(function (err) {
                if (err) {
                    return cb(err);
                }
                ++cnt;
                if (cnt == nodes.length) {
                    cb(null, nodes);
                }
            });

        }
    });
};