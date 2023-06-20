import * as Phaser from "phaser";
import { getWindowWidthAndHeight } from "../utils/utils";

const [width, height] = getWindowWidthAndHeight();
const CENTER_WIDTH = width / 2;
const CENTER_HEIGHT = height / 2 - 100 * 2;
const SCALE = 0.4;
const GRAVITY_Y = 3000;

export class Ship {
  static create(scene, shipType, x = null, y = null) {
    const ship = scene.physics.add.sprite(
      x || CENTER_WIDTH,
      y || CENTER_HEIGHT,
      shipType
    );
    ship.setCollideWorldBounds(true);
    ship.setScale(SCALE);
    ship.body.gravity.y = GRAVITY_Y;
    return ship;
  }
}
