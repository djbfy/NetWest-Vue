<template>
  <div class="body">
    <Title :title="titleWord"></Title>
    <div class="search">
      <el-button type="info" link @click="dialogVisible = true"
        ><Icon icon="icon-park-outline:upload-picture" width="1.4em" height="1.4em"
      /></el-button>
    </div>
    <div class="image-container">
      <div class="image-item" v-for="(value, key) in images" :key="key">
        <el-image
          style="width: 100%; height: 100%"
          :src="value"
          :zoom-rate="1.2"
          :max-scale="7"
          :min-scale="0.2"
          :preview-src-list="imagesUrls"
          fit="cover"
          lazy
        />
        <div>
          <span>{{ key }}</span> <el-button>download</el-button>
        </div>
      </div>
    </div>
  </div>

  <el-dialog v-model="dialogVisible" title="upload" width="500">
    <el-upload
      class="upload-demo"
      drag
      action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
      multiple
    >
      <Icon icon="icon-park-outline:upload-picture" width="3em" height="3em"></Icon>
      <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
      <template #tip>
        <div class="el-upload__tip">jpg/png files with a size less than 20MB</div>
      </template>
    </el-upload>
  </el-dialog>
</template>

<script setup lang="ts">
import axios from "axios";
import { Icon } from "@iconify/vue";
import { ref, onMounted } from "vue";
import Title from "../layout/title.vue";
const titleWord = ref("PHOTOS");
const images = ref();
const imagesUrls = ref<string[]>([]);
const dialogVisible = ref(false);

function getImagesDir() {
  axios.get("/api/image/bucketObj").then((resp) => {
    const data = resp.data.data as { [key: string]: string };
    images.value = data;
    const urls = Object.values(data);
    imagesUrls.value = urls;
  });
}
onMounted(() => {
  getImagesDir();
});
</script>

<style scoped>
@import "./css/Images.css";
</style>
