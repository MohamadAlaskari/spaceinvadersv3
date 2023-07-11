import * as Phaser from 'phaser';

export class BubbleUpdatePlayer {
    static create(scene, x, y, scale, visible, angularVelocity, bubbleUpdatePlayerType) {
        const bubbleUpdatePlayer = scene.physics.add.sprite(x, y, bubbleUpdatePlayerType);
        bubbleUpdatePlayer.setScale(scale);
        bubbleUpdatePlayer.setVisible(visible);;
        scene.physics.world.enable(bubbleUpdatePlayer);
        bubbleUpdatePlayer.body.setAngularVelocity(angularVelocity);
        return bubbleUpdatePlayer;
    }
}
