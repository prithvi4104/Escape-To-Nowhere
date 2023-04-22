var canvas, backgroundImage;

var PLAY = 1;
var END = 0;
var gameState = PLAY;
var playerCount;
var allPlayers;
var distance = 0;
var score = 0;

var player, game;

var runner, police, obstacle1, obstacle2,restart;

var track,track_img, runner_img, obstacle1_img, obstacle2_img, police_img,caught_img,restart_img;

var invisibleGround1,invisibleGround2;

var barrierGroup , coneGroup;

var gameOver,gameOver_image ;

function preload(){
  // giving images to variables

  track_img = loadImage("images/Track.png");
  obstacle1_img = loadImage("images/Barrier.png");
  obstacle2_img = loadImage("images/cone.png");
  police_img = loadImage("images/policeCar.png");
  runner_img = loadAnimation("images/Runner1.png","images/Runner2.png");
  caught_img = loadAnimation("images/Caught.png");
  restart_img = loadImage("images/restart.png");
  gameOver_image = loadImage("images/gameOver.png");
}

function setup(){
  canvas = createCanvas(displayWidth -20, displayHeight-190);

  // creating track
  track = createSprite(width/2,height/2,width,displayHeight);
  track.addImage("track",track_img);
  track.scale = 4;
  track.velocityY = 4;

  // creatig runner or theif (Playing character)
  runner = createSprite(width/2,height-305);
  runner.addAnimation("running",runner_img);
  runner.addAnimation("caught",caught_img);
  //creating police or NPC
  police = createSprite(runner.x,runner.y + 230);
  police.addImage("Police",police_img);
  police.scale = 0.3;
  police.visible = false;

  invisibleGround1 = createSprite(300,runner.y,50,700);
  invisibleGround1.visible = false;

  invisibleGround2 = createSprite(970,runner.y,50,700);
  invisibleGround2.visible = false;

  // restart button 
  restart = createSprite(displayWidth/2,displayHeight/2);
  restart.addImage("restart",restart_img);
  restart.visible = false;
  restart.scale = 0.5;

  gameOver = createSprite(restart.x,restart.y -340);
  gameOver.addImage("gameOver",gameOver_image);
  gameOver.visible = false ; 
  gameOver.scale = 0.6;
  
  barrierGroup = new Group();
  coneGroup = new Group();
}


