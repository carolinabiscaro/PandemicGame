/*

The Game Project


*/


var gameChar_x;
var gameChar_y;
var floorPos_y;

var isLeft;
var isRight;
var isPlummeting;
var isFalling;
var isUp;
var canyon;
var trees;
var clouds_x;
var clouds_y;
var cloud;
var mountains;
var game_score;
var cameraPosX;
var flagpole;
var lives;
var displayCont;
var enemies;
var dead;
var attack;
var win;
var looserDisplay;
var winnerDisplay;
var restartButton;
var checkPoint;
var platforms;
var isContact;
var actualPlatform;
var jumpSound;
var lostSound;
var moreLivesSound;
var failSound;
var collectableSound;
var winSound;

// New feature variables
var jumpCount;
var jumpTarget;
var highScore;
var gameTimer;
var timerWarned;



function preload()
{
    soundFormats('mp3','wav')

    //load sounds here
    jumpSound = loadSound('assets/jump.wav')
    lostSound = loadSound('assets/lost.mp3')
    moreLivesSound = loadSound('assets/lives.wav')
    failSound = loadSound('assets/fail.wav')
    collectableSound = loadSound('assets/collectable.mp3')
    winSound = loadSound('assets/win.wav')
    jumpSound.setVolume(0.1)
    moreLivesSound.setVolume(0.1)
    failSound.setVolume(0.1)
    lostSound.setVolume(0.1)
    collectableSound.setVolume(0.1)
    winSound.setVolume(0.4)

}

function setup()
{
    createCanvas(1024, 576);
    floorPos_y = height * 3/4;
    lives = 3;
    startGame();
}

