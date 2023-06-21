import * as Phaser from "phaser";

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

    };
    update(time, delta) {
        if (time >= 200) {
            console.log("splashScene")
            this.scene.switch("mainScene")
        }
    };

}