import * as Phaser from "phaser";
import { getWindowWidthAndHeight } from "../utils/utils";
import { ENEMIES, PLAYERS, BULLETS, BUBBLES_UPDATE_PLAYER, LEVEL_SCORE, MAX_SCORE, MAX_LEVEL, MONSTER_LIFE_TIME, MONSTER_SHOW } from "../utils/constants";

const [width, height] = getWindowWidthAndHeight();
const CENTER_WIDTH = width / 2;
const CENTER_HEIGHT = height / 2;

export class GameInfoScene extends Phaser.Scene {
    #infoText;
    #playButton;
    #Titlefontsize;
    #Infofontsize;
    #bulletImage;
    #rocketImage;
    #titleText;
    #backgroundSound;

    constructor() {
        super({ key: "gameInfoScene" });
    }

    init() {
        this.cameras.main.setBackgroundColor("#000000");
        this.#fontsizeResponsive();
    }

    preload() {
        this.load.audio("backgroundSound", "assets/sounds/background1.mp3");
    }

    create() {
        this.#createTitle();
        this.#createInfoText();
        this.#createPlayButton();
        this.#playBackgroundSound();
    }

    update(time, delta) { }

    #fontsizeResponsive() {
        width > 500
            ? (this.#Titlefontsize = "10vmin")
            : (this.#Titlefontsize = "9vmin");
        this.#Infofontsize = "3vmin";
    }

    #createTitle() {
        this.#titleText = this.add.text(CENTER_WIDTH, 40, "Game Information", {
            fontSize: this.#Titlefontsize,
            fontFamily: "Georgia",
            fill: "#fff",
            align: "center",
        }).setOrigin(0.5);
    }

    #createInfoText() {

        this.#infoText = this.add.text(
            CENTER_WIDTH,
            CENTER_HEIGHT-10,
            `How to Win:\n- Achieve a score of ${MAX_SCORE} points and defeat the monster\n\nHow to Lose:\n- Collide with enemies or their bullets\n- Collide with the monster\n\nPlayer Controls:\n- Use the arrow keys or drag the player to move\n- Press the spacebar to shoot bullets\n- Press 'R' to shoot rockets (if available)\n\nLevel System:\n- There are a total of ${MAX_LEVEL} levels\n- Each level increases the difficulty and enemy spawn rate\n- Each level can be completed by reaching a score of at least ${LEVEL_SCORE}\n\nPlayer Upgrade:\n- Collect the bubbles to upgrade the player's abilities\n- Collect the rocket bubble in the last level (${MAX_LEVEL}) to upgrade the player's abilities with rockets`,
            {
                fontSize: this.#Infofontsize,
                fontFamily: "Georgia",
                fill: "#fff",
                 align: "center",
            }
        ).setOrigin(0.5);
    }


    #createPlayButton() {
        this.#playButton = this.add.text(CENTER_WIDTH, height - 60, "| Play |", {
            fontSize: this.#Titlefontsize,
            fontFamily: "Impact",
            fill: "#ff0000",
            align: "center",
        }).setOrigin(0.5);

        this.#playButton.setInteractive({ useHandCursor: true });
        this.#playButton.on("pointerdown", () => {
            this.scene.switch("splashScene");
            this.#shutdown();
        });
    }

    #playBackgroundSound() {
        this.#backgroundSound = this.sound.add("backgroundSound", { loop: true });
        this.#backgroundSound.play();
    }
    #shutdown() {
        this.sound.stopAll();
    }
}