function startGame(){

    //Checking if there is checkpoint and lives
    if (lives < 1)
    {
        dead = true;
        checkPoint = false;

    }
    if (win)
    {
        checkPoint = false;
    }
    
    //If its dead, start display of Game Over
    if (dead)
    {
        if (isPlummeting == false)
        {
            gameChar_x = width/2;
            gameChar_y = floorPos_y;
        }
        lives = 0;
        looserDisplay = true;
    } else {
        
        //Start game
        //Checking pos_x of character, if checkpoing or beggining
        checkCheckpoint ()
        gameChar_y = floorPos_y;
        
        //Loading variables
        actualPlatform = {}
        isLeft = false;
        isRight = false;
        isPlummeting = false;
        isUp = false;
        isFalling = false;
        restartButton = false;
        dead = false
        enemies = [];
        attack = false;
        isContact = false;
        win = false;
        jumpCount = 0;
        jumpTarget = floorPos_y - 150;
        highScore = highScore || 0;
        gameTimer = 180;
        timerWarned = false;
        looserDisplay = false;
        winnerDisplay = false;
        checkPoint = false;
        cameraPosX = 0;
        
        enemies_ = [{pos_x: 800, pos_y :floorPos_y - 10},{pos_x: 1200, pos_y :floorPos_y - 10},
                    {pos_x: 1800, pos_y :floorPos_y - 10},{pos_x: 2190, pos_y :floorPos_y - 100},
                    {pos_x: 2400, pos_y :floorPos_y - 10}, 
                    {pos_x: 2625, pos_y :floorPos_y - 100},{pos_x: 2900, pos_y :floorPos_y - 80},{pos_x: 2900, pos_y :floorPos_y - 80},{pos_x: 3440, pos_y :floorPos_y - 100},
                    {pos_x: 4000, pos_y :floorPos_y - 40}]
        
        for (let i= 0; i < enemies_.length; i++)
        {   
            enemies.push(new Enemy(enemies_[i].pos_x,enemies_[i].pos_y, 100))
        }
        canyon = 
            [{x_pos: 700, y_pos: 433, width:100},{x_pos: 1000, y_pos: 433, width:200},
             {x_pos: 1000, y_pos: 433, width:100},{x_pos: 1300, y_pos: 433, width:200},
             {x_pos: 1600, y_pos: 433, width:100},{x_pos: 2000, y_pos: 433, width:400},
             {x_pos: 2300, y_pos: 433, width:150},{x_pos: 2600, y_pos: 433, width:200},
             {x_pos: 3000, y_pos: 433, width:100},{x_pos: 3250, y_pos: 433,  width:500},
             {x_pos: 3800, y_pos: 433, width:200},{x_pos: 4000, y_pos: 433,  width:100}]
        
        platforms = [];
        platforms.push(createPlatforms(830,floorPos_y - 80,100))
        platforms.push(createPlatforms(1050,floorPos_y - 80,110))
        platforms.push(createPlatforms(1250,floorPos_y - 100,80))
        platforms.push(createPlatforms(1400,floorPos_y - 80,110))
        platforms.push(createPlatforms(1700,floorPos_y - 80,50))
        platforms.push(createPlatforms(1800,floorPos_y - 100,50))
        platforms.push(createPlatforms(2150,floorPos_y - 70,50))
        platforms.push(createPlatforms(2250,floorPos_y - 70,50))
        platforms.push(createPlatforms(2400,floorPos_y - 80,50))
        platforms.push(createPlatforms(2600,floorPos_y - 70,50))
        platforms.push(createPlatforms(3000,floorPos_y - 80,100))
        platforms.push(createPlatforms(3350,floorPos_y - 60,100))
        platforms.push(createPlatforms(3550,floorPos_y - 60,100))
        platforms.push(createPlatforms(3900,floorPos_y - 70,100))
        // Moving platforms
        platforms.push(createPlatforms(2050, floorPos_y - 120, 80, 1.5, 120))
        platforms.push(createPlatforms(3680, floorPos_y - 110, 70, 2.0, 100))

        trees = 
            [{x_pos: -250, height:60},
             {x_pos: -100, height:160},{x_pos: -50, height:60},
             {x_pos: 340, height:160},{x_pos: 430, height:60},
             {x_pos: 570, height:250},{x_pos: 620, height:85},
             {x_pos: 950, height:110},{x_pos: 840, height:150},
             {x_pos: 1250, height:85},{x_pos: 1550, height:250},
             {x_pos: 1800, height:110},{x_pos: 1940, height:100},
             {x_pos: 2500, height:90},{x_pos: 2550, height:250},
             {x_pos: 2580, height:100},{x_pos: 1510, height:85},
             {x_pos: 2830, height:100},{x_pos: 2900, height:85},
             {x_pos: 3765, height:100},{x_pos: 4155, height:85},
             {x_pos: 3150, height:250},{x_pos: 3205, height:85},
             {x_pos: 4200, height:250},{x_pos: 4300, height:100},{x_pos: 4370, height:85},
             {x_pos: 4500, height:100},{x_pos: 4550, height:250}]; 
        
        clouds_x = [];
        clouds_y = [];
        cloud = {size:80};
        
        mountains =
            [{x_pos: 230, size:0},{x_pos: 800, size:0},
             {x_pos: 1100, size:0},{x_pos: 1500, size:0},
             {x_pos: 2100, size:0},{x_pos: 2800, size:0},
             {x_pos: 3300, size:0},{x_pos: 4000, size:0},
             {x_pos: 4400, size:0},{x_pos: 5000, size:0}]
        
        collectables = 
            [{x_pos: 860, y_pos: floorPos_y - 90, size: 20, isFound: false},{x_pos: 900, y_pos: floorPos_y - 10, size: 20, isFound: false},
             {x_pos: 970, y_pos: floorPos_y - 10, size: 20, isFound: false},{x_pos: 1100, y_pos: floorPos_y - 90, size: 20, isFound: false},
             {x_pos: 1280, y_pos: floorPos_y - 110, size: 20, isFound: false},
             {x_pos: 1450, y_pos: floorPos_y - 90, size: 20, isFound: false},{x_pos: 1550, y_pos: floorPos_y - 10, size: 20, isFound: false},{x_pos: 1725, y_pos: floorPos_y - 90, size: 20, isFound: false},
             {x_pos: 1825, y_pos: floorPos_y - 110, size: 20, isFound: false}, {x_pos: 1900, y_pos: floorPos_y - 10, size: 20, isFound: false},{x_pos: 2160, y_pos: floorPos_y - 80 ,size: 20, isFound: false},{x_pos: 2270, y_pos: floorPos_y - 80, size: 20, isFound: false},{x_pos: 2420, y_pos: floorPos_y - 90, size: 20, isFound: false},
             {x_pos: 2615, y_pos: floorPos_y - 80, size: 20, isFound: false},{x_pos: 2830, y_pos: floorPos_y - 100, size: 20, isFound: false},
             {x_pos: 2900, y_pos: floorPos_y - 10, size: 20, isFound: false},{x_pos: 3040, y_pos: floorPos_y - 90, size: 20, isFound: false},
             {x_pos: 3145, y_pos: floorPos_y - 10, size: 20, isFound: false},{x_pos: 3200, y_pos: floorPos_y - 10, size: 20, isFound: false},{x_pos: 3390, y_pos: floorPos_y - 70, size: 20, isFound: false},{x_pos: 3590, y_pos: floorPos_y - 70, size: 20, isFound: false},{x_pos: 3765, y_pos: floorPos_y - 10, size: 20, isFound: false},{x_pos: 3950, y_pos: floorPos_y - 80, size: 20, isFound: false}]

        flagpole = 
            {
            x_pos: 4155,
            y_pos: floorPos_y,
            isReached: false
        }

        clouds();
        game_score = 0;
    }

}

