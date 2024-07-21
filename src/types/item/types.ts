import { Sprite } from 'excalibur';

import { BinaryPosition, TernaryPosition } from 'types/common';
import { skinManager } from 'types/SkinManager';

export interface Cell {
  position: TernaryPosition;
  texture: { sprite: Sprite; index: number }[];
}

export class FaceData<T = undefined> {
  sprite: Sprite;
  data: T;

  constructor(skinName: string, skinIndex: number, data: T) {
    const sprite = skinManager.getSprite(skinName, skinIndex);
    if (!sprite) {
      throw new Error('Failed to load sprite');
    }
    this.sprite = sprite;
    this.data = data;
  }

  get height() {
    return this.sprite.height;
  }

  get width() {
    return this.sprite.width;
  }
}

export class RenderingFaces<T = undefined> extends FaceData<T> {
  position: BinaryPosition;

  constructor(
    skinName: string,
    skinIndex: number,
    data: T,
    position: BinaryPosition,
  ) {
    super(skinName, skinIndex, data);
    this.position = position;
  }

  get renderPosition() {
    return {
      x: this.position.x * this.width,
      y: this.position.y * this.height,
    };
  }
}
