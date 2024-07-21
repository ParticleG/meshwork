import { ImageSource, SpriteSheet } from 'excalibur';

export interface SkinData {
  src: string;
  column: number;
  count: number;
  edgeLength: number;
}

export interface SkinSpriteSheet {
  source: ImageSource;
  spriteCount: number;
  spriteSheet: SpriteSheet;
}