function draw()
{

    ///////////DRAWING CODE//////////

    //Fill the sky blue
    background(100,155,255); 

    //Draw some green ground
    noStroke();
    fill(6, 132, 15);
    rect(0, floorPos_y, width, height - floorPos_y); 

    //PUSH
    push();
    cameraPosX = -gameChar_x + width/2;
    translate(cameraPosX, 0);




    //Draw some clouds
    for(i=0; i < clouds_x.length; i++)
    {    
        drawClouds(clouds_x[i], clouds_y[i]);    
    }

    for(i=0; i < clouds_x.length; i++)
    {
        clouds_x[i] += 0.1  
    }


    //Draw some mountains
    for (i = 0; i < mountains.length; i++)
    {
        drawMountains(mountains[i]);
    }


    //Draw some trees   
    for (i = 0; i < trees.length; i++)
    {
        drawTrees(trees[i]);
    }


    //Draw platforms (update moving ones first)
    for (let i = 0; i < platforms.length; i++)
    {
        platforms[i].update();
        platforms[i].draw();
    }

    //Draw the canyon
    for (i = 0; i < canyon.length; i++)
    {
        drawCanyon(canyon[i]);
        checkCanyon(canyon[i]);
    }


    //Draw collectable
    for (i = 0; i < collectables.length; i++)
    {
        if (collectables[i].isFound == false)
        {
            drawCollectables(collectables[i]);
        }
    }

    //DrawHouse
    drawHouse();

    //DrawCheckpoint
    drawCheckpoint();

    //Draw flagpole
    drawFlagpole(flagpole)
    checkFlagpole(flagpole)

    //Draw enemies
    for (let i = 0; i < enemies.length; i++)
    {
        enemies[i].draw();

        // Stomp check: player falls on top of enemy
        var stomped = false;
        if (isFalling && !isContact &&
            abs(gameChar_x - enemies[i].currentX) < 22 &&
            gameChar_y >= enemies[i].y - 20 &&
            gameChar_y <= enemies[i].y + 5)
        {
            enemies.splice(i, 1);
            i--;
            game_score += 3;
            isUp = true;
            isFalling = false;
            jumpCount = 0;
            jumpTarget = gameChar_y - 80;
            collectableSound.play();
            stomped = true;
        }

        if (!stomped && i < enemies.length)
        {
            var isContacto = enemies[i].checkContact(gameChar_x, gameChar_y);
            if (isContacto)
            {
                attack = true;
                break;
            }
        }
    }
    if (attack)
    {   
        lives -= 1;
        if(lives > 0)
        {
            failSound.play()
        } else {
            lostSound.play()
        }
        attack = false;
        startGame();

    }

    //Draw the game character
    if (!dead) 
    {
        drawCharacter();
    }

    //Checking player lives
    checkPlayerLives();

    //Checking if it won
    if (flagpole.isReached)
    {
        victoryJump();
        winnerDisplay = true;
        if (restartButton)
        {
            winSound.play()
            lives = 3;
            startGame()
        }
    }

    //POP
    pop();


    ///////////INTERACTION CODE//////////
    //Put conditional statements to move the game character below here
    
    //Draw lives
    drawLives ()
    
    //Draw score
    fill (0,0,0);
    stroke(0.5);
    textSize(16)
    text(game_score, width - 95, 35);
    noStroke()

    fill(255, 195, 0)
    rect(width - 50, 30 +1, 20,20 - 26)
    fill(0, 231, 255)
    rect(width - 50 + 20, 30 - 10, 0.2 * 20, 0.8 * 20)
    rect(width - 50 + 20, 30 - 1, 20 - 5,20 - 23)
    rect(width - 50 + 20 * 1.6, 30 - 6, 0.2 * 20, 0.4 * 20)
    stroke(1)
    line(width - 70, 28, width - 50, 30 - 2)
    noStroke();

    // High score display
    fill(180, 130, 0);
    textSize(13);
    text('BEST: ' + highScore, width - 100, 55);

    // Timer logic and display
    if (!dead && !flagpole.isReached && !looserDisplay && !winnerDisplay) {
        gameTimer -= 1 / frameRate();
    }
    if (gameTimer < 0) gameTimer = 0;

    var timerDisplay = ceil(gameTimer);
    if (timerDisplay <= 30) {
        fill(255, 0, 0);
    } else if (timerDisplay <= 60) {
        fill(255, 140, 0);
    } else {
        fill(0, 0, 0);
    }
    textSize(18);
    text('TIEMPO: ' + timerDisplay, width/2 - 45, 35);

    // Timer hints
    if (timerDisplay <= 30 && !timerWarned) {
        timerWarned = true;
    }

    // Timer ran out
    if (gameTimer <= 0 && !dead && !flagpole.isReached && !looserDisplay) {
        lives -= 1;
        if (lives > 0) {
            failSound.play();
        } else {
            lostSound.play();
        }
        startGame();
    }

    //Delimiting limits
    if(gameChar_x < width/2)
    {
        gameChar_x = width/2;
    }
    if(gameChar_x > 4220)
    {
        gameChar_x = 4220;
    }

    //Checkpoints
    if(gameChar_x >= 2550 && !dead)
    {   
        checkPoint = true;
    } 

    //Displays
    if(looserDisplay)
    {
        startDisplay()
    }
    else if (winnerDisplay)
    {
        startWinnerDisplay()
    }

    //Character movements
    characterMovements()

    //Draw latforms
    drawPlatforms ()
}

