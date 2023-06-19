import * as Phaser from "phaser";

export class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: "TitleScene" })
    }
    init() { }
    preload() { };
    create() { };
    update() {
        this.scene.switch("MainScene")
    };

}