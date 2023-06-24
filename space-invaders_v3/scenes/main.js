import * as Phaser from "phaser";
import { ENEMIES, PLAYERS, BULLETS, BUBBLES_UPDATE_PLAYER, LEVEL_SCORE, MAX_SCORE, Monsterlifetime } from "../utils/constants";
import { Ship } from "../module/Ship";
import { Enemy } from "../module/Enemy";
import { Bullet } from "../module/Bullet";


import { getWindowWidthAndHeight } from "../utils/utils";
export class MainScene extends Phaser.Scene {

  #background = {
    stars: null,
    meteors: null,
    luminaries: null,
  };
  #state;
  #player;
  #cursors;
  #spaceClick;
  #sounds = {
    shoot: null,
    enemyDeath: null,
    explosion: null,
    monsterHit: null,
    monsterExplosion: null
  };
  #bullets;
  #bulletsEnemies;
  #enemies;
  #monster;
  #monsterLifeTimeCounter = 0;
  #bubbleUpdatePlayer;
  #scoreText;
  #levelText;
  #score = 0;
  #level = 1;
  #createEnemyEvent;
  #shootBulletEvent;
  constructor() {
    super({
      key: "mainScene",
    });
  }
  preload() {
    this.#loadAssets();
    this.#cursors = this.input.keyboard.createCursorKeys();
    this.#spaceClick = this.input.keyboard.addKey("space");
    this.#handleTouch();

    this.#addText();

  }
  create() {

    this.#createBackground();

    this.#player = Ship.create(this, "player-1");

    this.#sounds = {
      shoot: this.sound.add("shootSound"),
      enemyDeath: this.sound.add("enemydeathSound"),
      explosion: this.sound.add("explosionSound"),
      monsterExplosion: this.sound.add('monsterExplosion'),
      monsterHit: this.sound.add('monsterHit')
    };

    this.#enemies = this.physics.add.group();
    this.#bullets = this.physics.add.group();
    this.#bulletsEnemies = this.physics.add.group();



    this.#createBubbleUpdatePlayer()


    this.#monster = this.physics.add.sprite(-100, -100, 'monster');
    this.#monster.setCollideWorldBounds(true);
    this.#monster.visible = false;


    this.#createExplosionAnimations();

    this.#addColliders();
    this.#addMonsterColliders();


    this.#createEnemyEvent = this.time.addEvent({
      delay: 2000 / this.#level,
      callbackScope: this,
      loop: true,
      callback: this.#createEnemy,
    });

    this.#shootBulletEvent = this.time.addEvent({
      delay: 2000 / this.#level,
      loop: true,
      callback: this.#shootBulletFromEnemy,
      callbackScope: this,
    });
    this.time.addEvent({ delay: 10000, callback: this.#createLuminary, callbackScope: this, loop: true });


  }
  update() {
    this.#increaseLevel();
    this.#background.stars.tilePositionY += this.#level
    this.#moveMeteors();
    if (this.#state === 'game_over') {
      return;
    }
    this.#moveMonster();

    if (this.#score >= MAX_SCORE && this.#monsterLifeTimeCounter === Monsterlifetime) {
      this.#showTextCenter('You Win !\n your score is ' + this.#score);
      this.physics.pause();
      // Stop the ongoing events
      if (this.#createEnemyEvent) {
        this.#createEnemyEvent.remove();
      }

      if (this.#shootBulletEvent) {
        this.#shootBulletEvent.remove();
      }

      setTimeout(() => {
        this.scene.switch("gameEndeScene");
      }, 3000);

      return;
    }
    this.#handleCursors(this.#player, 450 + (this.#level - 1) * 50);
    this.#showBubbleUpdatePlayer();

  }

  #loadAssets() {
    PLAYERS.forEach((assetPath, idx) => {
      this.load.image(`player-${idx + 1}`, assetPath);
    });
    ENEMIES.forEach((assetPath, idx) => {
      this.load.image(`enemy-${idx + 1}`, assetPath);
    });
    BUBBLES_UPDATE_PLAYER.forEach((assetPath, idx) => {
      this.load.image(`bubbleUpdatePlayer${idx + 2}`, assetPath)
    });
    BULLETS.forEach((assetPath, idx) => {
      this.load.image(`bullet${idx + 1}`, assetPath)
    });

    this.load.image("monster", "assets/images/enemy/monster.png");
    this.load.image("bulletEnemy", "assets/images/enemy/bullet_enemy.png");
    this.load.image("bulletMonster", "assets/images/bullet/bullet_Monster.png");

    this.load.spritesheet(
      "explosion",
      "assets/images/explision/explosion_spritesheet.png",
      {
        frameWidth: 164,
        frameHeight: 164,
      }
    );

    this.load.audio("shootSound", "assets/sounds/shoot.wav");
    this.load.audio("enemydeathSound", "assets/sounds/enemy-death.wav");
    this.load.audio("explosionSound", "assets/sounds/explosion2.mp3");
    this.load.audio("monsterHit", "assets/sounds/explosion.mp3");
    this.load.audio("monsterExplosion", "assets/sounds/bad-explosion.mp3");
    //background
    this.load.image("stars", "assets/images/background/stars.png");
    this.load.image("meteors", "assets/images/background/meteors.png");
    this.load.image('luminary', 'assets/images/background/luminary.png');

  }

  #handleCursors(playerFigur, velocity) {
    if (this.#cursors.left.isDown) {
      playerFigur.setVelocityX(-velocity);
    } else if (this.#cursors.right.isDown) {
      playerFigur.setVelocityX(velocity);
    } else {
      playerFigur.setVelocityX(0);
    }

    if (this.#cursors.up.isDown) {
      playerFigur.setVelocityY(-velocity);
    } else if (this.#cursors.down.isDown) {
      playerFigur.setVelocityY(velocity);
    } else {
      playerFigur.setVelocityY(0);
    }
    if (Phaser.Input.Keyboard.JustDown(this.#spaceClick)) {
      this.#shootBullet();

      this.#sounds.shoot.play();
    }
  }

  #handleTouch() {
    let dragging = false;
    let draggingPosition = { x: 0, y: 0 };
    const VELOCITY_POINTER = 200;

    this.input.on("pointerdown", function (pointer) {
      dragging = true;
      draggingPosition.x = pointer.x;
      draggingPosition.y = pointer.y;
    });

    this.input.on("pointermove", (pointer) => {
      if (!dragging) return;

      const moveX = pointer.x - draggingPosition.x;
      const moveY = pointer.y - draggingPosition.y;

      const velocityX =
        (moveX != 0 ? 1 : 0) * (moveX > 0 ? 1 : -1) * VELOCITY_POINTER;
      const velocityY =
        (moveY != 0 ? 1 : 0) * (moveY > 0 ? 1 : -1) * VELOCITY_POINTER;
      this.#player.setVelocityX(velocityX);
      this.#player.setVelocityY(velocityY);
    });
    this.input.on("pointerup", () => {
      dragging = false;
      this.#player.setVelocity(0);
      this.#shootBullet();
    });
  }

  #addText() {
    this.#scoreText = this.add.text(16, 40, "Score: 0", {
      fontSize: "14px",
      fill: "#fff",
    });

    this.#levelText = this.add.text(16, 16, "Level: 1", {
      fontSize: "14px",
      fill: "#fff",
    });
  }

  #createBackground() {
    const [width, height] = getWindowWidthAndHeight();
    //create stars
    this.#background.stars = this.add
      .tileSprite(0, 0, width, height, "stars")
      .setOrigin(0)
      .setScrollFactor(0.5);
    //create meteors
    this.#background.meteors = this.physics.add
      .sprite(width, 0, 'meteors')
      .setScale(0.3);
    // create meteors groupe
    this.#background.luminaries = this.physics.add.group();
  }
  #createLuminary() {
    const [width, height] = getWindowWidthAndHeight();
    const speed = Phaser.Math.Between(50, 100);
    const direction = Math.random() < 0.5 ? -1 : 1;

    const x = Phaser.Math.Between(0, width);
    this.#background.luminaries
      .create(x, -10, 'luminary')
      .setScale(0.2)
      .setVelocityY(speed)
      .setVelocityX(speed * direction)
      .setAngularVelocity(Phaser.Math.Between(-200, 200));


  }
  #moveMeteors() {
    const [width, height] = getWindowWidthAndHeight();

    this.#background.meteors.x -= 2;
    this.#background.meteors.y += 1;

    if (this.#background.meteors.x < 0 || this.#background.meteors.y > height) {
      this.#background.meteors.x = width;
      this.#background.meteors.y = 0;
    }
  }


  #shootBullet() {
    Bullet.create(this.#bullets, this.#player.x, this.#player.y, 0.9, -1000, `bullet${Math.min(this.#level, 4)}`)
  }

  #createExplosionAnimations() {
    this.anims.create({
      key: "explode",
      frames: this.anims.generateFrameNumbers("explosion", {
        start: 0,
        end: 6,
      }),
      frameRate: 500,
      repeat: 0,
      hideOnComplete: true,
    });
  }

  #playerEnemyCollision(player, enemy) {
    this.#sounds.explosion.play();
    player.disableBody(true, false);
    enemy.disableBody(true, true);
    player.setTint(0xff0000);
    enemy.setTint(0xf11115);
    const explosion = this.add.sprite(player.x, player.y, "explosion");
    explosion.setScale(1);
    explosion.play("explode");
    this.#endGame();
  }
  #playerMonsterCollision(player, monster) {
    if (!this.#monster.visible) {
      return
    }
    this.#sounds.explosion.play();
    player.disableBody(true, false);
    monster.disableBody(true, true);
    player.setTint(0xff0000);
    monster.setTint(0xf11115);
    const explosion = this.add.sprite(player.x, player.y, "explosion");
    explosion.setScale(1);
    explosion.play("explode");
    this.#endGame();
  }
  #endGame() {
    this.#state = "game_over";
    this.#showTextCenter("game Over !");
    this.physics.pause();

    // Stop the ongoing events
    if (this.#createEnemyEvent) {
      this.#createEnemyEvent.remove();
    }

    if (this.#shootBulletEvent) {
      this.#shootBulletEvent.remove();
    }

    setTimeout(() => {
      this.scene.switch("gameEndeScene");
    }, 3000);
  }
  #moveMonsterr() {
    if (this.#monster && (this.#monster.body.blocked.left || this.#monster.body.blocked.right)) {
      this.#monster.setVelocityX(250 * (this.#monster.body.blocked.left ? 1 : -1));
    }
    if (this.#monster && (this.#monster.body.blocked.up || this.#monster.body.blocked.down)) {
      this.#monster.setVelocityY(250 * (this.#monster.body.blocked.left ? 1 : -1));
    }
    if (this.#score === MAX_SCORE - LEVEL_SCORE) {
      if (!this.#monster.visible) {
        this.#monster.visible = true;
        this.#monster.setVelocityY(Phaser.Math.Between(-250, 250));
        this.#monster.setVelocityX(Phaser.Math.Between(-250, 250));
      }

    }
  }
  #moveMonsterrr() {
    if (!this.#monster) {
      return;
    }

    const playerX = this.#player.x;
    const playerY = this.#player.y;
    const monsterX = this.#monster.x;
    const monsterY = this.#monster.y;

    let velocityX = 0;
    let velocityY = 0;

    if (playerX > monsterX) {
      velocityX = 250;
    } else if (playerX < monsterX) {
      velocityX = -250;
    }

    if (playerY > monsterY) {
      velocityY = 250;
    } else if (playerY < monsterY) {
      velocityY = -250;
    }

    if (this.#score >= 0) {
      if (!this.#monster.visible) {
        this.#monster.visible = true;
      }
      this.#monster.setVelocityX(velocityX);
      this.#monster.setVelocityY(velocityY);
    }
    else {
      if (this.#monster.body.blocked.left || this.#monster.body.blocked.right || this.#monster.body.blocked.up || this.#monster.body.blocked.down) {
        this.#monster.setVelocityX(velocityX);
        this.#monster.setVelocityY(velocityY);
      }
    }
  }
  #moveMonster() {
    if (!this.#monster) {
      return;
    }

    const playerX = this.#player.x;
    const playerY = this.#player.y;
    const monsterX = this.#monster.x;
    const monsterY = this.#monster.y;

    let velocityX = 0;
    let velocityY = this.#monster.body.velocity.y;  // Behalten Sie die aktuelle Y-Geschwindigkeit des Monsters bei

    // Das Monster bewegt sich horizontal, um auf der gleichen X-Achsenposition wie der Spieler zu bleiben
    if (playerX > monsterX) {
      velocityX = 200;
    } else if (playerX < monsterX) {
      velocityX = -200;
    }

    // Das Monster bewegt sich vertikal, um einen Mindestabstand vom Spieler zu beibehalten
    const minimumDistance = 200; // Die Mindestdistanz, die das Monster vom Spieler beibehalten soll
    if (monsterY - playerY < minimumDistance) {
      velocityY = -250;
    } else {
      velocityY = 250;
    }

    if (this.#level === 4) {
      if (!this.#monster.visible) {
        this.#monster.visible = true;
      }
      this.#monster.setVelocityX(velocityX);
      this.#monster.setVelocityY(velocityY);
    }
    if (this.#monster.body.blocked.left || this.#monster.body.blocked.right || this.#monster.body.blocked.up || this.#monster.body.blocked.down) {
      this.#monster.setVelocityX(velocityX);
      this.#monster.setVelocityY(velocityY);
    }

  }


  #bulletEnemyCollision(bullet, enemy) {

    bullet.disableBody(true, true);
    enemy.disableBody(true, true);
    this.#sounds.enemyDeath.play();
    const explosion = this.add.sprite(enemy.x, enemy.y, "explosion");
    explosion.setScale(0.5);
    explosion.play("explode");
    this.#increaseScore();
  }
  #bulletMonsterCollision(bullet, monster) {
    if (this.#monster.visible) {
      if (this.#monsterLifeTimeCounter === Monsterlifetime) {
        this.#monster.disableBody(true, true);
      }
      this.#sounds.monsterExplosion.play();
      this.#increaseScore();
      if (this.#monsterLifeTimeCounter < Monsterlifetime) {
        this.#monsterLifeTimeCounter += 1
      }
    }
  }
  #check(bullet, monster) {
    if (this.#monster.visible) {

      this.#sounds.monsterHit.play();
      this.#monster.setTint(0xff00000);
      const explosion = this.add.sprite(this.#monster.x, this.#monster.y, "explosion");
      explosion.play("explode");
      setTimeout(() => {
        this.#monster.clearTint()
      }, 200);
    }
  }

  #increaseScore() {
    this.#score += 1;
    this.#scoreText.setText(`Score: ${this.#score}`);
  }

  #increaseLevel() {
    if (this.#level < 4 && this.#score % LEVEL_SCORE == 0 && this.#score != 0) {
      this.#level += 1;
      this.#levelText.setText(`Level: ${this.#level}`)
    }
  }

  #bulletEnemyplayerCollision(bulletEnemy, player) {
    this.#sounds.explosion.play();
    bulletEnemy.disableBody(true, false);
    player.disableBody(true, true);
    bulletEnemy.setTint(0xff0000);
    const explosion = this.add.sprite(player.x, player.y, "explosion");
    explosion.setScale(0.8);
    explosion.play("explode");
    this.#endGame();
  }

  #playerBubbleCollision(player, bubbleUpdatePlayer) {
    bubbleUpdatePlayer.disableBody(true, true);
    player.disableBody(false, true);

    this.#player = Ship.create(
      this,
      "player-" + (this.#level),
      player.x,
      player.y
    );
    this.#createBubbleUpdatePlayer();
    this.#addColliders();
  }

  #createBubbleUpdatePlayer() {
    this.#bubbleUpdatePlayer = this.physics.add.sprite(-400, 200, "bubbleUpdatePlayer" + (this.#level + 1)).setScale(0.3)
    this.physics.world.enable(this.#bubbleUpdatePlayer);
    this.#bubbleUpdatePlayer.body.setAngularVelocity(125);
    this.#bubbleUpdatePlayer.visible = false;
  }

  #addColliders() {
    this.physics.add.collider(
      this.#player,
      this.#enemies,
      this.#playerEnemyCollision,
      null,
      this
    );
    this.physics.add.collider(
      this.#bullets,
      this.#enemies,
      this.#bulletEnemyCollision,
      null,
      this
    );
    this.physics.add.collider(
      this.#bulletsEnemies,
      this.#player,
      this.#bulletEnemyplayerCollision,
      null,
      this
    );
    this.physics.add.collider(
      this.#player,
      this.#bubbleUpdatePlayer,
      this.#playerBubbleCollision,
      null,
      this
    );
  }
  #addMonsterColliders() {

    this.physics.add.collider(
      this.#player,
      this.#monster,
      this.#playerMonsterCollision,
      null,
      this
    );
    this.physics.add.collider(
      this.#bullets,
      this.#monster,
      this.#bulletMonsterCollision,
      this.#check,
      this
    );
  }

  #createEnemy() {
    Enemy.create(
      this.#enemies,
      0.2 / (this.#level / 4),
      50 * (this.#level / 2 + 1),
      `enemy-${this.#level}`
    );
  }

  #shootBulletFromEnemy() {
    const [_, height] = getWindowWidthAndHeight();
    const randomEnemy = Phaser.Utils.Array.GetRandom(
      this.#enemies.getChildren().filter(e => e.active == true && e.y <= height)
    );
    if (!randomEnemy) {
      return;
    }
    const enemybullet = this.#bulletsEnemies.create(
      randomEnemy.x,
      randomEnemy.y,
      "bulletEnemy"
    );
    enemybullet.setScale(0.3);
    this.#sounds.shoot.play();
    const direction = new Phaser.Math.Vector2(
      this.#player.x - randomEnemy.x,
      this.#player.y - randomEnemy.y
    ).normalize();
    enemybullet.setVelocity(direction.x * 500, direction.y * 500);

    if (this.#monster.visible) {

      const monsterBullet = this.#bulletsEnemies.create(
        this.#monster.x,
        this.#monster.y,
        "bulletMonster"
      );
      monsterBullet.setScale(0.4);
      this.#sounds.shoot.play();
      const direction = new Phaser.Math.Vector2(
        this.#player.x - this.#monster.x,
        this.#player.y - this.#monster.y
      ).normalize();
      monsterBullet.setVelocity(direction.x * 1000, direction.y * 1000);


    }

  }

  #showTextCenter(text) {
    const [windowWidth, windowHeight] = getWindowWidthAndHeight();
    this.add.text(windowWidth / 2, windowHeight / 2, text, {
      fontSize: "64px",
      fill: "#fff",
      align: "center",

    }).setOrigin(0.5, 0.5);

  }

  #showBubbleUpdatePlayer() {
    // Überprüfen, ob das Bubble-Update-Player-Objekt bereits sichtbar ist
    if (this.#bubbleUpdatePlayer.visible) {
      return;
    }

    else if (this.#score % LEVEL_SCORE === 0 && this.#score > 0) {
      // Zufällige Koordinaten generieren
      const [width, height] = getWindowWidthAndHeight();
      var randomX = Phaser.Math.Between(100, width - 100);
      var randomY = Phaser.Math.Between(200, height - 100);

      // Bubble-Update-Player-Objekt an den zufälligen Koordinaten platzieren
      this.#bubbleUpdatePlayer.setPosition(randomX, randomY);
      this.#bubbleUpdatePlayer.visible = true;
      this.#increaseScore();
    } else {
      this.#bubbleUpdatePlayer.visible = false
    }

  }

}