function keyPressed()
{
    // if statements to control the animation of the character when
    // keys are pressed.

    //open up the console to see how these work
    console.log("keyPressed: " + key);
    console.log("keyPressed: " + keyCode);

    if (isPlummeting == false) 
    {
        if (dead == false)
        {
            if (win == false)
            {
                if (keyCode == 37)
                {
                    console.log("left arrow");
                    isLeft = true;
                }
                else if (keyCode == 39)
                {
                    console.log("right arrow");
                    isRight = true;
                } else if (keyCode == 32)
                {
                    if (!isFalling && jumpCount === 0)
                    {
                        // First jump
                        jumpSound.play();
                        isUp = true;
                        jumpCount = 1;
                        jumpTarget = floorPos_y - 150;
                    }
                    else if (isFalling && !isContact && jumpCount === 1)
                    {
                        // Double jump in mid-air
                        jumpSound.play();
                        isUp = true;
                        isFalling = false;
                        jumpCount = 2;
                        jumpTarget = gameChar_y - 100;
                    }
                }
            }
        }
    }
    if (keyCode == 32)
    {
        restartButton = true;
    }
}

function keyReleased()
{
    if (isPlummeting == false) {
        if (keyCode == 37)
        {
            console.log("left arrow");
            isLeft = false;
        }
        else if (keyCode == 39)
        {
            console.log("right arrow");
            isRight = false;
        }
        else if (keyCode == 32)
        {
            isFalling = true;
            isUp = false;
            restartButton = false;
        }
    }
    // if statements to control the animation of the character when
    // keys are released.

    console.log("keyReleased: " + key);
    console.log("keyReleased: " + keyCode);
}

