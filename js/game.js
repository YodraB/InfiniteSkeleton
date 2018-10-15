// JavaScript Document

// Set constants
let gameValues = {
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

window.onload = function() {
    // Set configuration
    let config = {
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
        scene: [ playGame ]
    };

    // Create game, pass configuration
    let game = new Phaser.Game(config);
    resizeGame();
    window.addEventListener("resize", resizeGame, false);
    
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
}