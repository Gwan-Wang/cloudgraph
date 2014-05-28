var globalAllNodes = {};
var globalAllPaths = {};
var globalAllResources = {};

function randomColor() {
    var r = parseInt(Math.random() * 16);
    r = r.toString(16);
    var g = parseInt(Math.random() * 16);
    g = g.toString(16);
    var b = parseInt(Math.random() * 16);
    b = b.toString(16);
    return '#' + r + g + b;
}

function Node(data) {
    this.data = data;

    this.display = new Kinetic.Group({
        x: data.x,
        y: data.y
    });

    if (config.isDevelopment) {
        this.display.draggable(true);
    }
}

Node.prototype.show = function(layer) {
    var node = this;

    this.display.on('dragstart', function() {
        this.draging = true;
    });

    this.display.on('mouseup touchend', function() {
        if (!this.draging) {
            focusOnNode(node);
            showNodeDetail(node);
        }
        this.draging = false;
    });

    var point = new Kinetic.Circle({
        radius: this.data.level * config.nodeWidth,
        strokeWidth: 0.5
    });
    point.fillRadialGradientEndRadius(point.radius());
    var color = config.nodeColor ? config.nodeColor : randomColor();
    point.fillRadialGradientColorStops([0, config.backgroundColor, 0.8, config.backgroundColor, 1.0, color]);
//    point.offset({x: point.radius(), y: point.radius()});

    this.display.add(point);

    this.display.on('mouseover', function() {
        point.stroke('red');
        layer.batchDraw();
    });

    this.display.on('mouseout', function() {
        point.stroke('');
        layer.batchDraw();
    });

    var text = new Kinetic.Text({
        x: 0,
        y: point.radius() + config.nodeTextMargin,
        text: this.data.name,
        fontSize: this.data.level * config.nodeFontSize,
        fill: 'white'
    });
    text.offsetX(text.width() / 2);

    this.display.add(text);

    layer.add(this.display);
    layer.batchDraw();
};

/* ======================================================================== */

function Path(data) {
    this.data = data;
    this.display = new Kinetic.Group();
}

Path.prototype.show = function(layer) {
    var path = this;
    this.display.on('mouseup touchend', function() {
        showPathDetail(path);
    });

    var color = config.pathColor ? config.pathColor : randomColor();
    var overColor = randomColor();

    for (var i = 0; i < this.data.nodes.length - 1; ++i) {
        var n0 = globalAllNodes[this.data.nodes[i]];
        var n1 = globalAllNodes[this.data.nodes[i + 1]];

        var dir = {
            x: n1.data.x - n0.data.x,
            y: n1.data.y - n0.data.y
        };
        var len = Math.sqrt(dir.y * dir.y + dir.x * dir.x);
        dir.x /= len;
        dir.y /= len;

        var line = new Kinetic.Line({
            points: [n0.data.x + dir.x * (config.pathNodeMargin + config.nodeWidth),
                     n0.data.y + dir.y * (config.pathNodeMargin + config.nodeHeight),
                     n0.data.x + dir.x * (len - config.pathNodeMargin - config.nodeWidth),
                     n0.data.y + dir.y * (len - config.pathNodeMargin - config.nodeHeight)],
            stroke: color,
            strokeWidth: config.pathStrokeWidth,
//            dash: [2, 10],
            lineCap: 'round'
        });
        this.display.add(line);
    }

    this.display.on('mouseover', function() {
        var lines = this.find('Line');
        lines.each(function(line) {
            line.stroke('red');
            layer.batchDraw();
        });
    });

    this.display.on('mouseout', function() {
        var lines = this.find('Line');
        lines.each(function(line) {
            line.stroke(color);
            layer.batchDraw();
        });
    });

    layer.add(this.display);
    this.display.moveToBottom();

    layer.batchDraw();
};

function Resource(data) {
    this.data = data;
    this.display = new Kinetic.Group();
}

Resource.prototype.show = function(layer) {
    var resource = this;
}