function drawCharacter ()
{

    if(isLeft && isFalling && !isContact)
    {
        // add your jumping-left code
        stroke(0);
        strokeWeight(0.6);
        fill(0);
        rect(gameChar_x + 3, gameChar_y - 10, 12, 7);
        fill(255,150,150);
        ellipse(gameChar_x, gameChar_y - 50,35);
        fill(255,0,0);
        rect(gameChar_x - 6, gameChar_y - 33, 15,27);
        fill(0);
        rect(gameChar_x - 13, gameChar_y - 10, 12, 7);
        fill(255,150,150);
        rect(gameChar_x - 11, gameChar_y - 30, 15, 6);
        stroke(0);
        strokeWeight(3);
        point(gameChar_x - 5, gameChar_y - 50);
        strokeWeight(1);
        line(gameChar_x - 10, gameChar_y - 40, gameChar_x, gameChar_y - 40);


    }
    else if(isRight && isFalling && !isContact)
    {
     // add your jumping-right code

     stroke(0);
     strokeWeight(0.6);
     fill(0);
     rect(gameChar_x - 13, gameChar_y - 10, 12, 7);
     fill(255,150,150);
     ellipse(gameChar_x, gameChar_y - 50,35);
     fill(255,0,0);
     rect(gameChar_x - 7, gameChar_y - 33, 15,27);
     fill(0);
     rect(gameChar_x + 3, gameChar_y - 10, 12, 7);
     fill(255,150,150);
     rect(gameChar_x - 2, gameChar_y - 30, 16, 6);
     stroke(0);
     strokeWeight(3);
     point(gameChar_x + 5, gameChar_y - 50);
     strokeWeight(1);
     line(gameChar_x + 10, gameChar_y - 40, gameChar_x, gameChar_y - 40);



    }
    else if(isLeft)
    {
        // add your walking left code
        stroke(0);
        strokeWeight(0.6);
        fill(255,150,150);
        ellipse(gameChar_x, gameChar_y - 50,35);
        fill(255,0,0);
        rect(gameChar_x - 6, gameChar_y - 33, 15,27);
        fill(0);
        rect(gameChar_x - 5, gameChar_y - 5.5, 6, 10);
        rect(gameChar_x + 4, gameChar_y - 5.5, 10, 5);
        fill(255,150,150);
        rect(gameChar_x - 2, gameChar_y - 22, 6, 10);
        stroke(0);
        strokeWeight(3);
        point(gameChar_x - 5, gameChar_y - 50);
        strokeWeight(1);
        line(gameChar_x - 10, gameChar_y - 40, gameChar_x, gameChar_y - 40);

    }
    else if(isRight)
    {
        // add your walking right code


        stroke(0);
        strokeWeight(0.6);
        fill(255,150,150);
        ellipse(gameChar_x, gameChar_y - 50,35);
        fill(255,0,0);
        rect(gameChar_x - 8, gameChar_y - 33, 15,27);
        fill(0);
        rect(gameChar_x, gameChar_y - 5.5, 6, 10);
        rect(gameChar_x - 13, gameChar_y - 5.5, 10, 5);
        fill(255,150,150);
        rect(gameChar_x - 2, gameChar_y - 22, 6, 10);
        stroke(0);
        strokeWeight(3);
        point(gameChar_x + 5, gameChar_y - 50);
        strokeWeight(1);
        line(gameChar_x + 10, gameChar_y - 40, gameChar_x, gameChar_y - 40)



    }
    else if(isFalling && !isContact || isPlummeting)
    {
        // add your jumping facing forwards code
        stroke(0);
        strokeWeight(0.6);
        fill(255,150,150);
        ellipse(gameChar_x, gameChar_y - 50,35);
        fill(255,0,0);
        rect(gameChar_x - 12, gameChar_y - 33, 25,23);
        fill(0);
        rect(gameChar_x + 2, gameChar_y - 15, 8, 10);
        rect(gameChar_x - 9, gameChar_y - 15, 8, 10);
        fill(255,150,150);
        rect(gameChar_x - 18, gameChar_y - 40, 6, 15);
        rect(gameChar_x + 13, gameChar_y - 40, 6, 15);
        stroke(0);
        strokeWeight(3);
        point(gameChar_x - 5, gameChar_y - 50);
        point(gameChar_x + 5, gameChar_y - 50);
        strokeWeight(1);
        line(gameChar_x + 5, gameChar_y - 40, gameChar_x - 5, gameChar_y - 40)

    }
    else
    {
        // add your standing front facing code
        stroke(0);
        strokeWeight(0.6);
        fill(255,150,150);
        ellipse(gameChar_x, gameChar_y - 50,35);
        fill(255,0,0);
        rect(gameChar_x - 12, gameChar_y - 33, 25,27);
        fill(0);
        rect(gameChar_x + 1, gameChar_y-5.5, 8, 10);
        rect(gameChar_x - 8, gameChar_y - 5.5, 8, 10);
        fill(255,150,150);
        rect(gameChar_x - 18, gameChar_y - 27, 6, 15);
        rect(gameChar_x + 13, gameChar_y - 27, 6, 15);
        stroke(0);
        strokeWeight(3);
        point(gameChar_x - 5, gameChar_y - 50);
        point(gameChar_x + 5, gameChar_y - 50);
        strokeWeight(1);
        line(gameChar_x + 5, gameChar_y - 40, gameChar_x - 5, gameChar_y - 40)


    }
}

