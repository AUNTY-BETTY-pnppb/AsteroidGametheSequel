let canvas;
let context;
let width;
let height;
let request;
let user;

let playAgain = false;
let interval_id;

let minion_ps;
let ps = [];

let background = new Image()
background.src = 'images/background.png';

let img = new Image()
img.src = 'images/spaceship.png'

let rock = new Image()
rock.src = 'images/asteroid.png'

let rock1 = new Image()
rock1.src = 'images/asteroid1.png'

let broken = new Image()
broken.src = 'images/brokenspaceship.png'

let broken2 = new Image()
broken2.src = 'images/brokenspaceship2.png'

let death = new Image()
death.src = 'images/brokenspaceship3.png'

let dashship = new Image()
dashship.src = 'images/dashspaceship.png'

let anky = new Image()
anky.src = 'images/ankylo.png'

let anky1 = new Image()
anky1.src = 'images/ankylo1.png'

let anky2 = new Image()
anky2.src = 'images/ankylo2.png'

let anky3 = new Image()
anky3.src = 'images/ankylo3.png'

let tricera = new Image()
tricera.src = 'images/tricera.png'

let tricera1 = new Image()
tricera1.src = 'images/tricera1.png'

let tricera2 = new Image()
tricera2.src = 'images/tricera2.png'

let heart = new Image()
heart.src = 'images/heart.png'

let goldheart = new Image()
goldheart.src = 'images/goldheart.png'

let flash = new Image()
flash.src = 'images/flash.png'

let planet = new Image()
planet.src = 'images/planet.png'

let planet1 = new Image()
planet1.src = 'images/planet1.png'

let planet2 = new Image()
planet2.src = 'images/planet2.png'

let oneletbullet = new Image()
oneletbullet.src = 'images/onelet.png'

let tripletbullet = new Image()
tripletbullet.src = 'images/triplet.png'

let surgebullet = new Image()
surgebullet.src = 'images/surgebullet.png'

let surgebullet1 = new Image()
surgebullet1.src = 'images/surgebullet1.png'

let surgebullet2 = new Image()
surgebullet2.src = 'images/surgebullet2.png'

let oneletSound = new sound("audio/onelet.mp3");
let doubletSound = new sound("audio/doublet.mp3");
let tripletSound = new sound("audio/triplet.mp3");

let surgeSound = new sound("audio/surge.mp3");

let hitSound = new sound("audio/hit.wav");
let boomSound = new sound("audio/boom.mp3");

let player;
let minions;

let background1;
let background2;

let gun = false;
let shoot;
let shoot1;
let shoot2;
let shoot5;
let ammo;

let triggerFinger;
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

let minionUp;
let minionDown;
let come_minions;
let minionFirst_top;
let minionFirst_bot;
let minionFirst_reload;

let triceranks;

let points = 0;
let scorekeeper;

let frames;
let hitframes;

let planet_dict = {
    0 : planet,
    1 : planet1,
    2 : planet2,
}
let planet_spin = 0;
let nope = true;
let temp = 0;
let lifebar;

document.addEventListener('DOMContentLoaded', init, false);

function init() {
    window.addEventListener("keydown", function(e) {if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
e.preventDefault(); }}, false);
    canvas = document.querySelector('canvas');
    context = canvas.getContext('2d');
    width = canvas.width;
    height = canvas.height;
    frames = 0;
    hitframes = 0;

    lifebar = 500;
    minionFirst_top = 30;
    minionFirst_bot = 500;
    minionFirst_reload = 60;

    triggerFinger = ["onelet", "doublet", "triplet"];
    ps = [];
    minion_ps = [];
    triceranks = [];

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

    minions = {
        x : width,
        y : 30,
        size : 180,
        lifebar : 200,
    }

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

    minionUp = false;
    minionDown = false;

    dashC = false;
    speed = 6;
    dashTimeout = 0;

    points = 0;
    interval_id = window.setInterval(draw, 15);
}


