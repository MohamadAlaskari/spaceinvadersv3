import * as Phaser from "phaser";
import { ENEMIES, PLAYERS, BULLETS, BUBBLES_UPDATE_PLAYER, LEVEL_SCORE, MAX_SCORE } from "../utils/constants";
import { Ship } from "../module/Ship";
import { Enemy } from "../module/Enemy";
import { Bullet } from "../module/Bullet";


import { getWindowWidthAndHeight } from "../utils/utils";
export class MainScene extends Phaser.Scene {
  #state;
  #player;
  #background;
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
  #bulletTypeCounter = 1
  #enemies;
  #monster;
  #numberOfShoots = 0;
  #hitCount = 0;
  #bubbleUpdatePlayer;
  #scoreText;
  #levelText;
  #score = 0;
  stars;
  #level = 1;
  constructor() {
    super({
      key: "MainScene",
    });
  }
  preload() {
    localStorage.setItem('scores', JSON.stringify([]));
    this.#loadAssets();
    this.#cursors = this.input.keyboard.createCursorKeys();
    this.#spaceClick = this.input.keyboard.addKey("space");
    this.#handleTouch();

    this.#addText();

  }
  create() {

    this.#loadBackground();
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


    this.#bubbleUpdatePlayer = this.physics.add.sprite(400, 200, "bubbleUpdatePlayer2")
    this.#bubbleUpdatePlayer.setScale(0.3)
    this.#bubbleUpdatePlayer.visible = false;

    this.#monster = this.physics.add.sprite(424, 69, 'monster');
    this.#monster.setCollideWorldBounds(true);
    this.#monster.visible = false;

    this.#createAnimations();

    this.#addColliders();
    this.#addMonsterColliders();
    if (this.#state != "game_over") {
      this.time.addEvent({
        delay: 2000 / this.#level,
        callbackScope: this,
        loop: true,
        callback: this.#createEnemy,
      });
      this.time.addEvent({
        delay: 3000 / this.#level,
        loop: true,
        callback: this.#shootBulletFromEnemy,
        callbackScope: this,
      });
    }

  }
  update() {
    this.#background.tilePositionY += this.#bulletTypeCounter
    if (this.#state === 'game_over') {
      return;
    }
    this.#moveMonster();

    if (this.#score >= MAX_SCORE) {
      this.#showTextCenter('You Win !\n your score is ' + this.#score);
      this.physics.pause();
      return;
    }
    this.#handleCursors(this.#player, 450 + (this.#level - 1) * 50);
    this.#showBubbleUpdatePlayer();

    this.tweens.add({
      targets: this.#bubbleUpdatePlayer,
      rotation: Math.PI * 2,
      duration: 3000,
      ease: "Linear",
      repeat: -1, //-1 bedeutet, dass die Animation unendlich oft wiederholt wird.
    });
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
    //this.load.image("bullet", "assets/images/bullet.png");
    this.load.image("bulletEnemy", "assets/images/enemy/bullet_enemy.png");
    this.load.image("bulletMonster", "assets/images/bullet/bulletmm.png");

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
    this.load.image("stars", "assets/images/background/stars.png");
    this.load.image("bg", "assets/images/background/background.png");
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

  #loadBackground() {
    const [width, height] = getWindowWidthAndHeight();

    this.#background = this.add
      .tileSprite(0, 0, width, height, "stars")
      .setOrigin(0)
      .setScrollFactor(0.5);
  }

  #shootBullet() {
    this.#numberOfShoots += 1
    Bullet.create(this.#bullets, this.#player.x, this.#player.y, 0.9, -1000, `bullet${Math.min(this.#bulletTypeCounter, 4)}`)

  }

  #createAnimations() {
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
  #playerMonsterCollison(player, monster) {
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
    setTimeout(() => {
      location.reload();
    }, 2000)
  }
  #moveMonster() {
    if (this.#monster && (this.#monster.body.blocked.left || this.#monster.body.blocked.right)) {
      this.#monster.setVelocityX(250 * (this.#monster.body.blocked.left ? 1 : -1));
    }
    if (this.#monster && (this.#monster.body.blocked.up || this.#monster.body.blocked.down)) {
      this.#monster.setVelocityY(250 * (this.#monster.body.blocked.left ? 1 : -1));
    }
    if (this.#score === MAX_SCORE - 15) {
      if (!this.#monster.visible) {
        this.#monster.visible = true;
        this.#monster.setVelocityY(Phaser.Math.Between(-250, 250));
        this.#monster.setVelocityX(Phaser.Math.Between(-250, 250));
      }

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
    bullet.disableBody(true, true);
    this.#monster.disableBody(true, true);

    this.#sounds.monsterExplosion.play();
    this.#score += 5;
    this.#scoreText.setText(`Score: ${this.#score}`)
  }

  #increaseScore() {
    this.#score += 1;
    this.#scoreText.setText(`Score: ${this.#score}`);
  }

  #increaseLevel() {
    this.#level += 1;
    this.#levelText.setText(`Level: ${this.#level}`)
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
    this.#bubbleUpdatePlayer = this.physics.add.sprite(
      400,
      200,
      "bubbleUpdatePlayer" + (this.#level + 1)
    );
    this.#bubbleUpdatePlayer.setScale(0.3);
    this.#bubbleUpdatePlayer.visible = false;
    this.#addColliders();
    this.#bulletTypeCounter += 1
  }
  #check(bullet, monster) {
    this.#hitCount++;
    this.#sounds.monsterHit.play();
    this.#monster.setTint(0xff00000);
    setTimeout(() => {
      this.#monster.clearTint()
    }, 200);


    return this.#hitCount / 5 >= 10;
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
      this.#playerMonsterCollison,
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
      0.2 / (this.#level / 3),
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
      monsterBullet.setScale(0.5);
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

    if (this.#score % LEVEL_SCORE === 0 && this.#score > 0) {
      // Zufällige Koordinaten generieren
      const [width, height] = getWindowWidthAndHeight();
      var randomX = Phaser.Math.Between(100, width - 100);
      var randomY = Phaser.Math.Between(100, height - 100);

      // Bubble-Update-Player-Objekt an den zufälligen Koordinaten platzieren
      this.#bubbleUpdatePlayer.setPosition(randomX, randomY);
      this.#bubbleUpdatePlayer.visible = true;
      this.#increaseLevel();
      this.#increaseScore();
    } else {
      this.#bubbleUpdatePlayer.visible = false
    }
    //this.cameras.main.startFollow(this.#player)
  }

}