function drawClouds(x_clouds, y_clouds)
{
    fill(255,255,255);
    ellipse(x_clouds, y_clouds, cloud.size + 80, cloud.size + 50);
    ellipse(x_clouds + 50,y_clouds, cloud.size + 80,cloud.size + 50);
    ellipse(x_clouds + 30,y_clouds - 20, cloud.size + 60,cloud.size + 50);    
}

function drawMountains(t_mountains)
{
    fill(128, 128, 128)
    triangle(t_mountains.x_pos, floorPos_y, t_mountains.x_pos + 220 + t_mountains.size, floorPos_y, t_mountains.x_pos + 120 + t_mountains.size, floorPos_y - 400 - t_mountains.size);
    triangle(t_mountains.x_pos + 130, floorPos_y, t_mountains.x_pos + 330 + t_mountains.size, floorPos_y,t_mountains.x_pos + 230 + t_mountains.size, floorPos_y - 300 - t_mountains.size);
}

function drawTrees(t_trees)
{
    fill(150,75,0);
    rect(t_trees.x_pos, floorPos_y , 20, -t_trees.height);
    fill(6, 132, 15);
    ellipse(t_trees.x_pos + 10, floorPos_y - t_trees.height - 45, 100,100)
}


function drawCanyon(t_canyon)
{
    noStroke();
    fill(156,73,0);
    rect(t_canyon.x_pos, t_canyon.y_pos, t_canyon.width, height);
}

function checkCanyon(f_canyon)
{

    if (gameChar_x > f_canyon.x_pos && gameChar_x < f_canyon.x_pos + f_canyon.width && gameChar_y >= floorPos_y)
    {
        isPlummeting = true;
    }
}

