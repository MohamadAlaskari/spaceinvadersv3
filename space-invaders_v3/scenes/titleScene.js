import * as Phaser from "phaser";

export class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: "TitleScene" })
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
            console.log("TitleScene")
            this.scene.switch("MainScene")
        }
    };

}