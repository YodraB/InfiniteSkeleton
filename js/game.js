// JavaScript Document

// Set constants
var gameValues = {
    tileSize: 16,
    screenSize: {
        col: 8,
        row: 8
    },
    mapSize: {
        col: 40,
        row: 40
    }
};

// Create scene
var gameScene = new Phaser.Scene('Game');

// Set configuration
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
    scene: gameScene
};

// Create game, pass configuration
var game = new Phaser.Game(config);

// Game size bits
function resizeGame() { // makes the game fit the screen
    var canvas = document.querySelector("canvas"),
        windowWidth = window.innerWidth,
        windowHeight = window.innerHeight,
        windowRatio = windowWidth / windowHeight,
        gameRatio = game.config.width / game.config.height;
    if (windowRatio < gameRatio) {
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
    } else {
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
}

window.focus();
resizeGame();
window.addEventListener("resize", resizeGame);

// *Bulk of the game code - init, preload, create, update

// Initiate scene params
gameScene.init = function () {
    // Player speed
    this.playerSpeed = 50;
};

// Load assets
gameScene.preload = function () {
    // Load images
    this.load.image('tiles', '/assets/tilesets/MyBasicTiles.png');
    this.load.spritesheet('player', '/assets/sprites/BasePerson.png', { frameWidth: 12, frameHeight: 16});
};

// Called once after preload
gameScene.create = function () {
    // BG sprite
    this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'tiles');
    
    // *Player
    // Get spawn location
    var spawnX = gameValues.screenSize.col / 2,
        spawnY = gameValues.screenSize.row / 2; //spawnX spawnY: randomInterval(1, gameValues.mapSize.col - 1); randomInterval(1, gameValues.mapSize.row - 1);
    
    // Create player sprite
    this.player = this.physics.add.sprite(gameValues.tileSize * (spawnX + 0.5), gameValues.tileSize * (spawnY + 0.5), 'player', 0);
    
    // Player animations
    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('player', { start: 1, end: 2 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'stand',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 0 }),
      frameRate: 1
    })
    
    // Keyboard input
    this.cursors = this.input.keyboard.createCursorKeys();
};

// Called once per frame - default 60 fps
gameScene.update = function () {
    var prevVelocity = this.player.body.velocity.clone();
    
    // Player movement
    this.player.body.setVelocity(0);

    // Horizontal movement
    if (this.cursors.left.isDown)
    {
        this.player.body.setVelocityX(-this.playerSpeed);
        this.player.setFlipX(true);
    }
    else if (this.cursors.right.isDown || this.input.activePointer.isDown) //click/touch input here
    {
        this.player.body.setVelocityX(this.playerSpeed);
        this.player.setFlipX(false)
    }

    // Vertical movement
    if (this.cursors.up.isDown)
    {
        this.player.body.setVelocityY(-this.playerSpeed);
    }
    else if (this.cursors.down.isDown)
    {
        this.player.body.setVelocityY(this.playerSpeed);
    }
    
    // Add animations
    if (this.cursors.left.isDown || this.cursors.right.isDown || this.cursors.down.isDown || this.cursors.up.isDown || this.input.activePointer.isDown) {
      this.player.anims.play("walk", true);
    } else {
      this.player.anims.play('stand');
    }

};