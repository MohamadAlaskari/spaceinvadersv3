import * as Phaser from "phaser";
import { config } from '../utils/config';
import { game } from '../main';
import { getWindowWidthAndHeight } from "../utils/utils";

const [width, height] = getWindowWidthAndHeight();
const CENTER_WIDTH = width / 2;
const CENTER_HEIGHT = height / 2;

export class GameEndeScene extends Phaser.Scene {

    #homeButton;
    #Titlefontsize;
    #Homefontsize;


    constructor() {
        super({ key: "gameEndeScene" })
    }
    init() {
        this.cameras.main.setBackgroundColor('#ff000000')
        this.#fontsizeResponsive();
    }
    preload() {

    };
    create() {

        this.add.text(CENTER_WIDTH, CENTER_HEIGHT - 40, 'End of Game', {
            fontSize: this.#Titlefontsize,
            fontFamily: 'Georgia',
            fill: '#fff',
        }).setOrigin(0.5);


        this.#homeButton = this.add.text(CENTER_WIDTH - 20, CENTER_HEIGHT + 100, 'Home', {
            fontSize: this.#Homefontsize,
            fontFamily: 'Tahoma',
            fill: '#fff',
        }).setOrigin(0.5);






        this.#homeButton.setInteractive({ useHandCursor: true });
        this.#homeButton.on('pointerdown', () => location.reload());
    };
    update(time, delta) {

    };


    #fontsizeResponsive() {
        console.log(width)
        width > 500 ? this.#Titlefontsize = "18vmin" : this.#Titlefontsize = "10vmin";
        width > 500 ? this.#Homefontsize = "5vmin" : this.#Homefontsize = "4vmin";
    }
}
