let canvas;
let context;
let width;
let height;

let interval_id;
let ps = [];

let background = new Image()
background.src = 'images/background2.png';

let img = new Image()
img.src = 'images/spaceship.png'

let rock = new Image()
rock.src = 'images/asteroid2.png'

let rock1 = new Image()
rock1.src = 'images/asteroid3.png'

let broken = new Image()
broken.src = 'images/brokenspaceship.png'

let broken2 = new Image()
broken2.src = 'images/brokenspaceship2.png'

let death = new Image()
death.src = 'images/brokenspaceship3.png'

let dashship = new Image()
dashship.src = 'images/dashspaceship.png'

let heart = new Image()
heart.src = 'images/heart.png'

let goldheart = new Image()
goldheart.src = 'images/goldheart.png'

let flash = new Image()
flash.src = 'images/flash.png'

let oneletbullet = new Image()
oneletbullet.src = 'images/onelet.png'

let tripletbullet = new Image()
tripletbullet.src = 'images/triplet.png'

let oneletSound = new sound("audio/onelet.mp3");
let doubletSound = new sound("audio/doublet.mp3");
let tripletSound = new sound("audio/triplet.mp3");
let hitSound = new sound("audio/hit.wav");
let boomSound = new sound("audio/boom.mp3");

let player;
let background1;
let background2;

let gun = false;
let shoot;
let shoot1;
let shoot2;
let shoot5;
let ammo;

let triggerFinger = ["onelet", "doublet", "triplet"];
let iChoose;

let lifeblood = 3;
let heartPower;

let moveRight;
let moveUp;
let moveDown;
let moveLeft;

let dashC;
let speed = 3;
let dashTimeout = 0;
let points = 0;

let frames;
let hitframes;

let nope = true;
let temp = 0;

document.addEventListener('DOMContentLoaded', init, false);

function init() {
    window.addEventListener("keydown", function(e) {if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {e.preventDefault(); }}, false);
    canvas = document.querySelector('canvas');
    context = canvas.getContext('2d');
    width = canvas.width;
    height = canvas.height;
    frames = 0;
    hitframes = 0;

    ps = [];

    heartPower = {
        x : width,
        y : getRandomNumber(0, height - 300),
        size : 40,
        xChange : 5,
    };

    player = {
        x : -50,
        y : height/2,
        size : 50,
    };

    background1 = {
        x : 0,
        y : 0,
        xCourse : 1,
    };

    background2 = {
        x : width,
        y : 0,
        xCourse : 1,
    };

    gun = false;
    shoot = [];
    shoot1 = [];
    shoot2 = [];
    shoot5 = [];
    ammo = [shoot, shoot1, shoot2, shoot5]

    lifeblood = 3;

    iChoose = "onelet";

    moveRight = false;
    moveUp = false;
    moveDown = false;
    moveLeft = false;

    dashC = false;
    speed = 6;
    dashTimeout = 0;

    points = 0;
    interval_id = window.setInterval(draw, 15);
}


function updatePoints(score){
    points += score;
}
function activate(event){
    let keyCode = event.keyCode;
    if (keyCode === 32 && playAgain === true) {
      context.clearRect(0, 0, width, height);
      playAgain = false;
      init();
    }

    if (keyCode === 90) {
        if (iChoose === triggerFinger[2]) {
            iChoose = triggerFinger[0];
        }
        else {
            iChoose = triggerFinger[triggerFinger.indexOf(iChoose) + 1];
        }
    }

    if (keyCode === 88) {
        gun = true;
        bulletTime();
    }

    if (keyCode === 67) {
        dashC = true;
    }
    if (keyCode === 38) {
        moveUp = true;
    }
    if (keyCode === 39) {
        moveRight = true;
    }
    if (keyCode === 40) {
        moveDown = true;
    }
    if (keyCode === 37) {
        moveLeft = true;
    }
}

function deactivate(event) {
    let keyCode = event.keyCode;
    if (keyCode === 88) {
        gun = false;
    }
    if (keyCode === 67) {
        dashC = false;
    }
    if (keyCode === 38) {
        moveUp = false;
    }
    if (keyCode === 39) {
        moveRight = false;
    }
    if (keyCode === 40) {
        moveDown = false;
    }
    if (keyCode === 37) {
        moveLeft = false;
    }
}

function border_patrol() {
    if (player.x <= 0) {
        moveLeft = false;
        player.x = 0;
    }
    if (player.x + player.size >= width) {
        moveRight = false;
    }
    if (player.y <= 0) {
        moveUp = false;
        player.y = 0;
    }
    if (player.y + player.size >= height) {
        moveDown = false;
        player.y = height - 50;
    }
}

