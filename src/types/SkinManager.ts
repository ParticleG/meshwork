import { ImageSource, SpriteSheet } from 'excalibur';

interface SkinData {
  src: string;
  column: number;
  count: number;
  height: number;
  width: number;
}

interface SkinSpriteSheet {
  source: ImageSource;
  spriteCount: number;
  spriteSheet: SpriteSheet;
}

class SkinManager {
  private _skinMap: Map<string, SkinSpriteSheet> = new Map<
    string,
    SkinSpriteSheet
  >();

  async load(name: string, data: SkinData) {
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
          spriteHeight: data.height,
          spriteWidth: data.width,
        },
      }),
    });
  }

  get(name: string) {
    return this._skinMap.get(name);
  }

  getSprite(name: string, index: number) {
    const skin = this.get(name);
    if (skin) {
      const realIndex = index % skin.spriteCount;
      return skin.spriteSheet.getSprite(
        realIndex % skin.spriteSheet.columns,
        Math.floor(realIndex / skin.spriteSheet.columns)
      );
    }
  }
}

export const skinManager = new SkinManager();
