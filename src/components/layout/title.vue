<template>
    <div class="title">
      <span id="focus">{{title}}</span>
    </div>
</template>

<script setup lang='ts'>
import { defineProps } from 'vue';
defineProps({
  title: String 
})
</script>

<style scoped>
@import "./css/title.css";
</style>
