<script setup lang="ts">
import { Color, DisplayMode, Engine, vec } from 'excalibur';
import { onMounted, ref } from 'vue';

import { FrameActor } from 'src/types/container';
import { FaceData, RenderingFaces } from 'types/item/types';
import { FaceGroupActor } from 'types/item';
import { BinaryPosition } from 'types/common';
import { InteractionManager } from 'types/InteractionManager';
import { Player } from 'types/Player';
import { keyHandlers } from 'src/ruleset/stacking/interaction';

const mainGame = ref<HTMLCanvasElement>();

const fieldSize: BinaryPosition = { x: 10, y: 20 };
const scale = ref(100);

const faceGroupActor = new FaceGroupActor(
  [
    new RenderingFaces('crystal', 0, undefined, { x: -1, y: 0 }),
    new RenderingFaces('crystal', 0, undefined, { x: 0, y: 0 }),
    new RenderingFaces('crystal', 0, undefined, { x: 0, y: -1 }),
    new RenderingFaces('crystal', 0, undefined, { x: 1, y: -1 })
  ],
  { x: 1, y: 1 }
);
const field = new FrameActor(fieldSize);
const currentPlayer = new Player();

const randomInsertField = () => {
  const positionedFaces = [];
  for (let i = 0; i < field.fieldSize.y; i++) {
    for (let j = 0; j < field.fieldSize.x; j++) {
      const randomArray = new Uint32Array(2);
      crypto.getRandomValues(randomArray);
      if (Math.floor(randomArray[0] % 16) < 8) {
        continue;
      }
      positionedFaces.push({
        value: new FaceData(
          'crystal',
          Math.floor(randomArray[1] % 16),
          undefined
        ),
        position: { x: j, y: i }
      });
    }
  }
  field.insert(positionedFaces);
};

const clearField = () => {
  const positions = [];
  for (let i = 0; i < field.fieldSize.y; i++) {
    for (let j = 0; j < field.fieldSize.x; j++) {
      positions.push({ x: j, y: i });
    }
  }
  field.extract(positions);
};

const setScales = (value: number | null) => {
  const scale = value ? vec(value / 100, value / 100) : vec(1, 1);
  faceGroupActor.scale = scale;
  field.scale = scale;
};

onMounted(async () => {
  const game = new Engine({
    backgroundColor: Color.Transparent,
    canvasElement: mainGame.value,
    displayMode: DisplayMode.FillContainer,
    enableCanvasTransparency: true,
    fixedUpdateFps: 1000
  });
  const interactionManager = new InteractionManager(currentPlayer, game.input);
  interactionManager.registerKeyHandlers(keyHandlers);

  game.add(field);
  game.add(faceGroupActor);
  game.onFatalException(() => {
    game.stop();
  });
  await game.start();
});
</script>

<template>
  <q-page class="row items-center justify-evenly">
    <div class="col-10 column q-gutter-y-md">
      <q-card style="height: 80vh">
        <canvas ref="mainGame" class="rounded-borders" />
      </q-card>
      <q-slider
        color="green"
        :min="25"
        :step="5"
        :max="100"
        v-model="scale"
        @update:model-value="setScales"
      />
      <q-btn label="insert" @click="randomInsertField" />
      <q-btn label="clear" @click="clearField" />
    </div>
  </q-page>
</template>

<style scoped></style>
