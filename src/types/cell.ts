import { Actor, Sprite } from 'excalibur';

export class CellActor extends Actor {
  constructor(edgeLength: number) {
    super({
      height: edgeLength,
      width: edgeLength,
    });
  }

  setSprite(sprite: Sprite) {
    this.graphics.use(sprite);
  }
}

export type Cell = CellActor | null;
