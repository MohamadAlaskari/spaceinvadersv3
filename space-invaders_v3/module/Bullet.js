import * as Phaser from 'phaser';

export class Bullet {
    static create(bullets, x, y, scale, velocity, bulletType) {
        const bullet = bullets.create(x, y, bulletType)
        bullet.setScale(scale);
        bullet.setVelocityY(velocity);
        return bullet;
    }

}