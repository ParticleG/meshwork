import { Actor, ActorArgs, Vector } from 'excalibur';

import { BinaryPosition } from 'types/common';
import { Face } from 'types/item/types';
import { skinManager } from 'types/SkinManager';

export class FaceActor extends Actor {
  private _face: Face;

  constructor(face: Face, extraArgs?: ActorArgs) {
    const sprite = skinManager.getSprite(face.skin.name, face.skin.index);
    if (!sprite) {
      throw new Error(`Sprite not found: ${face.skin.name}:${face.skin.index}`);
    }
    super({
      ...extraArgs,
      anchor: new Vector(0,0),
      x: face.position.x * sprite.width,
      y: face.position.y * sprite.height,
    });
    this._face = face;

    this.graphics.use(sprite);
  }

  updateSprite(name: string, index: number) {
    const sprite = skinManager.getSprite(name, index);
    if (!sprite) {
      throw new Error(`Sprite not found: ${name}:${index}`);
    }
    this._face.skin.name = name;
    this._face.skin.index = index;

    this.graphics.use(sprite);
  }
}

export interface FacePosition {
  item: Face;
  position: BinaryPosition;
}
