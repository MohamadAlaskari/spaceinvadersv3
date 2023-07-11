import * as Phaser from 'phaser';
import { getWindowWidthAndHeight } from '../utils/utils';

export class Enemy {
    static create (enemies, scale, velocity, enemyType) {
        const enemy = enemies.create(Phaser.Math.Between(50, getWindowWidthAndHeight()[0] - 50), -20, enemyType);
        enemy.setScale(scale);
        enemy.setVelocityY(velocity);
        return enemy
        
    }
}