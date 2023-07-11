import * as Phaser from 'phaser';

export class BubbleRocket {
    static create(scene, x, y, scale, visible, angularVelocity, bubbleRocketType) {
        const bubbleRocket = scene.physics.add.sprite(x, y, bubbleRocketType);
        bubbleRocket.setScale(scale);
        bubbleRocket.setVisible(visible);;
        scene.physics.world.enable(bubbleRocket);
        bubbleRocket.body.setAngularVelocity(angularVelocity);
        return bubbleRocket;
    }
}
