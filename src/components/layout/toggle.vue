<template>
  <div class="but">
    <el-switch v-model="isDark" style="--el-switch-on-color: #4C4D4F; --el-switch-off-color: #e7e7e7">
      <template #active-action>
        <Icon icon="ph:moon"></Icon>
      </template>
      <template #inactive-action>
        <Icon icon="ph:sun" style="color: #242424;"></Icon>
      </template>
    </el-switch>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useDark } from "@vueuse/core";
const isDark = useDark();
</script>

<style scoped>
.but {
  cursor: pointer;
}
</style>