function updatePoints(delta){
    points += delta;
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

    if (temp === 60) {
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


    // planet spinnning
    context.drawImage(planet_dict[planet_spin], width - 500, height/3, 150, 150);

    if (planet_spin === 2 && frames % 30 === 0) {
        planet_spin = 0;
    }
    else if (frames % 30 === 0) {
        planet_spin ++;
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

    // first 150 frames
    if (frames < 150) {
        context.drawImage(img, player.x, player.y, player.size, player.size);
        player.x = player.x + 3;
        context.font = "30px Comic Sans MS";
        context.fillStyle = "yellow"
        context.textAlign = "center";
        if (frames < 50) {
            context.fillText("GET READY!", canvas.width/2, canvas.height/2);
        }
        else {
            context.fillText("GO!", canvas.width/2, canvas.height/2);
        }
    }

    else {
        window.addEventListener('keydown', activate, false);
        window.addEventListener('keyup', deactivate, false);
    }

    // you got hit
    iGotHit(ps)
    iGotHit(minion_ps)

    for (let t of triceranks) {
        if (t.lifebar !== 0) {
            iGotHit(triceranks);
        }
    }

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
    if (frames > 100){
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

    for (let i of ammo) {
        for (let g of i) {
            if (hitscan(minions, g) && points > 500) {
                minions.lifebar = minions.lifebar - 1;
                lifebar = (minions.lifebar/200) * 500;
                if (i !== shoot5) {
                    let index = i.indexOf(g);
                    i.splice(index, 1);4
                }
            }
        }
    }

    for (let i of ammo) {
        for (let t of triceranks) {
            for (let g of i) {
                if (hitscan(t, g)) {
                    if (t.lifebar > 0 && t.x < width) {
                        t.lifebar = t.lifebar - 1;
                    }
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

    if (points > 300) {
        timeToTrike()
    }

    minionFirst()

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
    if (minions.lifebar <= 0) {
        context.drawImage(anky3, minions.x, minions.y, minions.size, minions.size);
        boomSound.play();
        stop();
        context.font = "30px Comic Sans MS";
        context.fillStyle = "red"
        context.textAlign = "center";
        user = document.getElementById("username").innerHTML
        let url = 'store_score.py?score=' + points + '&username=' + user;
        request = new XMLHttpRequest();
        request.addEventListener('readystatechange', handle_response, false);
        request.open('GET', url, true);
        request.send(null);
        playAgain = true;
        context.fillText("press space to continue", canvas.width/2, canvas.height/1.5);
        window.addEventListener('keydown', activate, false);
        window.addEventListener('keyup', deactivate, false);
    }

    if (lifeblood <= 0) {
        context.drawImage(death, player.x - 20, player.y - 12, player.size + 30, player.size + 30);
        stop();
        playAgain = true;
        context.font = "30px Comic Sans MS";
        context.fillStyle = "red"
        context.textAlign = "center";
        context.fillText("Game Over. Your total points is " + points.toString(), canvas.width/2, canvas.height/2);
        context.fillText("press space to continue", canvas.width/2, canvas.height/1.5);
        window.addEventListener('keydown', activate, false);
        window.addEventListener('keyup', deactivate, false);
    }
}
function scoreboard() {
    // the scoreboard
    context.font = "20px Comic Sans MS";
    context.fillStyle = "red"
    context.fillText("Score: " + points.toString(), 1250, 30);
}

function timeToTrike() {
    if (triceranks.length < 2) {
        let trikes = {
            x : width,
            y : getRandomNumber(0, height - 300),
            size : 120,
            xChange : 8,
            lifebar : 20,
            temp : 0,
        };
        triceranks.push(trikes);
    }

    for (let t of triceranks) {
        if (t.lifebar >= 15) {
            context.drawImage(tricera, t.x, t.y, t.size, t.size);
        }
        if (t.lifebar >= 11 && t.lifebar < 15) {
            context.drawImage(tricera1, t.x, t.y, t.size, t.size);
        }
        if (t.lifebar < 11 && t.lifebar > 0) {
            context.drawImage(tricera2, t.x, t.y, t.size, t.size);
        }
        if (t.lifebar > 0) {
            if (t.x < 1200) {
                t.xChange = 26;
            }
            if (t.x > 1200) {
                t.xChange = 8;
            }
            t.x = t.x - t.xChange;
            if (t.x <= -t.size) {
                t.x = width;
                t.y = getRandomNumber(0, height);
            }
        }
    
        if (t.lifebar <= 0) {
            t.temp ++;
            t.xChange = 0;
            t.x = width;
            t.y = getRandomNumber(0, height - 100);
            if (t.temp % 500 === 0) {
                t.lifebar = 20;
                t.temp = 0;
            }
            if (t.temp === 1) {
                points += 100;
            }
        } 
    }
}

function minionFirst() {
     // minions
     if (points >= 500 && minions.lifebar > 0){
        context.font = "20px Comic Sans MS";
        context.fillStyle = "red"
        context.fillText("AnkyloBot", canvas.width/2, 30);
        context.fillStyle = 'red';
        context.fillRect(canvas.width/3, 50, lifebar, 5);

        context.drawImage(anky, minions.x, minions.y, minions.size, minions.size);
        if (minions.x > 1200) {
            minions.x = minions.x - 4;
        }
        else {
            if (minions.y >= minionFirst_bot) {
                minionUp = true;
                minionDown = false;
            }
            if (minions.y <= minionFirst_top){
                minionDown = true;
                minionUp = false;
            }
            if (minions.lifebar < 75) {
                context.drawImage(anky1, minions.x, minions.y, minions.size, minions.size);
            }
            if (minions.lifebar < 50) {
                context.drawImage(anky2, minions.x, minions.y, minions.size, minions.size);
                minionFirst_top = 100;
                minionFirst_bot = 400;
                minionFirst_reload = 30;
            }
            if (frames % minionFirst_reload === 0) {
                let minion_bullet = {
                    x : minions.x - 20,
                    y : minions.y + 60,
                    size : 50,
                    xChange : 5,
                    animate : 0
                }
                minion_ps.push(minion_bullet);
            }
        }
    }

    for (let a of minion_ps) {
        if (a.x === minions.x - 20 && a.y === minions.y + 60) {
            surgeSound.play();
        }
        if (a.animate === 0){
            context.drawImage(surgebullet, a.x, a.y, a.size, a.size);
        }
        if (a.animate === 1){
            context.drawImage(surgebullet1, a.x, a.y, a.size, a.size);
        }
        if (a.animate === 2){
            context.drawImage(surgebullet2, a.x, a.y, a.size, a.size);
        }
        if (frames % 30 === 0 && a.animate < 2) {
            a.animate = a.animate + 1;
        }
        else if (frames % 90 === 0) {
            a.animate = 0;
        }
        a.x = a.x - a.xChange;
    }

    if (minions.lifebar === 0) {
        points += 300;
    }

    if (minionDown === true) {
        minions.y = minions.y + 3;
    }

    if (minionUp === true) {
        minions.y = minions.y - 3;
    }
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

function handle_response() {
    // Check that the response has fully arrived
    if ( request.readyState === 4 ) {
        // Check the request was successful
        if ( request.status === 200 ) {
            console.log(request.responseText);
            if ( request.responseText.trim() === 'success' ) {
                // score was successfully stored in database
                context.fillText("You won! You achieved your highest score yet! Your total points is " + points.toString(), canvas.width/2, canvas.height/2);
            }
            else{
                context.fillText("Well done! Your total points is " + points.toString(), canvas.width/2, canvas.height/2);
            }
        }
    }
}

function stop() {
    clearInterval(interval_id);
    window.removeEventListener('keydown', activate);
    window.removeEventListener('keyup', deactivate);
}