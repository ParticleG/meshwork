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
}

export const skinManager = new SkinManager();
