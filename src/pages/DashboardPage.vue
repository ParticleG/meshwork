<script setup lang="ts">
import { Color, DisplayMode, Engine } from 'excalibur';
import { onMounted, ref } from 'vue';

import crystalSkinImage from 'assets/skin/crystal.png';
import crystalSkinConfig from 'assets/skin/crystal.json';
import { skinManager } from 'types/SkinManager';
import { FrameActor } from 'src/types/container';
import { FaceData } from 'types/item/types';

const mainGame = ref<HTMLCanvasElement>();

const field = new FrameActor(10, 20);

const randomArray = new Uint32Array(1);
crypto.getRandomValues(randomArray);
skinManager.getSprite('crystal', Math.floor(randomArray[0] % 16));

const fillField = () => {
  for (let i = 0; i < field.column; i++) {
    for (let j = 0; j < field.row; j++) {
      const randomArray = new Uint32Array(1);
      crypto.getRandomValues(randomArray);
      field.insert([
        {
          value: new FaceData(
            'crystal',
            Math.floor(randomArray[0] % 16),
            undefined,
          ),
          position: { x: i, y: j },
        },
      ]);
    }
  }
};

onMounted(async () => {
  const game = new Engine({
    backgroundColor: Color.LightGray,
    canvasElement: mainGame.value,
    displayMode: DisplayMode.FillContainer,
    enableCanvasTransparency: true,
  });
  await skinManager.loadSkin('crystal', {
    src: crystalSkinImage,
    ...crystalSkinConfig,
  });
  game.add(field);
  fillField();
  await game.start();
});
</script>

<template>
  <q-page class="row items-center justify-evenly">
    <q-card class="cursor-none" style="height: 80vh; width: 80vw">
      <canvas ref="mainGame" class="rounded-borders" />
    </q-card>
  </q-page>
</template>

<style scoped></style>
