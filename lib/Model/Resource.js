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
        }
        return cb(null, resources);
    });
};
