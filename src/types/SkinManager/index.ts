import { ImageSource, SpriteSheet } from 'excalibur';

import { EDGE_LENGTH } from 'constants/common';
import { SkinData, SkinSpriteSheet } from 'types/SkinManager/types';

class SkinManager {
  private _skinMap = new Map<string, SkinSpriteSheet>();

  async loadSkin(name: string, data: SkinData) {
    const source = new ImageSource(data.src);
    await source.load();

    this._skinMap.set(name, {
      source,
      spriteCount: data.count,
      spriteSheet: SpriteSheet.fromImageSource({
        image: source,
        grid: {
          columns: data.column,
          rows: data.count / data.column,
          spriteHeight: data.edgeLength,
          spriteWidth: data.edgeLength,
        },
      }),
    });
  }

  getSprite(name: string, index: number) {
    const skin = this._skinMap.get(name);
    if (skin) {
      const realIndex = index % skin.spriteCount;
      return skin.spriteSheet.getSprite(
        realIndex % skin.spriteSheet.columns,
        Math.floor(realIndex / skin.spriteSheet.columns),
        { height: EDGE_LENGTH, width: EDGE_LENGTH },
      );
    }
  }
}

export const skinManager = new SkinManager();
