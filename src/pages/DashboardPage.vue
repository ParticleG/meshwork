<script setup lang="ts">
import { Color, DisplayMode, Engine } from 'excalibur';
import { onMounted, ref } from 'vue';

import crystalSkinImage from 'assets/skin/crystal.png';
import crystalSkinConfig from 'assets/skin/crystal.json';
import { skinManager } from 'types/SkinManager';
import { FrameActor } from 'src/types/container';
import { FaceActor } from 'types/item';

const mainGame = ref<HTMLCanvasElement>();

const field = new FrameActor(10, 30);

const randomArray = new Uint32Array(1);
crypto.getRandomValues(randomArray);
skinManager.getSprite('crystal', Math.floor(randomArray[0] % 16));

console.log(field);

const fillField = () => {
  for (let i = 0; i < field.column; i++) {
    for (let j = 0; j < field.row; j++) {
      const randomArray = new Uint32Array(1);
      crypto.getRandomValues(randomArray);
      field.mutateField(
        [],
        [
          {
            item: {
              position: { x: i, y: j },
              skin: {
                name: 'crystal',
                index: Math.floor(randomArray[0] % 16),
              },
              data: null,
            },
            position: { x: i, y: j },
          },
        ],
        [],
      );
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
  const faceActor = new FaceActor({
    position: { x: 0, y: 0 },
    skin: {
      name: 'crystal',
      index: 0,
    },
    data: null,
  });
  game.add(faceActor);
  game.add(field);
  fillField();
  setInterval(() => {
    console.log({
      totalActors: game.currentScene.actors.length,
      fieldChildren: field.children.length,
    });
  }, 3000);
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
