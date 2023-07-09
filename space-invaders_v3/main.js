import * as Phaser from 'phaser';
import { config } from './utils/config';
import { MainScene } from './scenes/main';
import { SplashScene } from './scenes/splashScene';
import { GameEndeScene } from './scenes/gameEndeScene';




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

  //game start
  game.scene.start('splashScene');
}

document.getElementById('start-game').addEventListener('click', (e) => {
  game();
});