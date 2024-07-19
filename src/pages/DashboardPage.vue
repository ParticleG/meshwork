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
  const positionedFaces = [];
  for (let i = 0; i < field.row; i++) {
    for (let j = 0; j < field.column; j++) {
      const randomArray = new Uint32Array(1);
      crypto.getRandomValues(randomArray);
      positionedFaces.push({
        value: new FaceData(
          'crystal',
          Math.floor(randomArray[0] % 16),
          undefined,
        ),
        position: { x: j, y: i },
      });
    }
  }
  field.insert(positionedFaces);
};

const clearField = () => {
  const positions = [];
  for (let i = 0; i < field.row; i++) {
    for (let j = 0; j < field.column; j++) {
      positions.push({ x: j, y: i });
    }
  }
  field.extract(positions);
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
  console.log(field.size);
  await game.start();
});
</script>

<template>
  <q-page class="row items-center justify-evenly">
    <div class="col-10 column">
      <q-card class="cursor-none" style="height: 80vh">
        <canvas ref="mainGame" class="rounded-borders" />
      </q-card>
      <q-btn label="clear" @click="clearField" />
    </div>
  </q-page>
</template>

<style scoped></style>
