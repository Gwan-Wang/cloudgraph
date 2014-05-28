var DAO = require('./DAO');

var table = 'Resource';

module.exports = Resource;

function Resource() {
    this.id = 0;
    this.type = 0;
    this.name = '';
    this.description = '';
    this.comment = '';
    this.rate = 0;
    this.url = '';
    this.extend = '';
    this.nodes = [];
}

Resource.fromRow = function(row) {
    var resource = new Resource();
    for (var p in row) {
        if (typeof(resource[p] != 'undefined')) {
            resource[p] = row[p];
        }
    }
    return resource;
}

Resource.prototype.fetchNodes = function(cb) {
    var resource = this;

    DAO.find({
        table: 'NodeResource',
        supportQueryProperties: ['resource_id'],
        target: {
            resource_id: resource.id
        },
        order: 'node_id'
    }, function(err, rows) {
        if (err) { return cb(err); }

        for (var i in rows) {
            resource.nodes[i] = rows[i]['node_id'];
        }
        cb();
    });
};

Resource.find = function(target, cb) {
    DAO.find({
        table: table,
        supportQueryProperties: ['id', 'name'],
        target: target
    }, function(err, rows) {
        if (err) { return cb(err); }

        var resources = [];
        for (var i in rows) {
            resources[i] = Resource.fromRow(rows[i]);

            resources[i].fetchNodes(function (err) {
                if (err) {
                    return cb(err);
                }


            });
        }
        return cb(null, resources);
    });
};