function draw() {
    frames ++;

    if (nope === false) {
        temp ++;
    }

    if (temp === 30) {
        nope = true;
    }

    context.clearRect(0, 0, width, height);

    // background
    context.drawImage(background, background1.x, background1.y, width, height);
    context.drawImage(background, background2.x, background2.y, width, height);

    background1.x = background1.x - background1.xCourse;
    background2.x = background2.x - background2.xCourse;

    if (background1.x == -width) {
        background1.x = width;
    }

    if (background2.x == -width) {
        background2.x = width;
    }

    bulletMove()
    bullet_border()
    // player
    if (hitframes + 100 > frames && frames > 100){
        // go red
        if (lifeblood === 2 && frames % 4 !== 0) {
        context.drawImage(broken2, player.x, player.y, player.size, player.size);
        }
        if (lifeblood === 1 && frames % 4 === 0) {
        context.drawImage(broken, player.x, player.y, player.size, player.size);
        }
    }
    else {
        // go blue
        context.drawImage(img, player.x, player.y, player.size, player.size);
    }

    // first 100 frames
    if (frames < 100) {
        context.drawImage(img, player.x, player.y, player.size, player.size);
        player.x = player.x + 3;
    }

    else {
        window.addEventListener('keydown', activate, false);
        window.addEventListener('keyup', deactivate, false);
    }

    if (frames < 2400) {
        context.font = "30px Comic Sans MS";
        context.fillStyle = "yellow"
        context.textAlign = "center";
        if (frames < 300 && frames > 100) {
            context.fillText("Move the spaceship using the arrow keys.", canvas.width/2, canvas.height * 3/4);
        }
        else if (frames > 300 && frames < 600) {
            context.fillText("Tap x to shoot.", canvas.width/2, canvas.height * 3/4);
        }
        else if (frames > 600 && frames < 900) {
            context.fillText("Press z to change weapons.", canvas.width/2, canvas.height * 3/4);
        }
        else if (frames > 900 && frames < 1100) {
            context.fillText("There are 3 weapons to use and each have their own unique style.", canvas.width/2, canvas.height * 3/4);
        }
        else if (frames > 1100 && frames < 1300) {
            context.fillText("Earn points by shooting down incoming objects.", canvas.width/2, canvas.height * 3/4);
        }
        else if (frames > 1000 && frames < 1500) {
            context.fillText("Point to a direction and press c to teleport.", canvas.width/2, canvas.height * 3/4);
        }
        else if (frames > 1500 && frames < 1800) {
            context.fillText("At the top left corner are your heart containers.", canvas.width/2, canvas.height * 3/4);
        }
        else if (frames > 1800 && frames < 2100) {
            context.fillText("If you lose all your hearts, it's game over! Get the Goldern Heart drops to refill them", canvas.width/2, canvas.height * 3/4);
        }
        else if (frames > 2100) {
            context.fillText("Warning! Incoming asteroid belt! Use this time to practice your skills and get better!", canvas.width/2, canvas.height * 3/4);
        }
    }

    // you got hit
    iGotHit(ps)

    // teleports player to spot
    if (dashC && dashTimeout <= 0){
    speed = 100;
    dashTimeout = 1000;
    }
    else if (dashTimeout > 0){
        dashTimeout -= 20;
        speed = 6;
        context.drawImage(dashship, player.x, player.y, player.size, player.size);       
    }

    if (gun === true && iChoose === "onelet") {
        context.drawImage(flash, player.x + 50, player.y, player.size, player.size);
    }

    // meteor shower
    if (frames > 2400){
        if (ps.length < 10 && points < 501) {
            let p = {
                x : width,
                y : getRandomNumber(0, height - 70),
                size : getRandomNumber(30, 100),
                xChange : getRandomNumber(-10, -5),
                drawMeteor : getRandomNumber(0, 1),
            };
            ps.push(p);
        }
    }

    for (let p of ps) {
        if (p.drawMeteor == 0){
            context.drawImage(rock, p.x, p.y, p.size, p.size);
        }
        else {
            context.drawImage(rock1, p.x, p.y, p.size, p.size);
        }
        p.x = p.x + p.xChange;
        if (p.x <= -p.size) {
            p.x = width;
            p.y = getRandomNumber(0, height);
            p.drawMeteor = getRandomNumber(0, 1);
        }
    }

    // check if bullets hit meteor 
    for (let i of ammo) {
        for (let p of ps) {
            for (let g of i) {
                if (hitscan(p, g)) {
                    p.x = width;
                    p.y = getRandomNumber(0, height);
                    updatePoints(10);
                    if (i !== shoot5) {
                        let index = i.indexOf(g);
                        i.splice(index, 1);4
                    }
                }
            }
        }
    }

    if (lifeblood < 3) {
        context.drawImage(goldheart, heartPower.x, heartPower.y, heartPower.size, heartPower.size);
        heartPower.x = heartPower.x - heartPower.xChange;

        if (heartPower.x == -width) {
            heartPower.x = width;
            heartPower.y = getRandomNumber(0, height - 300);
        }
    }

    if (collides(heartPower)) {
        lifeblood ++
        heartPower.x = width;
        heartPower.y = getRandomNumber(0, height - 300);
    }

    lifebloodHearts(lifeblood)

    // player hits sides
    border_patrol()

    // movement registers
    if (moveRight) {
        player.x += speed;
    }
    if (moveLeft) {
        player.x -= speed;
    }
    if (moveUp) {
        player.y -= speed;
    }
    if (moveDown) {
        player.y += speed;
    }

    scoreboard()

    gameOver()
}

