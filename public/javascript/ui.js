$('#left-sidebar')
    .sidebar({overlay: true})
    .sidebar('attach events', '#toggle-left-sidebar')
    .sidebar('attach events', '#close-left-sidebar', 'close')
;

$('#node-detail-sidebar')
    .sidebar({overlay: true})
    .sidebar('attach events', '#close-node-detail-sidebar')
;

$('#path-detail-sidebar')
    .sidebar({overlay: true})
    .sidebar('attach events', '#close-path-detail-sidebar', 'close')
;

function showNodeDetail(node) {
    $('#path-detail-sidebar').removeClass('active');

    $('#node-detail-sidebar-header').text(node.data.name);
    $('#node-detail-sidebar').addClass('active');

    var content = $('#node-detail-sidebar-content');
    content.html('');
}

function showPathDetail(path) {
    $('#node-detail-sidebar').removeClass('active');

    $('#path-detail-sidebar-header').text(path.data.name);
    $('#path-detail-sidebar').addClass('active');

    var content = $('#path-detail-sidebar-content');
    content.html('<div class="item"></a>');
    for (var i in path.data.nodes) {
        var node = globalAllNodes[path.data.nodes[i]];
        content.append('<a class="item" onclick="onPathDetailItemClick(' + node.data.id + ')">' + node.data.name + '</a>');
    }
}

function focusOnNode(node) {
    var cx = (stage.width() - $('#path-detail-sidebar').width()) / 2;
    var cy = stage.height() / 2;
    var tween = new Kinetic.Tween({
        node: layer,
        duration: 0.8,
        easing: Kinetic.Easings.EaseInOut,
        x: cx - node.data.x * layer.scaleX() - stage.x(),
        y: cy - node.data.y * layer.scaleY() - stage.y()
    });
    tween.play();
}

var preNode;

function onPathDetailItemClick(id) {
    if (preNode) {
        preNode.display.fire('mouseout');
    }
    var node = globalAllNodes[id];
    node.display.fire('mouseover');
    focusOnNode(node);
    preNode = node;
}

function closeDetail() {
    $('#right-sidebar').removeClass('active');
}