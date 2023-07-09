import * as Phaser from "phaser";
import { ENEMIES, PLAYERS, BULLETS, BUBBLES_UPDATE_PLAYER, LEVEL_SCORE, MAX_SCORE, Monsterlifetime, Monstershow } from "../utils/constants";
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
  #UpgradebulletPlayer = 1;
  #bulletsEnemies;
  #enemies;
  #monster;
  #monsterLifeTimeCounter = 0;
  #bubbleUpdatePlayer;
  #scoreText;
  #levelText;
  #score = 0;
  #level = 1;
  #monsterLebenText;
  #monsterLeben = Monsterlifetime;
  #showMonstercheck = false;
  #events = {
    createEnemyEvent: null,
    shootBulletEvent: null,
    createLuminaryEvent: null,
  }
  #Colliders = {
    playerEnemiescollision: null,
    playerEnemiesBulletsCollision: null,
    playerMonsterCollision: null,
    playerMonsterBulletsCollision: null,

  }

  constructor() {
    super({
      key: "mainScene",
    });


  }

  init() {

  }

  preload() {
    this.#loadAssets();
    this.#cursors = this.input.keyboard.createCursorKeys();
    this.#spaceClick = this.input.keyboard.addKey("space");
    this.#handleTouch();

    this.#addText_Score_Level_MonsterLeben();

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


    this.#monster = this.physics.add.sprite(-1000, -900, 'monster');
    this.#monster.visible = false;


    this.#createExplosionAnimations();

    this.#addColliders();

    this.#createEvents();


  }
  update() {
    if (this.#state === 'game_over') {
      return;
    }
    this.#increaseLevel();
    this.#background.stars.tilePositionY += this.#level
    this.#moveMeteors();

    this.#showMonster();
    this.#moveMonster();
    this.#endGame();


    this.#handleCursors(this.#player, 450 + (this.#level - 1) * 50);
    this.#show_BubbleUpgradePlayer();
    this.#monsterLebenText.visible = this.#monster.visible;
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
    this.load.audio("monsterHit", "assets/sounds/monsterHit.mp3");
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

  #addText_Score_Level_MonsterLeben() {
    const [width, height] = getWindowWidthAndHeight();


    this.#scoreText = this.add.text(16, 50, "Score: 0", {
      fontSize: "2.5vmin",
      fontFamily: 'Tahoma',
      fill: "#fff",
    });

    this.#levelText = this.add.text(16, 16, "Level: 1", {
      fontSize: "2.5vmin",
      fontFamily: 'Tahoma',
      fill: "#fff",
    });

    this.#monsterLebenText = this.add.text(width - 20, 16, "Monster Leben: 10 ", {
      fontSize: "2.5vmin",
      fontFamily: 'Tahoma',
      fill: "#fff",
    }).setOrigin(1, 0);
    this.#monsterLebenText.visible = false;
  }
  #createEvents() {
    this.#events.createEnemyEvent = this.time.addEvent({
      delay: 2000 / this.#level,
      callback: this.#createEnemy,
      callbackScope: this,
      loop: true
    });

    this.#events.shootBulletEvent = this.time.addEvent({
      delay: 2000 / this.#level,
      callback: this.#shootBulletFromEnemy,
      callbackScope: this,
      loop: true
    });

    this.#events.createLuminaryEvent = this.time.addEvent({
      delay: 10000,
      callback: this.#createLuminary,
      callbackScope: this,
      loop: true
    });
  }
  #addColliders() {
    this.#Colliders.playerEnemiescollision = this.physics.add.collider(
      this.#player,
      this.#enemies,
      this.#playerEnemyCollision,
      () => {
        this.#Colliders.playerEnemiescollision.collided = true;
      },
      this
    );
    this.physics.add.collider(
      this.#bullets,
      this.#enemies,
      this.#bulletEnemyCollision,
      null,
      this
    );
    this.#Colliders.playerEnemiesBulletsCollision = this.physics.add.collider(
      this.#bulletsEnemies,
      this.#player,
      this.#bulletEnemyplayerCollision,
      () => {
        this.#Colliders.playerEnemiesBulletsCollision.collided = true;
      },
      this
    );
    this.physics.add.collider(
      this.#player,
      this.#bubbleUpdatePlayer,
      this.#playerBubbleCollision,
      null,
      this
    );


    this.#Colliders.playerMonsterCollision = this.physics.add.collider(
      this.#player,
      this.#monster,
      this.#playerMonsterCollision,
      () => {
        this.#Colliders.playerEnemiesBulletsCollision.collided = true;
      },
      this
    );
    this.#Colliders.playerMonsterBulletsCollision = this.physics.add.collider(
      this.#bullets,
      this.#monster,
      this.#bulletMonsterCollision,
      this.#check,
      this
    );
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
    Bullet.create(this.#bullets, this.#player.x, this.#player.y, 0.9, -1000, `bullet${Math.min(this.#UpgradebulletPlayer, 4)}`)
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
  }
  #playerMonsterCollision(player, monster) {
    if (!this.#showMonstercheck) {
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
  }
  // ende game handle
  #endGame() {
    this.#gameOverhandle();
    this.#gameWinhandle();
    if (this.#state === 'game_over' || this.#state === "you_Win") {
      this.physics.pause();
      // this.#events.removeAll();
      if (this.#events.createEnemyEvent) {
        this.#events.createEnemyEvent.remove();
      }

      if (this.#events.shootBulletEvent) {
        this.#events.shootBulletEvent.remove();
      }
      if (this.#events.createLuminaryEvent) {
        this.#events.createLuminaryEvent.remove();
      }

      setTimeout(() => {
        this.scene.switch("gameEndeScene");
      }, 4000);
    }



  }
  #gameOverhandle() {
    if ((this.#Colliders.playerEnemiescollision && this.#Colliders.playerEnemiescollision.collided) ||
      (this.#Colliders.playerEnemiesBulletsCollision && this.#Colliders.playerEnemiesBulletsCollision.collided) ||
      (this.#Colliders.playerMonsterCollision && this.#Colliders.playerMonsterCollision.collided) ||
      (this.#Colliders.playerMonsterBulletsCollision && this.#Colliders.playerMonsterBulletsCollision.collided)) {
      this.#state = "game_over";
      this.#showTextCenter("game Over !", '#ff0000');

    }
  }
  #gameWinhandle() {
    if (this.#score >= MAX_SCORE && this.#monsterLifeTimeCounter === Monsterlifetime) {
      this.#state = "you_Win";
      this.#showTextCenter('You Win !\n your score is ' + this.#score, '#fff');

    }
  }
  #moveMonster() {

    /*
        if (this.#monster.body.blocked.left) {
          this.#monster.setVelocityX(velocityX);
        }
        if (this.#monster.body.blocked.right) {
          this.#monster.setVelocityX(-velocityX);
        } if (this.#monster.body.blocked.up) {
          this.#monster.setVelocityY(velocityY);
        } if (this.#monster.body.blocked.down) {
          this.#monster.setVelocityY(-velocityY);
        }
    */

    const [width, height] = getWindowWidthAndHeight();
    if (!this.#showMonstercheck) {
      return;
    }
    this.#monster.setCollideWorldBounds(true);

    var velocityX = 0;
    var velocityY = 0;

    // Das Monster bewegt sich horizontal, wie player
    if (this.#player.x > this.#monster.x) {
      velocityX = 100;
    } else if (this.#player.x < this.#monster.x) {
      velocityX = -100;
    }

    // Wenn der Spieler nach oben geht, folgt das Monster, solange es nicht die Mitte des Bildschirms überschreitet
    if (this.#monster.body.blocked.up) {
      this.#monster.setVelocityY(150);

    } else if (this.#monster.y >= height / 3) {
      // Wenn das Monster die Mitte des Bildschirms überschreitet, geht es nach unten
      this.#monster.setVelocityY(-100);

    } else if (this.#player.y <= this.#monster.y) {
      // Das Monster bewegt sich nicht vertikal, wenn der Spieler nach unten geht
      this.#monster.setVelocityY(0);
    }

    this.#monster.setVelocityX(velocityX);

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
    if (!this.#showMonstercheck) {
      return
    }
    // bullet.disableBody(true.true)
    this.#increaseScore();
    if (this.#monsterLifeTimeCounter == Monsterlifetime) {
      monster.disableBody(true, true);
      this.#sounds.monsterExplosion.play();
    }
  }

  #check(bullet, monster) {
    if (!this.#showMonstercheck) {
      return
    }

    this.#sounds.monsterHit.play();
    const explosion = this.add.sprite(this.#monster.x, this.#monster.y, "explosion");
    explosion.play("explode");
    this.#monster.setTint(0xff00000);
    setTimeout(() => {
      this.#monster.clearTint()
    }, 200);

    if (this.#monsterLifeTimeCounter < Monsterlifetime) {
      this.#monsterLifeTimeCounter += 1;
      this.#monsterlebendecrease();
    }

  }

  /*
  #bulletMonsterCollision(bullet, monster) {
    bullet.disableBody(true, true);

    if (this.#monster.visible) {
      if (this.#monsterLifeTimeCounter === Monsterlifetime) {
        this.#monster.disableBody(true, true);
        this.#Colliders.playerEnemiesBulletsCollision.collided = true;

      }
      this.#sounds.monsterExplosion.play();
      this.#increaseScore();
      if (this.#monsterLifeTimeCounter < Monsterlifetime) {
        this.#monsterLifeTimeCounter += 1
      }
    }
  }
  
  #check(bullet, monster) {
    if (this.#monster.visible && this.#monster.active) {
      this.#sounds.monsterHit.play();
      const explosion = this.add.sprite(this.#monster.x, this.#monster.y, "explosion");
      explosion.play("explode");
      this.#monster.setTint(0xff00000);
      setTimeout(() => {
        this.#monster.clearTint()
      }, 200);
    }
  }
*/


  #bulletEnemyplayerCollision(bulletEnemy, player) {
    this.#sounds.explosion.play();
    bulletEnemy.disableBody(true, false);
    player.disableBody(true, true);
    bulletEnemy.setTint(0xff0000);
    const explosion = this.add.sprite(player.x, player.y, "explosion");
    explosion.setScale(0.8);
    explosion.play("explode");
    // this.#endGame();
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
    this.#UpgradebulletPlayer++

    this.#addColliders();
  }

  #createBubbleUpdatePlayer() {
    this.#bubbleUpdatePlayer = this.physics.add.sprite(-400, 200, "bubbleUpdatePlayer" + (this.#level + 1)).setScale(0.3)
    this.physics.world.enable(this.#bubbleUpdatePlayer);
    this.#bubbleUpdatePlayer.body.setAngularVelocity(125);
    this.#bubbleUpdatePlayer.visible = false;
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
    const enemybullet = this.#bulletsEnemies.create(randomEnemy.x, randomEnemy.y, "bulletEnemy");

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

  #showTextCenter(text, color) {
    const [windowWidth, windowHeight] = getWindowWidthAndHeight();
    this.add.text(windowWidth / 2, windowHeight / 2, text, {
      fontSize: '18vmin',
      fontFamily: 'Georgia',
      fill: color,
      align: "center",

    }).setOrigin(0.5);

  }

  #show_BubbleUpgradePlayer() {
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
  #showMonster() {
    if (this.#level === Monstershow) {
      if (!this.#monster.visible) {
        this.#monster.visible = true;
        this.#showMonstercheck = true;
      }
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
  #monsterlebendecrease() {
    this.#monsterLeben -= 1;
    this.#monsterLebenText.setText(`Monster Leben: ${this.#monsterLeben}`)
  }

  #resetScene() {
    // Zurücksetzen der Variablen auf ihre ursprünglichen Werte
    this.#state = undefined;
    this.#score = 0;
    this.#level = 1;
    this.#monsterLeben = Monsterlifetime;
    this.#UpgradebulletPlayer = 1;
    this.#monsterLifeTimeCounter = 0;

    // Zurücksetzen der Texte
    this.#scoreText.setText('Score: 0');
    this.#levelText.setText('Level: 1');
    this.#monsterLebenText.setText('Monster Leben: 10');

    // Zurücksetzen der Objekte
    this.#player.enableBody(true, this.#player.x, this.#player.y, true, true);
    this.#player.clearTint();
    this.createEnemies();
    this.#enemies.clear(true, true);
    this.#bullets.clear(true, true);
    this.#bulletsEnemies.clear(true, true);

    if (this.#monster.visible) {
      this.#monster.disableBody(true, true);
      this.#monster.visible = false;
      this.#monster.clearTint();
    }

    // Zurücksetzen der Kollisionshandler
    this.#Colliders.playerEnemiescollision.collided = false;
    this.#Colliders.playerEnemiesBulletsCollision.collided = false;
    this.#Colliders.playerMonsterCollision.collided = false;
    this.#Colliders.playerMonsterBulletsCollision.collided = false;

    // Wiederherstellen der Events
    if (this.#events.createEnemyEvent) {
      this.#events.createEnemyEvent.paused = false;
    }
    if (this.#events.shootBulletEvent) {
      this.#events.shootBulletEvent.paused = false;
    }
    if (this.#events.createLuminaryEvent) {
      this.#events.createLuminaryEvent.paused = false;
    }

    // Fortsetzen der Physiksimulation
    this.physics.resume();
  }

}
