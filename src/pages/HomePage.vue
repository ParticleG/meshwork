<script setup lang="ts">
import {
  Actor,
  Color,
  DisplayMode,
  Engine,
  ImageSource,
  SpriteSheet,
} from 'excalibur';
import { onMounted, ref, Ref } from 'vue';

import crystalSkinImage from 'assets/skin/crystal.png';
import crystalSkinConfig from 'assets/skin/crystal.json';
import { skinManager } from 'types/SkinManager';

const mainGame: Ref<HTMLCanvasElement | undefined> = ref();

skinManager.load('crystal', {
  src: crystalSkinImage,
  ...crystalSkinConfig,
});

const edgeLength = 30;

const cellImageSource = new ImageSource(crystalSkinImage);
cellImageSource.load();

const cellSpriteSheet = SpriteSheet.fromImageSource({
  image: cellImageSource,
  grid: {
    columns: crystalSkinConfig.column,
    rows: crystalSkinConfig.count / crystalSkinConfig.column,
    spriteHeight: crystalSkinConfig.height,
    spriteWidth: crystalSkinConfig.width,
  },
});

cellSpriteSheet.getSprite(0, 0);

const field = new Actor({
  color: Color.Black,
  x: 100,
  y: 100,
});

for (let i = 0; i < 16; i++) {
  for (let j = 0; j < 12; j++) {
    const cell = new Actor({
      height: edgeLength,
      width: edgeLength,
      x: i * edgeLength,
      y: j * edgeLength,
    });
    cell.graphics.use(cellSpriteSheet.getSprite(i % 8, j % 3)!);
    field.addChild(cell);
  }
}

const onResize = (event: ResizeObserverEntry) => {
  console.log(event);
};

onMounted(() => {
  if (!mainGame.value) {
    return;
  }
  const game = new Engine({
    backgroundColor: Color.Gray,
    canvasElement: mainGame.value,
    displayMode: DisplayMode.FillContainer,
    enableCanvasTransparency: true,
  });

  game.add(field);

  game.start();
});
</script>

<template>
  <q-page class="row items-center justify-evenly" padding>
    <q-card class="cursor-none full-width" style="height: 95vh">
      <q-resize-observer @resize="onResize" />
      <canvas class="rounded-borders" ref="mainGame" />
    </q-card>
  </q-page>
</template>

<style scoped></style>
