<template>
  <el-container>
    <plum> </plum>
    <el-header><navbar></navbar> </el-header>
    <el-main class="main-container">
    <router-view v-if="isRouterAlive"></router-view>
  </el-main>
    <el-footer class="footer"><htmlFooter></htmlFooter></el-footer>
  </el-container>
</template>
<script setup lang="ts">
import { ref, provide, nextTick } from "vue";
import plum from "./components/bg/plum.vue";
import navbar from "./components/layout/navbar.vue";
import htmlFooter from "./components/layout/footer.vue";
const isRouterAlive = ref(true);
const reload = () => {
  isRouterAlive.value = false;
  void nextTick(() => {
    isRouterAlive.value = true;
  });
};
provide("reload", reload);
</script>

<style scoped>
.el-header {
  padding: 0;
}
.main-container {
  display: flex;
  flex-direction: column;
  padding: 20px;
  min-width: 1190px;
}
.footer {
  color: gray;
  opacity: 0.6;
  display: flex;
  justify-content: center;
}
</style>
