//html elements
const counterDiv = document.querySelector('#countdownDiv');
const pointsdiv1 = document.querySelector('#p1');
const pointsdiv2 = document.querySelector('#p2');
const pauseDiv = document.querySelector('#pauseDiv')
//setup
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.style.width = innerWidth;
canvas.style.height = innerHeight;

const body = document.querySelector('body')
body.style.margin = 0;

function prepareMap() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fill();
        ctx.closePath();
}

function startCountdown() {
    let i = 5
    let countdownTimer = setInterval(() => {
        if(!gamePaused){
        counterDiv.innerHTML = `Game starts in: ${i-1}`;
            i--;
            if (i <= -1) {
                counterDiv.innerHTML = '';
                clearInterval(countdownTimer);
                gameRunning = true;
            }else if (i <=0) {
                counterDiv.innerHTML = 'Start!';
            }
        }
    }, 1000)

}
//classes
class Ball {
    constructor(pos, vel, size, color) {
        this.pos = pos;
        this.vel = vel;
        this.size = size;
        this.color = color;
    }

    update() {
        //movement
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
        //platforms colisions
        if (this.pos.x + this.size / 2 > platform1.pos.x - platform1.size.x - 7
            && this.pos.x - this.size / 2 < platform1.pos.x + platform1.size.x
            && this.pos.y > platform1.pos.y - platform1.size.y / 2
            && this.pos.y < platform1.pos.y + platform1.size.y / 2
            ) {
            this.vel.x *= -1.05;
            this.vel.y += this.vel.y * Math.random()/3;
        }
        if (this.pos.x + this.size / 2 > platform2.pos.x - platform2.size.x
            && this.pos.x - this.size / 2 < platform2.pos.x + platform2.size.x + 7
            && this.pos.y > platform2.pos.y - platform2.size.y / 2
            && this.pos.y < platform2.pos.y + platform2.size.y / 2
            ) {
            this.vel.x *= -1.05;
            this.vel.y += this.vel.y * Math.random()/3;
        }
        this.draw();
        //walls colisions
        if (this.pos.y + this.size > canvas.height || this.pos.y - this.size < 0) {
            this.vel.y *= -1;
        }
        //points
        if (this.pos.x < 0) {
            points2++;
            pointsdiv2.innerHTML = points2;
            this.reset();
        }
        if (this.pos.x > canvas.width) {
            points1++;
            pointsdiv1.innerHTML = points1;
            this.reset();
        }
    }

    draw() {
        ctx.beginPath();
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.pos.x-this.size/2, this.pos.y-this.size/2,this.size, this.size);
        ctx.fill();
        ctx.closePath();
    }

    reset() {
        this.pos.x = canvas.width / 2;
        this.pos.y = canvas.height / 2;
        this.vel.x = (Math.random()-0.5 > 0)? 1 : -1;
        this.vel.y = (Math.random()-0.5 > 0)? 0.1 : -0.1;
        gameRunning = false;
        prepareMap();
        this.draw();
        startCountdown();
    }
};
class Platform {
    constructor(pos, vel, size, color, id) {
        this.pos = pos;
        this.vel = vel;
        this.size = size;
        this.color = color;
        this.id = id;
    }

    update() {
        this.vel = 0;
        if (this.id == 0) {
            if (keysPressed.w && !keysPressed.s && this.pos.y-this.size.y/2 > 0) {
                this.vel = -1;
            }
            if (keysPressed.s && !keysPressed.w && this.pos.y + this.size.y/2 < canvas.height ) {
                this.vel = 1;
            }
        } else {
            if (keysPressed.arrowUp && !keysPressed.arrowDown && this.pos.y-this.size.y/2 > 0) {
                this.vel = -1;
            }
            if (keysPressed.arrowDown && !keysPressed.arrowUp && this.pos.y + this.size.y/2 < canvas.height) {
                this.vel = 1;
            }
        }
        this.pos.y += this.vel;
        this.draw();
    }

    draw() {
        ctx.beginPath();
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.pos.x - this.size.x / 4, this.pos.y-this.size.y / 2, this.size.x, this.size.y);
        ctx.fill();
        ctx.closePath();
    }
};

// variables
let gameRunning = false;
let gamePaused = false;
let points1 = 0;
let points2 = 0;
const keysPressed = {
    w: false,
    s: false,
    arrowUp: false,
    arrowDown: false
}

const platform1 = new Platform({x: 10, y: canvas.height / 2}, 0, {x: 3, y: 20}, 'white', 0);
const platform2 = new Platform({x: canvas.width - 10, y: canvas.height / 2}, 0, {x: 3, y: 20}, 'white', 1);
const ball = new Ball({ x: canvas.width / 2, y: canvas.height / 2 }, { y: 0.1, x: 1}, 3, 'white');
//game loop
function gameLoop() {
    if (gameRunning && !gamePaused) {
        prepareMap();
        //updates
        ball.update();
        platform1.update();
        platform2.update();
    }
}
setInterval(gameLoop, 1000 / 60)
prepareMap();
platform1.draw()
platform2.draw()
ball.draw()
startCountdown();
//event listeners
addEventListener("keydown", ({key}) => {
    switch (key) {
        case ' ':
            gamePaused = !gamePaused;
            if (gamePaused) {
                pauseDiv.style.display = 'block';
            } else {
                pauseDiv.style.display = 'none';
            }
            break;
        case 'w':
            keysPressed.w = true;
            break;
        case 's':
            keysPressed.s = true;
            break;
        case 'ArrowUp':
            keysPressed.arrowUp = true;
            break;
        case 'ArrowDown':
            keysPressed.arrowDown = true;
            break;
    }
})

addEventListener('keyup', ({key}) => {
  switch (key) {
        case 'w':
            keysPressed.w = false;
            break;
        case 's':
            keysPressed.s = false;
            break;
        case 'ArrowUp':
            keysPressed.arrowUp = false;
            break;
        case 'ArrowDown':
            keysPressed.arrowDown = false;
            break;
    }
})