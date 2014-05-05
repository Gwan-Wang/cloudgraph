var config = {
    nodeTextMargin: 4,
    nodeWidth: 4,
    nodeHeight: 4,
    nodeFontSize: 8,
    nodeColor: '#08f',

    pathStrokeWidth: 2,
    pathNodeMargin: 4,
    pathColor: '#aaa',

    numLevel: 2,

    backgroundColor: '#222',

    isDevelopment: false
};

var stage;
var layer;

$(document).ready(function(){
    var mainMenu = $('#main-menu');

    stage = new Kinetic.Stage({
        container: 'canvas',
        draggable: true
    });

    function resize() {
        var canvas = $('#canvas');
        canvas.width(mainMenu.width());
        canvas.height($(window).height());
        stage.width(canvas.width());
        stage.height(canvas.height());
    }
    $(window).resize(resize);
    resize();

    /*
    var bgLayer = new Kinetic.Layer();
    var img = new Image();
    img.onload = function() {
        var bg = new Kinetic.Image({
            image: img,
            width: stage.width(),
            height: stage.height()
        });

        bgLayer.add(bg);
        bgLayer.batchDraw();
    };
    img.src = "/images/2.jpg";
    stage.add(bgLayer);
    */

    layer = new Kinetic.Layer({
        x: stage.width() / 2,
        y: stage.height() / 2
    });
    layer.scale({x: 2, y: 2});

//    genPoints(100);

    stage.add(layer);

    document.getElementById('canvas').addEventListener('mousewheel', onMouseWheel, false);
});

/*
function showPopupWith(point) {
    var popup = $('#popup');
    var pos = point.getAbsolutePosition();
    var w = point.width();
    var h = point.height();
    var scale = layer.scale();
    w *= scale.x;
    h *= scale.y;

    popup.css('left', pos.x + 'px');
    popup.css('top',  pos.y + 'px');
    popup.css('width', w + 'px');
    popup.css('height', h + 'px');

    popup.popup({
        position: 'bottom center',
        html: ' pos: ' + pos.x + '<br />' + pos.y + '</div>'
    });
}

function hidePopup() {
    var popup = $('#popup');
    popup.css('left', '0px');
    popup.css('right', '0px');
}
*/

function genPoints(count) {

    while (count--) {
        var data = {
            x: (Math.random() * 2 - 1) * stage.width() * 1.5,
            y: (Math.random() * 2 - 1) * stage.height() * 1.5,
            name: count.toString(),
            level: 2
        };
        var node = new Node(data);
        node.show(layer);
    }
}

function onMouseWheel(e) {
    document.getElementById('canvas').removeEventListener('mousewheel', onMouseWheel, false);

    var sign = e.wheelDelta > 0 ? 1 : -1;
    var scale = layer.scale();
    var min = 1;
    var max = Math.pow(2, config.numLevel);
    var zoomAmount = sign > 0 ? scale.x : -scale.x / 2;

    scale.x += zoomAmount;
    scale.x = Math.max(scale.x, min);
    scale.x = Math.min(scale.x, max);

    scale.y += zoomAmount;
    scale.y = Math.max(scale.y, min);
    scale.y = Math.min(scale.y, max);

    var tween = new Kinetic.Tween({
        node: layer,
        duration: 0.8,
        easing: Kinetic.Easings.EaseInOut,
        scaleX: scale.x,
        scaleY: scale.y,
        onFinish: function() {
            document.getElementById('canvas').addEventListener('mousewheel', onMouseWheel, false);
        }
    });
    tween.play();
}
