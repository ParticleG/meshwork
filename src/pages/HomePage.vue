<script setup lang="ts">
import { Actor, Color, DisplayMode, Engine, vec } from 'excalibur';
import { onMounted, ref, Ref } from 'vue';

const mainGame: Ref<HTMLCanvasElement | undefined> = ref();

const edgeLength = 50;

const field = new Actor({
  color: Color.Black,
  x: 100,
  y: 100,
});

for (let i = 0; i < 10; i++) {
  for (let j = 0; j < 10; j++) {
    field.addChild(
      new Actor({
        color: Color.fromHSL(i / 10, j / 10, 0.4),
        height: edgeLength,
        width: edgeLength,
        x: i * edgeLength,
        y: j * edgeLength,
      })
    );
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

  game.input.pointers.primary.on('move', (event) => {
    const ratio = event.pagePos.y / (game.canvasHeight / 2);
    field.scale = vec(ratio, ratio);
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
