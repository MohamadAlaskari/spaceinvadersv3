import * as Phaser from 'phaser';
import { getWindowWidthAndHeight } from './utils';

const [width, height] = getWindowWidthAndHeight();

export const config = {
    type: Phaser.AUTO,
    width,
    height,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 },
        },
    },
    backgroundColor: 0x000000,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: {}

};