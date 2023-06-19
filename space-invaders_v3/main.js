import { getWindowWidthAndHeight } from './utils/utils';
import * as Phaser from 'phaser';
import { MainScene } from './scenes/main';
import { TitleScene } from './scenes/titleScene'; 

const gamebtn = document.getElementById('game');
const main = document.getElementById('main');
const backArrow = document.getElementById('backArrow')
const start_game = document.getElementById('start-game')
const nextWindow = document.querySelector('.center');


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
  scene: MainScene

};

class Game extends Phaser.Game {
  constructor(config) {
    super(config);
  }
}


function game(){
  new Game(config);

}

gamebtn.addEventListener('click', (e) => {
  main.style.display = 'none';
  start_game.style.display = 'inline-block';
  backArrow.style.display = 'flex';
  nextWindow.style.display = 'flex';
  
});


document.getElementById('start-game').addEventListener('click', (e) => {
  game();
  start_game.style.display = 'none';
  backArrow.style.display = 'none';
  nextWindow.style.display = 'none';
});


let name = '';
document.getElementById('backArrow').addEventListener('click', (e) => {
  backArrow.style.display = 'none';
  start_game.style.display = 'none';
  main.style.display = 'block';
})

document.getElementById('nameInput').addEventListener('change', (e) => {
  if (e.target.value) {
    document.getElementById('start-game').disabled = false;
    name = e.target.value;
  }
  else {
    document.getElementById('start-game').disabled = true;
  }
})