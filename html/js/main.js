// alert('hello world');

var canvas = document.getElementById('gameCanvas');
var context = canvas.getContext("2d");
canvas.height = 400;
canvas.width = 300;

function startGame() {
    bricks.init();
    loop();
}

/**
 * Our game loop
 * 
 * We get the loop by passing the loop function to the browser's
 * requestAnimationFrame API function.
 */
function loop() {
    requestAnimationFrame(loop, canvas);
    update();
    draw();
}

/**
 * The update function performs all the calculations
 * 
 * This function can check for player input, calculate trajectory,
 * detect collisions and other actions orientated towards state.
 */
function update() {
    // check state and stuff.
    ball.update();
    paddle.update();
    walls.update();
    bricks.update();
    score.update();
}

/**
 * Draw screen buffer on the canvas.
 */
function draw() {
    // clear the screen buffer.
    context.clearRect(0, 0, canvas.width, canvas.height);
    // draw stuff
    ball.draw();
    paddle.draw();
    walls.draw();
    bricks.draw();
    score.draw();
}

// Object for storing state and behaviour for ball that bounces all over
// the game screen.
var ball = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    dx: 2,
    dy: -2,
    fillStyle: "#07a",
    radius: 10
};

ball.draw = function () {
    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    context.fillStyle = ball.fillStyle;
    context.fill();
    context.closePath();
}

ball.update = function () {
    // ball collision detection for walls
    if (ball.x + ball.dx < ball.radius || ball.x + ball.dx > canvas.width - ball.radius) {
        ball.dx = -ball.dx;
        // walls.level = 5;
    }
    // ball hitting top
    if (ball.y + ball.dy < ball.radius) {
        ball.dy = -ball.dy;
        // walls.level = 5;
    }
    // ball hitting paddle
    if ((ball.y + ball.dy > canvas.height - ball.radius - paddle.height) &&
        (ball.x > paddle.x && ball.x < paddle.x + paddle.width)) {
        ball.dy = -ball.dy;
        walls.level = 5;
    }
    if (ball.y + ball.dy > 400) {
        alert("GAME OVER");
        document.location.reload();
    }

    ball.x += ball.dx;
    ball.y += ball.dy;
}

/**
 * Game paddle properties and behavior
 */
var paddle = {
    height: 10,
    width: 75,
    x: (canvas.width - 75) / 2,
    y: canvas.height - 10,
    fillStyle: "#905"
};

paddle.draw = function () {
    context.beginPath();
    context.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    context.fillStyle = paddle.fillStyle;
    context.fill();
    context.closePath();
}

paddle.update = function () {
    paddle.input();
    if (paddle.x < 0) {
        paddle.x = 0;
    } else if (paddle.x > canvas.width - paddle.width) {
        paddle.x = canvas.width - paddle.width;
    }
}

paddle.input = function () {
    // left
    if (37 in keysDown) {
        paddle.x -= 7;
    }
    // right
    if (39 in keysDown) {
        paddle.x += 7;
    }
}

var walls = {
    level: 0,
    colour: [
        "border: 1px solid #ddd; background: #eaeaea;",
        "border: 1px solid #e0cbcb; background: #e0cbcb;",
        "border: 1px solid #e6a6a6; background: #e3b8b8;",
        "border: 1px solid #eb8181; background: #e6a6a6;",
        "border: 1px solid #f15c5c; background: #e89393;",
    ],
    updateStyle: false
};

walls.update = function () {
    if (walls.level > 0) {
        walls.level--;
        walls.updateStyle = true;
    }
}

walls.draw = function () {
    if (walls.updateStyle) {
        canvas.style = walls.colour[walls.level];
        walls.updateStyle = false;
    }
}

/**
 * Bricks properties, initialisation and behaviours.
 */
var bricks = {
    width: 45,
    height: 15,
    padding: 12,
    rowCount: 4,
    columnCount: 5,
    offsetTop: 0,
    offsetLeft: 0,
    fillStyle: "#690",
    matrix: []
};

bricks.init = function () {
    var totalBricks = bricks.rowCount * bricks.columnCount;
    for (i = 0; i < totalBricks; i++) {
        var col = i % bricks.columnCount;
        var row = Math.floor(i / bricks.columnCount);
        var newX = col * bricks.width + bricks.padding * (col + 1) + bricks.offsetLeft;
        var newY = row * bricks.height + bricks.padding * (row +1) + bricks.offsetTop;
        bricks.matrix.push({
            x: newX,
            y: newY,
            status: 1
        });
    }
}

bricks.draw = function () {
    bricks.matrix.forEach(function (item, index, array) {
        if (item.status) {
            context.beginPath();
            context.rect(item.x, item.y, bricks.width, bricks.height);
            context.fillStyle = bricks.fillStyle;
            context.fill();
            context.closePath();
        }
    });
}

bricks.update = function() {
    bricks.matrix.forEach(function (item, index, array) {
        if (item.status) {
            // Naive collision detection for each brick and ball.
            if (collisionDetected({
                x: item.x,
                y: item.y,
                width: bricks.width,
                height: bricks.height
            }, {
                x: ball.x,
                y: ball.y,
                width: ball.radius * 2,
                height: ball.radius * 2
            })) {
                console.log('brick ' + index + ' got hit.')
                bricks.matrix[index].status = 0;
                ball.dy = -ball.dy;
                ball.dx = -ball.dx;
                score.total++;
            }
        }
    })
}

/**
 * Score properties and behaviours
 */
var score = {
    total: 0,
    fillStyle: "#ffe070",
    x: 8,
    y: 20,
    board: "Score: 0"
};

score.update = function() {
    score.board = "Score: " + score.total;
}

score.draw = function() {
    context.font = "16px Arial";
    context.fillStyle = score.fillStyle;
    context.fillText(score.board, score.x, score.y);
}

/**
 * Collision detection (bounding box)
 * 
 * @param {box1} Object This is a param representing a bounding box. The
 *      object has 4 keys: x, y, width, height.
 * @param {box2} Object Same as box1
 * @return {boolean} If there is a collision between the two objects the
 *      function will return true, otherwise it will return false.
 */
function collisionDetected(box1, box2) {
    if (box1.x < box2.x + box2.width &&
        box1.x + box1.width > box2.x &&
        box1.height + box1.y > box2.y) {
        // collision detected
        return true;
    } else {
        return false;
    }
}

// Keyboard input events
var keysDown = {};

window.addEventListener('keydown', function (event) {
    keysDown[event.keyCode] = true;
    if (event.keyCode >= 37 && event.keyCode <= 40) {
        event.preventDefault();
    }
});

window.addEventListener('keyup', function (event) {
    delete keysDown[event.keyCode];
});

// Trigger the game loop et al.
startGame();