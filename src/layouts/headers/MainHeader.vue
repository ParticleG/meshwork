<script setup lang="ts">
import { bus } from 'boot/bus';

</script>

<template>
  <q-header bordered class="bg-primary text-white">
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
