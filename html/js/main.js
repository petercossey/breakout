// alert('hello world');

var canvas = document.getElementById('gameCanvas');
var context = canvas.getContext("2d");
canvas.height = 400;
canvas.width = 300;

function startGame() {
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
}

// Object for storing state and behaviour for ball that bounces all over
// the game screen.
var ball = {
    x: canvas.width/2,
    y: canvas.height-30,
    dx: 2,
    dy: -2,
    fillStyle: "#07a",
    radius: 10
}

ball.draw = function() {
    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    context.fillStyle = ball.fillStyle;
    context.fill();
    context.closePath();
}

ball.update = function() {
    // ball collision detection for walls
    if (ball.x + ball.dx < ball.radius || ball.x + ball.dx > canvas.width-ball.radius) {
        ball.dx = -ball.dx;
    }
    // ball hitting paddle
    if (ball.y + ball.dy > canvas.height-ball.radius-paddle.height &&
        ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
        ball.dy = -ball.dy;
    }
    // ball hitting roof or missing paddle
    if (ball.y + ball.dy < ball.radius) {
        ball.dy = -ball.dy;
    } else if (ball.y + ball.dy > canvas.height-ball.radius) {
        alert("GAME OVER");
        document.location.reload();
    }
    
    ball.x += ball.dx;
    ball.y += ball.dy;
}

// Game paddle properties and behaviour.
var paddle = {
    height: 10,
    width: 75,
    x: (canvas.width-75)/2,
    y: canvas.height - 10,
    fillStyle: "#905"
}

paddle.draw = function() {
    context.beginPath();
    context.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    context.fillStyle = paddle.fillStyle;
    context.fill();
    context.closePath();
}

paddle.update = function() {
    paddle.input();
    if (paddle.x < 0) {
        paddle.x = 0;
    } else if (paddle.x > canvas.width-paddle.width) {
        paddle.x = canvas.width-paddle.width;
    }
}

paddle.input = function() {
    // left
    if (37 in keysDown) {
        paddle.x -= 7;
    }
    // right
    if (39 in keysDown) {
        paddle.x += 7;
    }
}

// Keyboard input events
var keysDown = {};

window.addEventListener('keydown', function(event) {
    keysDown[event.keyCode] = true;
    if (event.keyCode >= 37 && event.keyCode <= 40) {
        event.preventDefault();
    }
});

window.addEventListener('keyup', function(event) {
    delete keysDown[event.keyCode];
});

// Trigger the game loop et al.
startGame();

// ctx.beginPath();
// ctx.rect(20, 40, 50, 50);
// ctx.fillStyle = "#ff0000";
// ctx.fill();
// ctx.closePath();

// ctx.beginPath();
// ctx.arc(240, 160, 20, 0, Math.PI*2, false);
// ctx.fillStyle = "green";
// ctx.strokeStyle = "rgba(0, 0, 255, 0.5)";
// ctx.stroke();
// ctx.fill();
// ctx.closePath();