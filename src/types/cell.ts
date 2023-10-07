import { Actor, Sprite } from 'excalibur';
import { ActorArgs } from 'excalibur/build/dist/Actor';

export class CellActor extends Actor {
  constructor(sprite: Sprite, configs?: ActorArgs) {
    super({
      ...configs,
      height: sprite.height,
      width: sprite.width,
    });
    this.graphics.use(sprite);
  }

  updateSprite(sprite: Sprite) {
    this.graphics.use(sprite);
  }
}

export type Cell = CellActor | null;
