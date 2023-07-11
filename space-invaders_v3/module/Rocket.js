import * as Phaser from 'phaser';

export class Rocket {
    static create(player, monster, rockets, x, y, scale, velocity, rocketType) {
        const rocket = rockets.create(x, y, rocketType)
        rocket.setScale(scale);


        const direction = new Phaser.Math.Vector2(
            player.x - monster.x,
            player.y - monster.y
        ).normalize();
        rocket.setVelocity(-direction.x * velocity, -direction.y * velocity);
        return rocket;


    }
}