function bullet_border() {
    for (let i of ammo) {
        for (let g of i) {
            if (g.x <= 0) {
                let index = i.indexOf(g);
                i.splice(index, 1);
            }
            if (g.x + g.size >= width) {
                let index = i.indexOf(g);
                i.splice(index, 1);
            }
            if (g.y <= 0) {
                let index = i.indexOf(g);
                i.splice(index, 1);
            }
            if (g.y + g.size >= height) {
                let index = i.indexOf(g);
                i.splice(index, 1);
            }
        }
    }
}

function gameOver() {
    if (lifeblood <= 0) {
        context.drawImage(death, player.x - 20, player.y - 12, player.size + 30, player.size + 30);
        stop();
        context.font = "30px Comic Sans MS";
        context.fillStyle = "red"
        context.textAlign = "center";
        context.fillText("Game Over. Your total points is " + points.toString(), canvas.width/2, canvas.height/2);
    }
}
function scoreboard() {
    // the scoreboard
    context.font = "20px Comic Sans MS";
    context.fillStyle = "red"
    context.fillText("Score: " + points.toString(), 1250, 30);
}

function lifebloodHearts(n) {
    // draw the hearts
    if (n === 3) {
        context.drawImage(heart, 10, 10, 20, 20);
        context.drawImage(heart, 40, 10, 20, 20);
        context.drawImage(heart, 70, 10, 20, 20);
    }

    if (n === 2) {
        context.drawImage(heart, 10, 10, 20, 20);
        context.drawImage(heart, 40, 10, 20, 20);

    }

    if (n === 1) {
        context.drawImage(heart, 10, 10, 20, 20);
    }    
}

function iGotHit(hitter) {
    for (let p of hitter) {
        if (collides(p) && dashTimeout <= 0) {
            if (hitframes + 100 < frames) {
                lifeblood --;
                hitframes = frames;
                if (lifeblood >= 1){
                hitSound.play();
                }
                else {
                    boomSound.play();
                }
            }
        }
    }
}

function bulletMove() {
    // bullet "moving"
    for (let g of shoot2) {
        context.drawImage(oneletbullet, g.x, g.y, g.size, g.size);
        if (g.x === player.x + 65 && g.y === player.y + 19) {
            oneletSound.play();
        } 
        g.x = g.x + g.bullTrack;
    }

    for (let g of shoot) {
      context.fillStyle ='red';
      context.fillRect(g.x, g.y, g.lsize, g.size);
      if (g.x === player.x + 14 && g.y === player.y + 10) {
            doubletSound.play();
        }  
      g.x = g.x + g.bullTrack; 
    }

    for (let f of shoot1) {
      context.fillStyle ='red';
      context.fillRect(f.x, f.y, f.lsize, f.size);
      f.x = f.x + f.bullTrack;
    }

    for (let f of shoot5) {
      context.fillStyle ='orange';
      context.drawImage(tripletbullet, f.x, f.y, f.size, f.size);
      if (f.x === player.x + 25 && f.y === player.y + 7) {
            tripletSound.play();
        }      
      f.x = f.x + f.bullTrack;
    }

}

function bulletTime() {
    if (iChoose === "onelet") {
        let bulletcenter = {
            x : player.x + 65,
            y : player.y + 19,
            bullTrack : 15,
            size : 15,
        }
        shoot2.push(bulletcenter);
    }

    if (iChoose === "doublet") {
        let bullettop = {
            x : player.x + 14,
            y : player.y + 10,
            bullTrack : 15,
            size : 2,
            lsize : 15,
        }

        let bulletbot = {
            x : player.x + 14,
            y : player.y + 40,
            bullTrack : 15,
            size : 2,
            lsize : 15,
        }
        shoot.push(bullettop);
        shoot1.push(bulletbot);
    }

    if (iChoose === "triplet" && nope === true) {
        let  bulletcenter = {
                x : player.x + 25,
                y : player.y + 7,
                bullTrack : 10,
                size : 40,
                }

        shoot5.push(bulletcenter);
        nope = false;
        temp = 0;
    }
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
}

function hitscan(p, g) {
  if (g.x + g.size < p.x ||
      p.x + p.size < g.x ||
      g.y > p.y + p.size ||
      p.y > g.y + g.size) {
        return false;
      } else {
        return true;
      }
}

function collides(p) {
    if (player.x + player.size - 30 < p.x ||
        p.x + p.size < player.x ||
        player.y > p.y + p.size ||
        p.y > player.y + player.size) {
        return false;
    } else {
        return true;
    }
}

function stop() {
    clearInterval(interval_id);
    window.removeEventListener('keydown', activate);
    window.removeEventListener('keyup', deactivate);
}