const WALL = 0;
const OPEN = 1;
const START = 2;
const GOAL = 3;
const EXPLORED = 4;

const WALL_COLOR = "#A9A9A9";
const OPEN_COLOR = "#45AAB8";
const START_COLOR = "#98FB98";
const GOAL_COLOR = "#FF5C5C";
const EXPLORED_COLOR = "#4F7942";
const BORDER_COLOR = "#FFFFFF";

const COLUMNS = 50;
const COLUMN_WIDTH = 14;
const ROWS = 50;
const ROW_HEIGHT = 14;

var grid = new Array();

for (var i = 0; i < COLUMNS; i++) {
    grid[i] = new Array();
    for (var j = 0; j < ROWS; j++) {
        grid[i][j] = OPEN;//Math.floor(Math.random() * Math.floor(5));
    }
}

function getNeighbors(x, y) {
    var neighbors = new Array();
    if (x != 0) {
        neighbors.push({x: x - 1, y: y, type: grid[x-1][y]});
    }
    if (x != (COLUMNS - 1)) {
        neighbors.push({x: x + 1, y: y, type: grid[x+1][y]});
    }
    if (y != 0) {
        neighbors.push({x: x, y: y - 1, type: grid[x][y-1]});
    }
    if (y != (ROWS - 1)) {
        neighbors.push({x: x, y: y + 1, type: grid[x][y+1]});
    }
    return neighbors;
}

function drawGrid(canvas) {
    var ctx = canvas.getContext("2d");
    for (var i = 0; i < COLUMNS; i++) {
        for (var j = 0; j < ROWS; j++) {
            var leftStart = i * COLUMN_WIDTH;
            var topStart = j * COLUMN_WIDTH;
            switch (grid[i][j]) {
                case WALL:
                    ctx.fillStyle = WALL_COLOR;
                    break;
                case OPEN:
                    ctx.fillStyle = OPEN_COLOR;
                    break;
                case START:
                    ctx.fillStyle = START_COLOR;
                    break;
                case GOAL:
                    ctx.fillStyle = GOAL_COLOR;
                    break;
                case EXPLORED:
                    ctx.fillStyle = EXPLORED_COLOR;
                    break;
            }
            ctx.fillRect(leftStart, topStart, COLUMN_WIDTH, ROW_HEIGHT);
        }
    }
    for (var i = 0; i < COLUMNS; i++) {
        ctx.beginPath();
        ctx.moveTo(i * COLUMN_WIDTH, 0);
        ctx.lineTo(i * COLUMN_WIDTH, 700);
        ctx.strokeStyle = BORDER_COLOR;
        ctx.lineWidth = .5;
        ctx.stroke();
    }
    for (var i = 0; i < ROWS; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * ROW_HEIGHT);
        ctx.lineTo(700, i * ROW_HEIGHT);
        ctx.strokeStyle = BORDER_COLOR;
        ctx.lineWidth = .5;
        ctx.stroke();
    }
}

function getBoxFromEvent(canvas, event) {
    let bound = canvas.getBoundingClientRect();

    let x = event.clientX - bound.left - canvas.clientLeft;
    let y = event.clientY - bound.top - canvas.clientTop;
    let realX = Math.floor(x / COLUMN_WIDTH);
    let realY = Math.floor(y / ROW_HEIGHT);
    if (realX < 0) { realX = 0 }
    if (realX > 49) { realX = 49 }
    if (realY < 0) { realY = 0 }
    if (realY > 49) { realY = 49 }
    return {x: realX, y: realY};
}

var dragging = false;
var mouseIsDown = false;
var drawing = WALL;
var goal = {x: 0, y: 0};
var start = {x: 0, y: 0};

$(function() {
    var $canvas = $("#maincanvas")[0];
    drawGrid($canvas);

    $("#maincanvas").on('mousedown', function(e) {
        dragging = false;
        mouseIsDown = true;
        var coord = getBoxFromEvent($canvas, e);
        switch (drawing) {
            case WALL:
                if ((grid[coord.x][coord.y] != START) && (grid[coord.x][coord.y] != GOAL)) {
                    grid[coord.x][coord.y] = WALL;
                }
                break;
            case OPEN:
                if ((grid[coord.x][coord.y] != START) && (grid[coord.x][coord.y] != GOAL)) {
                    grid[coord.x][coord.y] = OPEN;
                }
                break;
            case START:
                grid[start.x][start.y] = OPEN;
                start = coord;
                grid[coord.x][coord.y] = START;
                break;
            case GOAL:
                grid[goal.x][goal.y] = OPEN;
                goal = coord;
                grid[coord.x][coord.y] = GOAL;
                break;
        }
        var neighbors = getNeighbors(coord.x, coord.y);
        for (var i = 0; i < neighbors.length; i++) {
            console.log(neighbors[i]);
            grid[neighbors[i].x][neighbors[i].y] = drawing;
        }
        drawGrid($canvas);
    }).on('mousemove', function(e) {
        dragging = true;
        if (mouseIsDown && (drawing == WALL || drawing == OPEN)) {
            var coord = getBoxFromEvent($canvas, e);
            if (grid[coord.x][coord.y] == OPEN || grid[coord.x][coord.y] == WALL) {
                if (drawing == WALL) {
                    grid[coord.x][coord.y] = WALL;
                } else { // OPEN
                    grid[coord.x][coord.y] = OPEN;
                }
            }
            drawGrid($canvas);
        }
    }).on('mouseup', function(e) {
        mouseIsDown = false;
        var wasDragging = dragging;
        dragging = false;
    });

    $(document).on('mouseup', function() {
        mouseIsDown = false;
    });

    $("#walls").click(function() {
        drawing = WALL;
        $("#walls").addClass("activeborder");
        $("#open").removeClass("activeborder");
        $("#start").removeClass("activeborder");
        $("#goal").removeClass("activeborder");
    });

    $("#open").click(function() {
        drawing = OPEN;
        $("#walls").removeClass("activeborder");
        $("#open").addClass("activeborder");
        $("#start").removeClass("activeborder");
        $("#goal").removeClass("activeborder");
    });

    $("#start").click(function() {
        drawing = START;
        $("#walls").removeClass("activeborder");
        $("#open").removeClass("activeborder");
        $("#start").addClass("activeborder");
        $("#goal").removeClass("activeborder");
    });

    $("#goal").click(function() {
        drawing = GOAL;
        $("#walls").removeClass("activeborder");
        $("#open").removeClass("activeborder");
        $("#start").removeClass("activeborder");
        $("#goal").addClass("activeborder");
    });

});
