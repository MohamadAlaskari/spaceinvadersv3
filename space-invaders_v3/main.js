import { getWindowWidthAndHeight } from './utils/utils';
import * as Phaser from 'phaser';
import { MainScene } from './scenes/main';
import { SplashScene } from './scenes/splashScene';
import { GameEndeScene } from './scenes/gameEndeScene';


const [width, height] = getWindowWidthAndHeight();

const config = {
  type: Phaser.AUTO,
  width,
  height,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
    },
  },
  backgroundColor: 0x000000,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: {}

};

class Game extends Phaser.Game {
  constructor(config) {
    super(config);
  }
}


function game() {
  var game = new Game(config);
  game.scene.add('splashScene', SplashScene);
  game.scene.add('mainScene', MainScene);
  game.scene.add('gameEndeScene', GameEndeScene);


  game.scene.start('splashScene');
}

document.getElementById('start-game').addEventListener('click', (e) => {
  game();
});