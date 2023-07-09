import * as Phaser from "phaser";
import { config } from '../utils/config';
import { game } from '../main';
import { getWindowWidthAndHeight } from "../utils/utils";

const [width, height] = getWindowWidthAndHeight();
const CENTER_WIDTH = width / 2;
const CENTER_HEIGHT = height / 2;

export class GameEndeScene extends Phaser.Scene {

    #homeButton;
    #replayButton;

    constructor() {
        super({ key: "gameEndeScene" })
    }
    init() {
        console.log("hier ist gameEndeScene ")
        this.cameras.main.setBackgroundColor('#ff000000')
    }
    preload() {

    };
    create() {

        this.add.text(CENTER_WIDTH, CENTER_HEIGHT - 40, 'End of Game', {
            fontSize: '18vmin',
            fontFamily: 'Georgia',
            fill: '#fff',
        }).setOrigin(0.5);


        this.#homeButton = this.add.text(CENTER_WIDTH - 40, CENTER_HEIGHT + 100, 'Home', {
            fontSize: '3vmin',
            fontFamily: 'Tahoma',
            fill: '#fff',
        }).setOrigin(0.5);

        this.#replayButton = this.add.text(CENTER_WIDTH - 40, CENTER_HEIGHT + 160, 'Replay', {
            fontSize: '3vmin',
            fontFamily: 'Tahoma',
            fill: '#fff',
        }).setOrigin(0.5);



        // Button-Callbacks hinzufügen
        this.#replayButton.setInteractive({ useHandCursor: true });
        this.#replayButton.on('pointerdown', () => this.scene.start("splashScene"),/* game()*/);

        this.#homeButton.setInteractive({ useHandCursor: true });
        this.#homeButton.on('pointerdown', () => location.reload());
    };
    update(time, delta) {

    };
}
