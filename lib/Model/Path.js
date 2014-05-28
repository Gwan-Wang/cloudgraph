var DAO = require('./DAO');

var table = 'Path';

module.exports = Path;

function Path() {
    this.id = 0;
    this.name = '';
    this.description = '';
    this.nodes = [];
}

Path.fromRow = function(row) {
    var path = new Path();
    for (var p in row) {
        if (typeof(path[p]) != 'undefined') {
            path[p] = row[p];
        }
    }
    return path;
};

Path.prototype.fetchNodes = function(cb) {
    var path = this;

    DAO.find({
        table: 'NodePath',
        supportQueryProperties: ['path_id'],
        target: {
            path_id: path.id
        },
        order: 'order'
    }, function(err, rows) {
        if (err) { return cb(err); }

        for (var i in rows) {
            path.nodes[i] = rows[i]['node_id'];
        }
        cb();
    });
};

Path.find = function(target, cb) {
    DAO.find({
        table: table,
        supportQueryProperties: ['id', 'name'],
        target: target
    }, function(err, rows) {
        if (err) { return cb(err); }

        var paths = [];
        for (var i in rows) {
            paths[i] = Path.fromRow(rows[i]);
        }
        var cnt = 0;
        paths[i].fetchNodes(function(err) {
            if (err) { return cb(err); }
            ++cnt;
            if (cnt == paths.length) {
                cb(null, paths);
            }
        });
    });
};

/*
Path.find({}, function(err, paths) {
    if (err) { throw err; }
    for (var i in paths) {
        console.log(paths[i]);
    }
});
*/