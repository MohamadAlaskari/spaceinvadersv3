import * as Phaser from "phaser";
import { getWindowWidthAndHeight } from "../utils/utils";

const [width, height] = getWindowWidthAndHeight();
const CENTER_WIDTH = width / 2;
const CENTER_HEIGHT = height / 2;

export class GameEndeScene extends Phaser.Scene {
    constructor() {
        super({ key: "gameEndeScene" })
    }
    init() {
        console.log("hier ist gameEndeScene ")
        this.cameras.main.setBackgroundColor('#ff000000')
    }
    preload() {
        // Wenn Sie einen Button als Bild haben
        // this.load.image('button', 'path/to/button.png');
    };
    create() {
        // Text hinzufügen
        this.add.text(CENTER_WIDTH, CENTER_HEIGHT - 40, 'End of Game', {
            fontSize: '18vmin',
            fontFamily: 'Georgia',
            fill: '#fff',
        }).setOrigin(0.5);

        // Buttons hinzufügen
        let homeButton = this.add.text(CENTER_WIDTH, CENTER_HEIGHT + 100, 'Home', {
            fontSize: '3vmin',
            fontFamily: 'Tahoma',
            fill: '#fff',
        }).setOrigin(0.5);

        let replayButton = this.add.text(CENTER_WIDTH, CENTER_HEIGHT + 160, 'Replay', {
            fontSize: '3vmin',
            fontFamily: 'Tahoma',
            fill: '#fff',
        }).setOrigin(0.5);



        // Button-Callbacks hinzufügen
        replayButton.setInteractive({ useHandCursor: true });
        replayButton.on('pointerdown', () => this.scene.start("splashScene"));

        homeButton.setInteractive({ useHandCursor: true });
        homeButton.on('pointerdown', () => location.reload());
    };
    update(time, delta) {

    };
}
