<script setup lang="ts">
import { Color, DisplayMode, Engine } from 'excalibur';
import { onMounted, ref, Ref } from 'vue';

import crystalSkinImage from 'assets/skin/crystal.png';
import crystalSkinConfig from 'assets/skin/crystal.json';
import { skinManager } from 'types/SkinManager';
import { FieldEntity } from 'types/field';
import { Direction } from 'types/field/types';
import { CellActor } from 'types/cell';
import { CellPosition, PositionLink } from 'types/common';

const mainGame: Ref<HTMLCanvasElement | undefined> = ref();
const onResize = (event: ResizeObserverEntry) => {
  console.log(event);
};

const field = new FieldEntity(10, 20, Direction.Down, {
  x: 100,
  y: 100,
});

onMounted(async () => {
  if (!mainGame.value) {
    return;
  }

  const game = new Engine({
    backgroundColor: Color.LightGray,
    canvasElement: mainGame.value,
    displayMode: DisplayMode.FillContainer,
    enableCanvasTransparency: true,
  });

  await skinManager.load('crystal', {
    src: crystalSkinImage,
    ...crystalSkinConfig,
  });

  game.add(field);

  setInterval(() => {
    console.log({
      totalActors: game.currentScene.actors.length,
      fieldChildren: field.children.length,
    });
  }, 1000);

  await game.start();
});

const fillField = () => {
  const cellToSet: CellPosition[] = [];
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 20; j++) {
      const randomArray = new Uint32Array(1);
      crypto.getRandomValues(randomArray);
      cellToSet.push({
        cell: new CellActor(
          skinManager.getSprite('crystal', Math.floor(randomArray[0] % 16))!
        ),
        column: i,
        row: j,
      });
    }
  }
  field.mutateField([], cellToSet, []);
};

const setRandomCells = () => {
  const randomCountArray = new Uint32Array(1);
  crypto.getRandomValues(randomCountArray);

  const cellToSet: CellPosition[] = [];
  for (let i = 0; i < Math.floor(randomCountArray[0] % 10); i++) {
    const randomArray = new Uint32Array(3);
    crypto.getRandomValues(randomArray);
    cellToSet.push({
      cell: new CellActor(
        skinManager.getSprite('crystal', Math.floor(randomArray[0] % 16))!
      ),
      column: Math.floor(randomArray[1] % 10),
      row: Math.floor(randomArray[2] % 20),
    });
  }
  field.mutateField([], cellToSet, []);
};

const moveRandomCells = () => {
  const randomCountArray = new Uint32Array(1);
  crypto.getRandomValues(randomCountArray);

  const cellToMove: PositionLink[] = [];
  for (let i = 0; i < Math.floor(randomCountArray[0] % 10); i++) {
    const randomArray = new Uint32Array(4);
    crypto.getRandomValues(randomArray);
    cellToMove.push({
      from: {
        column: Math.floor(randomArray[0] % 10),
        row: Math.floor(randomArray[1] % 20),
      },
      to: {
        column: Math.floor(randomArray[2] % 10),
        row: Math.floor(randomArray[3] % 20),
      },
    });
  }
  field.mutateField(cellToMove, [], []);
};

const swapRandomCells = () => {
  const randomCountArray = new Uint32Array(1);
  crypto.getRandomValues(randomCountArray);

  const cellToSwap: PositionLink[] = [];
  for (let i = 0; i < Math.floor(randomCountArray[0] % 10); i++) {
    const randomArray = new Uint32Array(4);
    crypto.getRandomValues(randomArray);
    cellToSwap.push({
      from: {
        column: Math.floor(randomArray[0] % 10),
        row: Math.floor(randomArray[1] % 20),
      },
      to: {
        column: Math.floor(randomArray[2] % 10),
        row: Math.floor(randomArray[3] % 20),
      },
    });
  }
  field.mutateField([], [], cellToSwap);
};
</script>

<template>
  <q-page class="row items-center justify-evenly" padding>
    <q-card class="cursor-none full-width" style="height: 80vh">
      <q-resize-observer @resize="onResize" />
      <canvas class="rounded-borders" ref="mainGame" />
    </q-card>
    <q-btn color="primary" label="Fill field" @click="fillField" />
    <q-btn color="secondary" label="Set random cells" @click="setRandomCells" />
    <q-btn color="accent" label="Move random cells" @click="moveRandomCells" />
    <q-btn color="amber" label="Swap random cells" @click="swapRandomCells" />
  </q-page>
</template>

<style scoped></style>