function draw(){

  background(0);
  if(gameState === PLAY){

    // calculating score
    score = score + Math.round(getFrameRate()/62);

    // increasing speed of track with score
    track.velocityY = (6 + 3*score/150);

    // creating endless loop
    if(track.y > 310){
  
     track.y = 192;
   }

   runner.collide(invisibleGround1);
   runner.collide(invisibleGround2);
   
   //reshaping police endges
   police.setCollider("rectangle",0,0,police.width-100,800);
  
   // Moving runner left and right
   if(keyDown("LEFT_ARROW")){
     runner.x = runner.x - 10;
   }
   if(keyDown("RIGHT_ARROW")){
     runner.x = runner.x + 10;
   }
  
   createObstacle();

   police.x = runner.x;

   // if runner touches cone group
   if(runner.isTouching(coneGroup)){
     for(var index = 0; index < coneGroup.length; index++){
       if(coneGroup[index].isTouching(runner)){
        coneGroup[index].destroy();
        //ploice car becomes visible
        police.visible = true;
       }
     }
     
   }

  // if police car touches barrier group
   if(police.isTouching(barrierGroup)){
    for(var index = 0; index < barrierGroup.length; index++){
      if(barrierGroup[index].isTouching(police)){
       barrierGroup[index].destroy();

      }
    }

  }

  if(police.isTouching(coneGroup)){
    for(var index = 0; index < coneGroup.length; index++){
      if(coneGroup[index].isTouching(police)){
        //destroying cone when poice car touches it
         coneGroup[index].destroy();

      }
    }

  }

  //Game Adaptivity
  if(score/50 > 1){
    coneGroup.setVelocityYEach(10);
    barrierGroup.setVelocityYEach(10);
  }
  if(score/50 > 2){
    coneGroup.setVelocityYEach(15);
    barrierGroup.setVelocityYEach(15);
  }
  else if(score/50 > 3){
    coneGroup.setVelocityYEach(20);
    barrierGroup.setVelocityYEach(20);
  }
  else if(score/50 > 4){
    coneGroup.setVelocityYEach(25);
    barrierGroup.setVelocityYEach(25);
  }
  else if(score/50 > 5){
    coneGroup.setVelocityYEach(30);
    barrierGroup.setVelocityYEach(30);
  }
  else if(score/50 > 6){
    coneGroup.setVelocityYEach(35);
    barrierGroup.setVelocityYEach(35);
  }
  else if(score/50 > 7){
    coneGroup.setVelocityYEach(40);
    barrierGroup.setVelocityYEach(30);
  }
  else if(score/50 > 8){
    coneGroup.setVelocityYEach(50);
    barrierGroup.setVelocityYEach(50);
  }
  else if(score/50 > 9){
    coneGroup.setVelocityYEach(60);
    barrierGroup.setVelocityYEach(60);
  }
  else if(score/50 > 10){
    coneGroup.setVelocityYEach(75);
    barrierGroup.setVelocityYEach(75);
  }

  //game over if runne touches barrier
   if(runner.isTouching(barrierGroup)){
    gameState = END;
   }

  }
  else if(gameState === END){
    runner.velocityY = 0;
    track.velocityY = 0;
    runner.changeAnimation("caught",caught_img);
    runner.scale = 0.5;
    barrierGroup.setVelocityYEach(0);
    // barrier stops moving
    barrierGroup.setLifetimeEach(-1);
    coneGroup.setVelocityYEach(0);
    //barrier stops moving
    coneGroup.setLifetimeEach(-1);
    //Game Over and Restart is displayed
    gameOver.visible = true;
    restart.visible = true;
    // restart when restart is cicked
    if(mousePressedOver(restart)){
      reset();
    }
  }
 
  drawSprites();

  //Score display
  textSize(20);
  fill("Red");
  text("Score : "+ score,displayWidth/2 + 200,50); 
}

function createObstacle(){

  //Random spawning of barrier and cone
  if(frameCount % 70 === 0){
    var rand = Math.round(random(1,2));

    if(rand === 1){

      var barrier = createSprite(Math.round(random(320,930)),30);
      barrier.setCollider("rectangle",0,0,barrier.width+70,170);
      barrier.addImage("Barrier",obstacle1_img);
      barrier.scale = 0.5 ;
      barrier.velocityY = 5;
      barrier.depth = runner.depth;
      barrier.depth = restart.depth;
      runner.depth = runner.depth + 1;
      restart.depth = restart.depth + 1;
      //barrier disappearing after it reaches bottom
      barrier.lifetime= 115;
      barrierGroup.add(barrier);

    }
    if(rand === 2){
      var cone = createSprite(Math.round(random(320,930)),30);
      cone.addImage("Coen",obstacle2_img);
      cone.scale = 0.2 ;
      cone.velocityY = 5;
      cone.depth = runner.depth;
      cone.depth = restart.depth;
      runner.depth = runner.depth + 1;
      restart.depth = restart.depth + 1;
      //Cone disappearing after reaching bottom
      cone.lifetime= 115;
      cone.setCollider("rectangle",0,0,cone.width+5,200);
      coneGroup.add(cone);
    }
  }
}

function reset(){

  gameState = PLAY;

  barrierGroup.destroyEach();
  coneGroup.destroyEach();
  restart.visible = false ; 
  gameOver.visible = false ;
  runner.changeAnimation("running",runner_img);
  runner.scale = 1;
  score = 0;
  // placing runner in middle
  runner.x = width/2;
  //placing runner at the bottom 
  runner.y = height-315;
}

