var Node = require('../lib/Model/Node');

exports.get = function(req, res, next) {
    var target = {};
    if (req.param('id')) {
        target.id = parseInt(req.param('id'));
    }

    Node.find(target, function(err, nodes) {
        if (err) { return next(err); }

        if (target.id) {
            res.json(nodes[0]);
        } else {
            res.json(nodes);
        }
    });
};