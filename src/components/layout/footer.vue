<template>
  <div class="u">
    <div class="u1">
      <p>
        <span>Copyright © 2024 </span>
        <a href="https://beian.miit.gov.cn/"> 京ICP备2024067572号 </a>
      </p>
    </div>
    <div class="u2">
      <p>Contact me <el-link :underline="false" href="https://www.github.com/djbfy"> <Icon icon="simple-icons:github" /></el-link></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
</script>

<style scoped>
.u {
  display: flex;
  font-size: 13px;
  flex-direction: column;
  align-items: center;
}
.u1 {
  display: flex;
  height: 30px;
}
.u2 {
  display: flex;
  height: 20px;
}
a {
  text-decoration: none;
}
a:hover {
  color: gray;
}
a:visited {
  color: gray;
}
</style>
