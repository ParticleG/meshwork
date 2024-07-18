import { ImageSource, SpriteSheet } from 'excalibur';

interface SkinData {
  src: string;
  column: number;
  count: number;
  height: number;
  width: number;
}

class SkinSpriteSheet {
  constructor(
    public source: ImageSource,
    public spriteCount: number,
    public spriteSheet: SpriteSheet,
  ) {}
}

class SkinManager {
  private _skinMap = new Map<string, SkinSpriteSheet>();

  async loadSkin(name: string, data: SkinData) {
    const source = new ImageSource(data.src);
    await source.load();

    this._skinMap.set(
      name,
      new SkinSpriteSheet(
        source,
        data.count,
        SpriteSheet.fromImageSource({
          image: source,
          grid: {
            columns: data.column,
            rows: data.count / data.column,
            spriteHeight: data.height,
            spriteWidth: data.width,
          },
        }),
      ),
    );
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
        Math.floor(realIndex / skin.spriteSheet.columns),
      );
    }
  }
}

export const skinManager = new SkinManager();
