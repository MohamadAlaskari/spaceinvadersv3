import Phaser from 'phaser';

export class EnemyBullet {
    static create(scene, player, enemies) {
        const bulletsEnemies = scene.physics.add.group();
        const randomEnemy = Phaser.Utils.Array.GetRandom(enemies.getChildren());

        let enemyBullet = bulletsEnemies.create(randomEnemy.x, randomEnemy.y, "bulletEnemy")
            .setScale(0.3);

        const direction = new Phaser.Math.Vector2(
            player.x - randomEnemy.x,
            player.y - randomEnemy.y
        ).normalize();

        enemyBullet.setVelocity(direction.x * 500, direction.y * 500);

        return enemyBullet;
    }
}
