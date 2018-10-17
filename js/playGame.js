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
        this.load.image('tiles', '/InfiniteSkeleton/assets/tilesets/MyBasicTiles.png');
        this.load.spritesheet('player', '/InfiniteSkeleton/assets/sprites/BasePerson.png', { frameWidth: 12, frameHeight: 16});
    };

    // Called once after preload
    create() {
        // Load a map from a 2D array of tile indices
        var level = dungeOn(gameValues.mapSize.col, gameValues.mapSize.row, 100, 10); //dungeOn(x, y, maxTunnel, maxLength)

        const map = this.make.tilemap({ data: level, tileWidth: 16, tileHeight: 16 });
        const tiles = map.addTilesetImage("MyBasicTiles.png", "tiles");

        this.groundLayer = map.createBlankDynamicLayer("Ground", tiles);
        map.createBlankDynamicLayer("Foreground", tiles);

        this.groundLayer.putTilesAt(level, 0, 0);

        this.groundLayer.setCollision([2]); //walls 2

        // *Player
        // Get spawn location
        
        function spawnXgen(){
            spawnX = Phaser.Math.RND.integerInRange(0, gameValues.mapSize.col - 1);
            return spawnX;
        }

        function spawnYgen(){
             spawnY = Phaser.Math.RND.integerInRange(0, gameValues.mapSize.row - 1);
             return spawnY;
        }
        
        var spawnX = spawnXgen(),
            spawnY = spawnYgen();
        
        while (level[spawnY][spawnX] != 0){
            spawnX = spawnXgen(); 
            spawnY = spawnYgen();
        }

        // Create player sprite
        this.player = this.physics.add.sprite(gameValues.tileSize * (spawnX + 0.5), gameValues.tileSize * (spawnY + 0.5), 'player', 0);
        this.physics.add.collider(this.player, this.groundLayer);

        // Make sure the player can't walk off the screen
        this.physics.world.bounds.width = map.widthInPixels;
        this.physics.world.bounds.height = map.heightInPixels;
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
        var camera = this.cameras.main;
        camera.startFollow(this.player);
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        // Keyboard input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.key_D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        this.key_A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        this.key_W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
        this.key_S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
        
        //Touch input
        this.leftTouch = false
        this.leftZone = this.add.zone(gameValues.tileSize, this.sys.game.config.height/2, gameValues.tileSize * 2, gameValues.tileSize * 4)
        this.upTouch = false
        this.upZone = this.add.zone(this.sys.game.config.width/2, gameValues.tileSize, gameValues.tileSize * 4, gameValues.tileSize * 2)
        this.rightTouch = false
        this.rightZone = this.add.zone(this.sys.game.config.width - gameValues.tileSize, this.sys.game.config.height/2, gameValues.tileSize * 2, gameValues.tileSize * 4)
        this.downTouch = false
        this.downZone = this.add.zone(this.sys.game.config.width/2, this.sys.game.config.height - gameValues.tileSize, gameValues.tileSize * 4, gameValues.tileSize * 2)
    };

    // Called once per frame - default 60 fps
    update() {
        
        // Touch input
        
        this.leftZone.setInteractive().on('pointerdown', function(pointer, localX, localY, event){
            this.leftTouch = true;
        }, this);
        this.leftZone.setInteractive().on('pointerup', function(pointer, localX, localY, event){
            this.leftTouch = false;
        }, this);
        this.upZone.setInteractive().on('pointerdown', function(pointer, localX, localY, event){
            this.upTouch = true;
        }, this);
        this.upZone.setInteractive().on('pointerup', function(pointer, localX, localY, event){
            this.upTouch = false;
        }, this);
        this.rightZone.setInteractive().on('pointerdown', function(pointer, localX, localY, event){
            this.rightTouch = true;
        }, this);
        this.rightZone.setInteractive().on('pointerup', function(pointer, localX, localY, event){
            this.rightTouch = false;
        }, this);
        this.downZone.setInteractive().on('pointerdown', function(pointer, localX, localY, event){
            this.downTouch = true;
        }, this);
        this.downZone.setInteractive().on('pointerup', function(pointer, localX, localY, event){
            this.downTouch = false;
        }, this);

        // Player movement
        this.player.body.setVelocity(0);

        // Horizontal movement
        if (this.cursors.left.isDown || this.key_A.isDown || this.leftTouch == true) {
            this.player.body.setVelocityX(-this.playerSpeed);
            this.player.setFlipX(true);
        } else if (this.cursors.right.isDown || this.key_D.isDown || this.rightTouch == true) {
            this.player.body.setVelocityX(this.playerSpeed);
            this.player.setFlipX(false);
        }

        // Vertical movement
        if (this.cursors.up.isDown || this.key_W.isDown || this.upTouch == true) {
            this.player.body.setVelocityY(-this.playerSpeed);
        } else if (this.cursors.down.isDown || this.key_S.isDown || this.downTouch == true) {
            this.player.body.setVelocityY(this.playerSpeed);
        }

        // Add animations
        if (this.cursors.left.isDown || this.cursors.right.isDown || this.cursors.down.isDown || this.cursors.up.isDown || this.key_D.isDown || this.key_A.isDown || this.key_W.isDown || this.key_S.isDown || this.leftTouch == true || this.rightTouch == true || this.upTouch == true || this.downTouch== true) {
            this.player.anims.play("walk", true);
        } else {
            this.player.anims.play('stand');
        }

    };
}
