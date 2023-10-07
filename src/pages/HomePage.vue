<script setup lang="ts">
import { Actor, Color, DisplayMode, Engine } from 'excalibur';
import { onMounted, ref, Ref } from 'vue';

import crystalSkinImage from 'assets/skin/crystal.png';
import crystalSkinConfig from 'assets/skin/crystal.json';
import { skinManager } from 'types/SkinManager';
import { FieldEntity } from 'types/field';
import { Direction } from 'types/field/types';
import { CellActor } from 'types/cell';

const mainGame: Ref<HTMLCanvasElement | undefined> = ref();
const onResize = (event: ResizeObserverEntry) => {
  console.log(event);
};

onMounted(async () => {
  if (!mainGame.value) {
    return;
  }

  const game = new Engine({
    backgroundColor: Color.Gray,
    canvasElement: mainGame.value,
    displayMode: DisplayMode.FillContainer,
    enableCanvasTransparency: true,
  });

  const field = new FieldEntity(10, 20, Direction.Down, {
    x: 100,
    y: 100,
  });

  await skinManager.load('crystal', {
    src: crystalSkinImage,
    ...crystalSkinConfig,
  });

  field.mutateField(
    [],
    [
      {
        cell: new CellActor(skinManager.getSprite('crystal', 0)!),
        column: 0,
        row: 0,
      },
    ],
    []
  );

  game.add(field);

  await game.start();
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
