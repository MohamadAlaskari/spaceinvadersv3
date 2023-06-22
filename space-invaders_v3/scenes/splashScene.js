import * as Phaser from "phaser";
import { getWindowWidthAndHeight } from "../utils/utils";

const [width, height] = getWindowWidthAndHeight();
const CENTER_WIDTH = width / 2;
const CENTER_HEIGHT = height / 2;

export class SplashScene extends Phaser.Scene {
    constructor() {
        super({ key: "splashScene" })

    }
    init() {
        this.cameras.main.setBackgroundColor('#ff000000')


    }
    preload() {

    };
    create() {
        // Text hinzufügen
        this.add.text(CENTER_WIDTH, CENTER_HEIGHT, 'Spaceinvaders', {
            fontSize: '82px',
            fill: '#fff',
        }).setOrigin(0.5);


        this.#restart();


    };
    update(time, delta) {

    };


    #restart() {
        // Warte 5 Sekunden, dann wechsle zur MainScene
        this.time.addEvent({
            delay: 2000, // 5000 Millisekunden = 5 Sekunden
            callback: () => { this.scene.switch("mainScene") },
            loop: false // Dieses Event wird nur einmal ausgelöst
        });
    }

}