function drawCollectables(t_collectable)
{
    checkCollectable(t_collectable);

    // Bobbing animation: each collectable bobs at slightly different phase
    var bob = sin(frameCount * 0.07 + t_collectable.x_pos * 0.02) * 5;
    var y = t_collectable.y_pos + bob;

    fill(255, 195, 0)
    rect(t_collectable.x_pos, y + 1, t_collectable.size, t_collectable.size - 26)
    fill(0, 231, 255)
    rect(t_collectable.x_pos + t_collectable.size, y - 10, 0.2 * t_collectable.size, 0.8 * t_collectable.size)
    rect(t_collectable.x_pos + t_collectable.size, y - 1, t_collectable.size - 5, t_collectable.size - 23)
    rect(t_collectable.x_pos + t_collectable.size * 1.6, y - 6, 0.2 * t_collectable.size, 0.4 * t_collectable.size)
    stroke(1)
    line(t_collectable.x_pos, y - 2, t_collectable.x_pos - 20, y - 2)
    noStroke();
}

function checkCollectable(f_collectable){

    var d = abs(dist(gameChar_x, gameChar_y, f_collectable.x_pos, f_collectable.y_pos))
    if (d < f_collectable.size) 
    {
        f_collectable.isFound = true
        game_score += 1;
        collectableSound.play()
    }
}

function clouds(){
    var x = 0;
    for (let i = 0; i < 40; i++)
    {
        x += random(100,200)
        clouds_x.push(x)
        x = clouds_x[i]

    }
    for (let i = 0; i < 40; i++)
    {
        clouds_y.push(random(3,300))
    }
}

function drawPlatforms () {    
    
        for(var i = 0; i < platforms.length; i++)
        {
            actualPlatform = platforms[i]
            let d_x = dist(gameChar_x, gameChar_y,actualPlatform.x,actualPlatform.y)
            var d_xfinal = dist(gameChar_x, gameChar_y,actualPlatform.x + actualPlatform.length,actualPlatform.y)
            if(platforms[i].checkContact(gameChar_x, gameChar_y))
            {
                isContact = true;
                isFalling = false;
                jumpCount = 0;
                break;
            } else if (d_x < 5 || d_xfinal < 5){
                isContact = false;
                isFalling = true;
                break;
            }
            else {
                isContact = false;
            }
        }
        if (isFalling == true)
        {
            gameChar_y += 2;
            if (gameChar_y >= floorPos_y)
            {
                isFalling = false;
                gameChar_y = floorPos_y;
                jumpCount = 0;
            }
        }
    }

function Enemy (x,y,range) {
    this.x = x;
    this.y = y;
    this.range = range;
    this.currentX = x;
    this.inc = 1;

    this.update = function(){
        this.currentX += this.inc

        if (this.currentX >= this.x + this.range)
        {
            this.inc = -1;
        }
        else if (this.currentX < this.x)
        {
            this.inc = 1
        }
    }
    this.draw = function(){
        this.update();
        fill(10, 249, 26)
        ellipse(this.currentX,this.y,30,30)
        fill(14, 229, 29)
        ellipse(this.currentX + 15,this.y,random(15,10),random(18,10))
        ellipse(this.currentX - 15,this.y,random(15,10),random(18,10))
        ellipse(this.currentX ,this.y + 15,random(15,10),random(18,10))
        ellipse(this.currentX,this.y - 15,random(15,10),random(18,10))

    }
    this.checkContact = function(gc_x, gc_y)
    {
        var d = dist(gc_x, gc_y,this.currentX, this.y)

        if (d < 20) {
            return true;
        } 
        return false;
    }
}

function drawFlagpole(t_flagpole){

    noStroke();
    fill(0)
    rect(t_flagpole.x_pos, floorPos_y - 100, 2, 100 )
    if(flagpole.isReached)
    {
        fill(0,255,0)
    } 
    else 
    {
        fill(255,0,0)
    }
    triangle(t_flagpole.x_pos, floorPos_y - 100, t_flagpole.x_pos, floorPos_y - 70, t_flagpole.x_pos - 35, floorPos_y - 85)

}

function checkFlagpole(f_flagpole){

    var d = abs(dist(gameChar_x, gameChar_y, f_flagpole.x_pos, f_flagpole.y_pos))
    if (d < 30) {
        f_flagpole.isReached = true

    }
}

