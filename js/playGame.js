// JavaScript Document

class playGame extends Phaser.Scene {
    constructor () {
        super({key: "playGame"});
    }
    
    // Initiate scene params
    init() {
        // Player speed
        this.playerSpeed = 50;
    };

    // Load assets
    preload() {
        // Load images
        this.load.image('tiles', '/assets/tilesets/MyBasicTiles.png');
        this.load.spritesheet('player', '/assets/sprites/BasePerson.png', { frameWidth: 12, frameHeight: 16});
    };

    // Called once after preload
    create() {
        // BG sprite
        this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'tiles');

        // *Player
        // Get spawn location
        var spawnX = gameValues.screenSize.col / 2,
            spawnY = gameValues.screenSize.row / 2; //spawnX spawnY: randomInterval(1, gameValues.mapSize.col - 1); randomInterval(1, gameValues.mapSize.row - 1);

        // Create player sprite
        this.player = this.physics.add.sprite(gameValues.tileSize * (spawnX + 0.5), gameValues.tileSize * (spawnY + 0.5), 'player', 0);

        // Make sure the player can't walk off the screen
        this.physics.world.bounds.width = this.sys.game.config.width; //map.widthInPixels;
        this.physics.world.bounds.height = this.sys.game.config.height; //map.heightInPixels;
        this.player.setCollideWorldBounds(true);

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
        });

        // Camera
        /*var camera = this.cameras.main;
        camera.startFollow(this.player);
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);*/

        // Keyboard input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.key_D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        this.key_A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        this.key_W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
        this.key_S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
    };

    // Called once per frame - default 60 fps
    update() {

        // Player movement
        this.player.body.setVelocity(0);

        // Horizontal movement
        if (this.cursors.left.isDown || this.key_A.isDown) {
            this.player.body.setVelocityX(-this.playerSpeed);
            this.player.setFlipX(true);
        } else if (this.cursors.right.isDown || this.key_D.isDown || this.input.activePointer.isDown) { //click/touch input here
            this.player.body.setVelocityX(this.playerSpeed);
            this.player.setFlipX(false);
        }

        // Vertical movement
        if (this.cursors.up.isDown || this.key_W.isDown) {
            this.player.body.setVelocityY(-this.playerSpeed);
        } else if (this.cursors.down.isDown || this.key_S.isDown) {
            this.player.body.setVelocityY(this.playerSpeed);
        }

        // Add animations
        if (this.cursors.left.isDown || this.cursors.right.isDown || this.cursors.down.isDown || this.cursors.up.isDown || this.key_D.isDown || this.key_A.isDown || this.key_W.isDown || this.key_S.isDown || this.input.activePointer.isDown) {
            this.player.anims.play("walk", true);
        } else {
            this.player.anims.play('stand');
        }

    };
}