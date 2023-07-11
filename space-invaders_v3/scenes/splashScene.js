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
        // Laden Sie Ihre Bilder und Musik hier

        this.load.image('ship1', 'assets/images/player/level1_player2.png');
        this.load.image('ship2', 'assets/images/player/level2_player3.png');
        this.load.image('ship3', 'assets/images/player/level2_player3.png');
        this.load.audio('backgroundMusic', 'assets/sounds/background1.mp3');
    };

    create() {
        // Hintergrundmusik abspielen
        const music = this.sound.add('backgroundMusic', { loop: true });
        music.play();

        // Text hinzufügen
        this.add.text(CENTER_WIDTH, CENTER_HEIGHT, 'Spaceinvaders', {
            fontSize: '14vmin',
            fontFamily: 'Georgia',
            fill: '#fff',
        }).setOrigin(0.5);

        // Flugzeuge hinzufügen
        const ship1 = this.add.image(CENTER_WIDTH, CENTER_HEIGHT - 150, 'ship1').setScale(1.5);
        const ship2 = this.add.image(width - 200, CENTER_HEIGHT, 'ship2');
        const ship3 = this.add.image(width + 200, CENTER_HEIGHT, 'ship3');
        // Flugzeuge nach oben bewegen
        this.tweens.add({
            targets: [ship1, ship2, ship3],
            y: '-=475',
            duration: 8000,
            ease: 'Linear'
        });

        this.#restart();
    };

    update(time, delta) {

    };


    #restart() {
        // Warte 5 Sekunden, dann wechsle zur MainScene
        this.time.addEvent({
            delay: 8300, // 2000 Millisekunden = 2 Sekunden
            callback: () => { this.scene.switch("mainScene"), this.#shutdown() },
            loop: false // Dieses Event wird nur einmal ausgelöst
        });

    }

    #shutdown() {
        // Bereinigungsaktionen hier durchführen
        // z.B. stoppen Sie alle Töne, entfernen Sie Timer, etc.
        this.sound.stopAll();
    }


}
