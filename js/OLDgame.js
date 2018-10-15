// JavaScript Document

//import modules
//import { randomInterval, dungeOn } from "./dungeOn.js";

//starting variables 
var game;
var gameValues = {
    tileSize: 16,
    screenSize: {
        col: 40,
        row: 40
    },
    mapSize: {
        col: 40,
        row: 40
    }
};

window.onload = function () { //runs all this stuff as soon as the window loads
    var config = {
        type: Phaser.AUTO,
        width: gameValues.screenSize.col * gameValues.tileSize,
        height: gameValues.screenSize.row * gameValues.tileSize,
        pixelArt: true,
        physics: {
            default: "arcade",
            arcade: {
                gravity: { y: 0 } // Top down game, so no gravity
            }
        },
        scene: [bootGame, playGame]
    };
  game = new Phaser.Game(config); //makes the game
  window.focus();
  resizeGame();
  window.addEventListener("resize", resizeGame);
}

class bootGame extends Phaser.Scene{ //boot scene
    constructor(){
        super("BootGame");
    }
    preload(){
      this.load.image('tiles', '/InfiniteSkeleton/assets/tilesets/MyBasicTiles.png');
      this.load.spritesheet('player', '/InfiniteSkeleton/assets/sprites/BasePerson.png', { frameWidth: 12, frameHeight: 16});
    }
    create(){
      console.log("game boot")
        this.scene.start("PlayGame");
    }
}

class playGame extends Phaser.Scene{ // the main game scene
  constructor(){
    super("PlayGame");
  }
  create(){
    // Load a map from a 2D array of tile indices
    var level = dungeOn(gameValues.mapSize.col, gameValues.mapSize.row, 100, 10); //dungeOn(x, y, maxTunnel, maxLength)

    const map = this.make.tilemap({ data: level, tileWidth: 16, tileHeight: 16 });
    const tiles = map.addTilesetImage("tileset_1bit.png", "tiles");

    this.groundLayer = map.createBlankDynamicLayer("Ground", tiles);
    map.createBlankDynamicLayer("Foreground", tiles);

    this.groundLayer.putTilesAt(level, 0, 0)

    this.groundLayer.setCollision([2, 3]); //walls 3

    console.log("map intialized");

    // Player
    var spawnX = randomInterval(1, gameValues.mapSize.col - 1);
    var spawnY = randomInterval(1, gameValues.mapSize.row - 1);

    while (level[spawnY][spawnX] != 0){
      var spawnX = randomInterval(1, gameValues.mapSize.col - 1);
      var spawnY = randomInterval(1, gameValues.mapSize.row - 1);
    }

    this.player = this.physics.add.sprite(gameValues.tileSize * (spawnX + 0.5), gameValues.tileSize * (spawnY + 0.5),'player',0)
    // Watch the player and worldLayer for collisions, for the duration of the scene:
    this.physics.add.collider(this.player, this.groundLayer);
    console.log("player loaded")
    this.physics.world.bounds.width = map.widthInPixels;
    this.physics.world.bounds.height = map.heightInPixels;
    this.player.setCollideWorldBounds(true);

    // Player animations
    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('player', { start: 1, end: 2 }),
      frameRate: 8,
      repeat: -1
    });

    this.anims.create({
      key: 'stand',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 0 }),
      frameRate: 1
    })

    // Camera
    var camera = this.cameras.main;
    camera.startFollow(this.player);
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // Keyboard input
    this.cursors = this.input.keyboard.createCursorKeys();
  }
  update(time,delta){
    var player = this.player;
    var speed = 80;
    const prevVelocity = player.body.velocity.clone();

    // Player movement
    this.player.body.setVelocity(0);

    // Horizontal movement
    if (this.cursors.left.isDown)
    {
        this.player.body.setVelocityX(-speed);
        player.setFlipX(true);
    }
    else if (this.cursors.right.isDown)
    {
        this.player.body.setVelocityX(speed);
        player.setFlipX(false)
    }

    // Vertical movement
    if (this.cursors.up.isDown)
    {
        this.player.body.setVelocityY(-speed);
    }
    else if (this.cursors.down.isDown)
    {
        this.player.body.setVelocityY(speed);
    }

    if (this.cursors.left.isDown || this.cursors.right.isDown || this.cursors.down.isDown || this.cursors.up.isDown) {
      player.anims.play("walk", true);
    } else {
      player.anims.play('stand');
    }
  }
}

function resizeGame(){ // makes the game fit the screen
  var canvas = document.querySelector("canvas");
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;
  var windowRatio = windowWidth / windowHeight;
  var gameRatio = game.config.width / game.config.height;
  if (windowRatio < gameRatio){
    canvas.style.width = windowWidth + "px";
    canvas.style.height = (windowWidth / gameRatio) + "px";
  }
  else {
    canvas.style.width = (windowHeight * gameRatio) + "px";
    canvas.style.height = windowHeight + "px";
  }
}