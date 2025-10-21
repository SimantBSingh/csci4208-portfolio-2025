class PlayScene extends Phaser.Scene {
    //construct new scene
    constructor() {
        super('play'); //set this scene's id within superclass constructor
    }
    //preload external game assets
    preload() {
        this.load.path = 'assets/'; //Define file path
        this.load.image('background', 'background.png'); //Load background image
        this.load.image('player', 'player.png'); //Load player image
        this.load.image('enemy', 'enemy.png'); //Load player image
        this.load.image('projectile', 'projectile.png');
        this.load.image('player-0', 'player-0.png');
        this.load.image('player-1', 'player-1.png');
        this.load.image('enemy-0', 'enemy-0.png');
        this.load.image('enemy-1', 'enemy-1.png');
        this.load.image('powerup-projectile', 'powerup-1.png'); //Load projectile image
        this.load.image('powerup-slay', 'powerup-2.png'); //Load projectile image
    }

    player_update() {
        this.player.move();
        this.player.attack();
    }

    collect_powerup(player, powerup) {
        powerup.applyEffect(player);
        powerup.destroy();
    }

    //create game data
    create() {
        this.create_map();
        this.create_animations();
        this.create_projectiles();
        this.create_player()
        this.create_enemies();
        this.create_powerups();
        this.create_collisions();
        this.create_hud();
        this.input.keyboard.on('keydown-ESC', () => { this.scene.start('title'); });
    }

    create_player() {
        this.player = new Player(this);
    }

    create_animations(scene) {
        if (!this.anims.exists('player-move')) {
            const anim_player_move = new Object();
            anim_player_move.key = 'player-move'; //key to register into phaser
            anim_player_move.frames = [{ key: 'player-0' }, { key: 'player-1' }]; //list of image keys for anim
            anim_player_move.frameRate = 6; //speed to play animation
            anim_player_move.repeat = -1; //-1 for infinite loop
            this.anims.create(anim_player_move); //facotory creates anim obj
        }
        if (!this.anims.exists('enemy-move')) {
            const anim_enemy_move = new Object();
            anim_enemy_move.key = 'enemy-move'; //key to register into phaser
            anim_enemy_move.frames = [{ key: 'enemy-0' }, { key: 'enemy-1' }]; //list of image keys for anim
            anim_enemy_move.frameRate = 6; //speed to play animation
            anim_enemy_move.repeat = -1; //-1 for infinite loop
            this.anims.create(anim_enemy_move); //facotory creates anim obj
        }
    }

    create_collisions() {
        this.physics.add.overlap(this.player, this.enemies, this.game_over, null, this);
        this.physics.add.overlap(this.player_projectiles, this.enemies, this.slay_enemy, null, this);
        this.physics.add.overlap(this.player, this.powerups, this.collectPowerUp, null, this);
        this.physics.add.overlap(this.enemy_projectiles, this.player, this.game_over, null, this);
    }

    create_enemies() {
        this.enemies = [];
        const event = new Object();
        event.delay = 200;
        event.callback = this.spawn_enemy;
        event.callbackScope = this;
        event.loop = true;
        this.time.addEvent(event, this);
    }

    create_map() {
        this.background = this.add.tileSprite(640 / 2, 480 / 2, 640, 480, 'background');
    }


    create_powerups() {
        this.powerups = [];
        const event = new Object();
        event.delay = 3000;
        event.callback = this.spawn_powerup;
        event.callbackScope = this;
        event.loop = true;
        this.time.addEvent(event, this);
    }

    create_projectiles() {
        this.player_projectiles = [];
        this.enemy_projectiles = [];
    }

    spawn_enemy() {
        const config = {};
        config.x = 640 + 32;
        config.y = Phaser.Math.Between(0, 480)
        const monster = new Enemy(this, config);
        this.enemies.push(monster);
        this.score += 1;
    }

    spawn_powerup() {
        this.powerup_types = [ProjectilePowerUp, SlayPowerUp]
        if (Phaser.Math.Between(0, 4) !== 0) return;
        const PowerUpClass = Phaser.Utils.Array.GetRandom(this.powerup_types);
        const position = {
            x: 640 + 32,
            y: Phaser.Math.Between(50, 430)
        };
        const powerup = new PowerUpClass(this, position.x, position.y);
        this.powerups.push(powerup);
    }
    //Update game data
    update(time) {
        this.update_player(time);
        this.update_enemies(time);
        this.update_background();
        this.update_score();
    }
    update_enemies(time) {
        this.enemies.forEach(enemy => enemy.attack(time));
    }
    update_background() {
        this.background.tilePositionX += 3;
    }
    update_player(time) {
        this.player.move();
        this.player.attack(time);
    }

    update_score() {
        this.score_text.setText(`Score: ${this.score}`);
        const { winner, top_score } = this.registry.values;
        this.top_score_text.setText(`${winner}: ${top_score}`);
    }

    create_hud() {
        this.score = 0;
        this.score_text = this.add.text(32, 32, "");
        this.score_text.depth = 3;
        this.score_text.setColor('rgb(255,255,255)');
        // Initialize persistent state by reading from the registry
        const { winner, top_score } = this.registry.values;
        this.top_score_text = this.add.text(600, 32,
            `${winner}: ${top_score}`);
        this.top_score_text.depth = 3;
        this.top_score_text.setOrigin(1, 0);
    }

    game_over() {
        const { top_score, winner } = this.registry.values;
        if (this.score >= top_score) {
            this.registry.set('top_score', this.score);
            this.physics.pause(); // freeze gameplay
            const winner = prompt(`New High Score! Enter your name:`);
            this.registry.set('winner', winner || 'Top Score');
            this.input.keyboard.keys = [] // reset phaser keys stream
        }
        this.cameras.main.flash();
        this.scene.restart();
    }

    slay_enemy(projectile, enemy) {
        enemy.destroy();
        projectile.destroy();
    }
}