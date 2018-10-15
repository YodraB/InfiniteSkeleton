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

// Bulk of the game code - init, preload, create, update

// Load assets
gameScene.preload = function () {
    // Load images
    this.load.image('tiles', '/assets/tilesets/MyBasicTiles.png');
    this.load.spritesheet('player', '/assets/sprites/BasePerson.png', { frameWidth: 12, frameHeight: 16});
};

// Called once after preload
gameScene.create = function () {
    // BG sprite
    this.add.sprite(config.width / 2, config.height / 2, 'tiles');
    
    // Player
    // Get spawn location, create player sprite
    var spawnX = gameValues.screenSize.col / 2,
        spawnY = gameValues.screenSize.row / 2,
        player = this.physics.add.sprite(gameValues.tileSize * (spawnX + 0.5), gameValues.tileSize * (spawnY + 0.5), 'player', 0);
        //spawnX spawnY: randomInterval(1, gameValues.mapSize.col - 1); randomInterval(1, gameValues.mapSize.row - 1);
};
