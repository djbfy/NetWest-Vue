<template>
  <router-view v-if="isRouterAlive"></router-view>
</template>
<script setup lang="ts">
import { ref, provide, nextTick } from "vue";
const isRouterAlive = ref(true);
const reload = () => {
  isRouterAlive.value = false;
  void nextTick(() => {
    isRouterAlive.value = true;
  });
};
provide("reload", reload);
</script>

<style scoped></style>
