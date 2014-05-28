var Node = require('./Model/Node');
var Path = require('./Model/Path');
var Resource = require('./Model/Resource');
var socketio = require('socket.io');
var io;

function sendAllNodes(socket) {
    Node.find({}, function(err, nodes) {
        if (err) { return console.log(err); }
        socket.emit('nodes', nodes);
    });
}

function sendAllPaths(socket) {
    Path.find({}, function(err, paths) {
        if (err) { return console.log(err); }
        socket.emit('paths', paths);
    });
}

function sendAllResources(socket) {
    Resource.find({}, function(err, resources) {
        if (err) { return console.log(err); }
        socket.emit('resources', resources);
    });
}

function handleEvents(socket) {
    if (socket.isDevelopment) {
        socket.on('dragend', function (obj) {
            Node.find({id: obj.id}, function (err, nodes) {
                if (err) {
                    return console.log(err);
                }
                var node = nodes[0];
                node.x = obj.x;
                node.y = obj.y;
                node.update(function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log('node{id: ' + node.id + '} has been moved to (' + node.x + ', ' + node.y + ').');
                });
            });
        });
    }
}

exports.listen = function(server) {
    io = socketio.listen(server);
    io.set('log level', 1);

    io.sockets.on('connection', function(socket) {
        socket.isDevelopment = server.isDevelopment;

        sendAllNodes(socket);
        sendAllPaths(socket);
        sendAllResources(socket);
        handleEvents(socket);
    });
};
