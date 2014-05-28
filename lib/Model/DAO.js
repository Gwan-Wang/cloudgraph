var db = require('../db');

exports.find = function(config, cb) {
    if (!cb) { return; }
    var query = 'SELECT * FROM ' + db.escapeId(config.table);
    var condition = false;
    if (config && config.target) {
        for (var i in config.supportQueryProperties) {
            if (typeof(config.target[config.supportQueryProperties[i]]) != 'undefined') {
                condition = true;
                break;
            }
        }
    }
    if (condition) {
        query += ' WHERE ' + db.escape(config.target);
    }
    if (config.order) {
        query += ' ORDER BY ' + db.escapeId(config.order);
    }
    return db.query(query, cb);
};

exports.update = function() {

};
