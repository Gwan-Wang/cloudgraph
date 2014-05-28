var socket = io.connect();


function displayNode(data) {
    var node = globalAllNodes[data.id];
    if (!node) {
        node = new Node(data);
        if (config.isDevelopment) {
            node.display.on('dragend', function () {
                socket.emit('dragend', {
                    id: node.data.id,
                    x: node.display.x(),
                    y: node.display.y()
                });
            });
        }
        globalAllNodes[data.id] = node;
    }
    node.show(layer);
}

socket.on('nodes', function(nodes) {
    for (var i in nodes) {
        displayNode(nodes[i]);
    }
});

function displayPath(data) {
    var path = globalAllPaths[data.id];
    if (!path) {
        path = new Path(data);
        globalAllPaths[data.id] = path;
    }
    path.show(layer);
}

socket.on('paths', function(paths) {
    for (var i in paths) {
        displayPath(paths[i]);
    }
});

function displayResource(data) {
    var resource = globalAllResources[data.id];
    if (!resource) {
        resource = new Resource(data);
        globalAllResources[data.id] = resource;
    }
    resource.show(layer);
}

socket.on('resources', function(resources){
    for (var i in resources) {
        displayResource(resources[i]);
    }
});
