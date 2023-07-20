import * as Phaser from 'phaser';
import { config } from './utils/config';
import { SplashScene } from './scenes/splashScene';
import { GameInfoScene } from './scenes/gameInfoScene';

import { GameScene } from './scenes/gameScene';
import { GameEndeScene } from './scenes/gameEndeScene';





class Game extends Phaser.Game {
  constructor(config) {
    super(config);
  }
}


export function game() {
  var game = new Game(config);
  game.scene.add('splashScene', SplashScene);
  game.scene.add('gameInfoScene', GameInfoScene);
  game.scene.add('gameScene', GameScene);
  game.scene.add('gameEndeScene', GameEndeScene);

  //game start
  game.scene.start('gameInfoScene');
}

document.getElementById('start-game').addEventListener('click', (e) => {
  game();
});