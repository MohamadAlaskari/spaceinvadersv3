import * as Phaser from "phaser";
import { getWindowWidthAndHeight } from "../utils/utils";
import { PLAYERS } from './../utils/constants'

const [width, height] = getWindowWidthAndHeight();
const CENTER_WIDTH = width / 2;
const CENTER_HEIGHT = height / 2;

export class SplashScene extends Phaser.Scene {
    #ships = {
        ship1: null,
        ship2: null,
        ship3: null
    }
    #arr = []
    constructor() {
        super({ key: "splashScene" })
    }
    init() {
        this.cameras.main.setBackgroundColor('#ff000000')
    }

    preload() {
        PLAYERS.forEach((assetPath, idx) => {
            this.load.image(`player-${idx + 1}`, assetPath);
        });

        this.load.audio('backgroundMusic', 'assets/sounds/background1.mp3');
    };

    create() {
        // Hintergrundmusik abspielen
        const backgroundMusic = this.sound.add('backgroundMusic', { loop: true });
        backgroundMusic.play();

        // Text hinzufügen
        this.add.text(CENTER_WIDTH, CENTER_HEIGHT, 'Spaceinvaders', {
            fontSize: '12vmin',
            fontFamily: 'Georgia',
            fill: '#fff',
        }).setOrigin(0.5);

        // Flugzeuge hinzufügen
        this.#createShips()


        this.tweens.add({
            targets: this.#arr,
            y: '-=475',
            duration: 8500,
            ease: 'Linear'
        });

        this.#restart();
    };

    update(time, delta) {

    };


    #restart() {
        this.time.addEvent({
            delay: 8600, // 2000 Millisekunden = 2 Sekunden
            callback: () => { this.scene.switch("mainScene"), this.#shutdown() },
            loop: false // Dieses Event wird nur einmal ausgelöst
        });

    }

    #shutdown() {
        this.sound.stopAll();
    }


    #createShips() {
        if (width < 600) {
            this.#ships.ship1 = this.add.image(CENTER_WIDTH, CENTER_HEIGHT - 190, 'player-2').setScale(1.5);
            this.#arr.push(this.#ships.ship1);
        } else {
            this.#ships.ship1 = this.add.image(CENTER_WIDTH, CENTER_HEIGHT - 190, 'player-2').setScale(1.5);
            this.#ships.ship2 = this.add.image(width - 200, CENTER_HEIGHT, 'player-7');
            this.#ships.ship3 = this.add.image(200, CENTER_HEIGHT, 'player-7');
            this.#arr.push(this.#ships.ship1)
            this.#arr.push(this.#ships.ship2)
            this.#arr.push(this.#ships.ship3)




        }
    }
}
