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
            fontSize: '92px',
            fill: '#fff',
        }).setOrigin(0.5);

        // Buttons hinzufügen
        let titleButton = this.add.text(CENTER_WIDTH, CENTER_HEIGHT + 125, 'Replay', {
            fontSize: '24px',
            fill: '#fff',
        }).setOrigin(0.5);

        let reloadButton = this.add.text(CENTER_WIDTH, CENTER_HEIGHT + 75, 'Home', {
            fontSize: '24px',
            fill: '#fff'
        }).setOrigin(0.5);

        // Button-Callbacks hinzufügen
        titleButton.setInteractive({ useHandCursor: true });
        titleButton.on('pointerdown', () => this.scene.switch("splashScene"));

        reloadButton.setInteractive({ useHandCursor: true });
        reloadButton.on('pointerdown', () => location.reload());
    };
    update(time, delta) {

    };
}