function characterMovements() {
    //Character moving left
    if(isLeft == true)
    {
        if (gameChar_x > width * 0.2)
        {
            gameChar_x -= 3;
        }
    }
    //Character moving right
    if(isRight == true)
    {
        gameChar_x += 3;
    }

    //Character jumping
    if(isUp == true)
    {
        gameChar_y -= 4;
        if (gameChar_y <= jumpTarget)
        {
            isUp = false;
            isFalling = true;
        }
    }

    //Character falling into the canyon

    if (isPlummeting == true)
    {
        gameChar_y += 6;
        isRight = false;
        isLeft = false;
    }
}

function checkPlayerLives(){

    if (gameChar_y == 450)
    {   
        lives -= 1;
        if (lives > 0)
        {
            failSound.play()
        } else {
            lostSound.play()
        }
    }
    if (gameChar_y > 666)
    {
        startGame();
    }

}


function startDisplay (){
    fill(255)
    textSize(25)
    stroke(0)
    text("Game over. Press space to continue.", 288, height/2);
    textSize(15)
    noStroke()
    if (restartButton) 
    {
        lives = 3;
        dead = false;
        startGame();
    }
}

function startWinnerDisplay(){
    stroke(0);
    win = true;
    // Update high score
    if (game_score > highScore) {
        highScore = game_score;
    }
    fill(255);
    textSize(25);
    text("LEVEL COMPLETE. Press space to continue.", 288, height/2);
    text("Your score is " + game_score + ".", 288 + 180, height/2 + 40);
    if (game_score >= highScore && game_score > 0) {
        fill(255, 215, 0);
        textSize(20);
        text("NUEVA PUNTUACION MAXIMA: " + highScore + "!", 288 + 80, height/2 + 75);
    }
    textSize(15);
    noStroke();
}

function victoryJump() {

    if (gameChar_y == floorPos_y) {
        isUp = true;
    }

}

function createPlatforms (x, y, length, speed, moveRange)
{
    var p = {
        x: x,
        y: y,
        length: length,
        speed: speed || 0,
        moveRange: moveRange || 0,
        startX: x,
        dir: 1,
        update: function ()
        {
            if (this.speed > 0) {
                this.x += this.speed * this.dir;
                if (this.x > this.startX + this.moveRange) { this.dir = -1; }
                else if (this.x < this.startX - this.moveRange) { this.dir = 1; }
            }
        },
        draw: function ()
        {
            if (this.speed > 0) {
                fill(30, 100, 180); // moving platforms are blue
            } else {
                fill(44, 139, 0);
            }
            rect(this.x, this.y, this.length, 10);
        },
        checkContact: function (gc_x, gc_y)
        {
            if (gc_x > this.x && gc_x < this.x + this.length)
            {
                var d = this.y - gc_y;
                if (d >= 0 && d < 5)
                {
                    return true;
                }
                return false;
            }
        }
    }

    return p;
}

function drawHouse ()
{
    fill (226, 204, 109 )
    rect(30, floorPos_y - 250, 250,250)
    fill(0)
    rect(30 + 130, floorPos_y - 100, 60,100)
    fill (42, 193, 187 ) 
    rect(30 + 50, floorPos_y - 210, 50,50)
    fill (243, 118, 54)
    triangle (15, floorPos_y - 250, 250 + 45, floorPos_y - 250, 30 + 125, floorPos_y - 350)
}


function heart(x, y, size) {
    beginShape();
    vertex(x, y);
    bezierVertex(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
    bezierVertex(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
    endShape(CLOSE);
}


function drawLives ()
{
    for (i = 1; i < 4; i++)
    {
        if (i == lives) 
        {
            for (j = 1; j <= i ; j++) 
            {
                fill(255, 0, 0);
                heart(30 * j, 30, 15);

            }
        }
    }
}

function checkCheckpoint () {
    if (checkPoint) 
    {
        gameChar_x = 2550;
    }  
    else {
        gameChar_x = width/2
    }
}

function drawCheckpoint ()
{
    textSize(15)
    fill(255)
    if (checkPoint)
    {                  
        fill(255,0,0)
    }
    text("¡ CHECKPOINT !", 2550 - 65, floorPos_y - 130 )
}