<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { bus } from 'boot/bus';

const obsstudio = ref();

declare global {
  // noinspection JSUnusedGlobalSymbols
  interface Window {
    obsstudio?: {
      pluginVersion?: string;
    };
  }
}

onMounted(() => {
  obsstudio.value = window.obsstudio;
});
</script>

<template>
  <q-header v-if="!obsstudio" bordered class="bg-primary text-white">
    <q-toolbar>
      <q-btn
        dense
        flat
        icon="menu"
        round
        @click="bus.emit('drawer', 'toggle', 'left')"
      />
      <q-toolbar-title>
        <q-avatar>
          <q-img src="favicon.ico" />
        </q-avatar>
      </q-toolbar-title>
      <q-btn
        dense
        flat
        icon="menu"
        round
        @click="bus.emit('drawer', 'toggle', 'right')"
      />
    </q-toolbar>
  </q-header>
</template>

<style scoped></style>
