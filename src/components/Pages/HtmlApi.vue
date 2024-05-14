<template>
  <div class="container">
    <div class="box">
      <el-space direction="vertical">
        <el-text>获取站点数据</el-text>
        <el-row>
          <el-input
            v-model="url"
            style="width: 300px"
            placeholder="输入网址:https://www.example.com"
          ></el-input>
          <el-button type="primary" style="margin-left: 20px" @click="HtmlApi()"
            >获取</el-button
          >
        </el-row>
      </el-space>
    </div>
    <div class="result">
      <el-space direction="vertical">
        <img :src="WebDomain.faviconUrl" style="width: 20px; height: 20px" />
        <el-text>{{ WebDomain.title }}</el-text>
        <el-text>{{ WebDomain.description }}</el-text>
      </el-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import { ref } from "vue";
import { ElLoading,ElMessage } from "element-plus";

const url = ref("");
const getImageUrl = (name: string) => {
  return new URL(`../../assets/${name}`, import.meta.url).href;
};
const WebDomain = ref({
  faviconUrl: getImageUrl("java.png"),
  title: "",
  description: "",
});

function validateURL(url: string): string | null {
  // 定义匹配网站格式的正则表达式
  const regex = /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?$/;

  // 首先验证 URL 格式是否符合要求
  if (regex.test(url)) {
    // 使用正则捕获网站域名部分
    const match = url.match(/(https?:\/\/[^/]+)/);
    if (match) {
      // 返回符合格式要求的网站域名部分
      return match[1];
    } else {
      // 如果无法捕获到域名部分，则返回 null
      console.log("无法捕获到域名部分");
      return null;
    }
  } else {
    // 如果 URL 格式不符合要求，则返回 null
    console.log("URL 格式不符合要求");
    return null;
  }
}

function HtmlApi() {
  if (url.value.length < 1) {
    window.alert("请输入url");
    return;
  }
  if (validateURL(url.value) === null) {
    window.alert("url格式错误");
    return;
  } else {
    console.log(validateURL(url.value));
    url.value = validateURL(url.value)!;
  }

  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.7)",
  });
  axios
    .get("/api/html/favicon", {
      params: {
        url: url.value,
      },
    })
    .then((resp) => {
      console.log(resp.data.data)
      if (resp.data.data === null) {
        ElMessage.warning("未获取到数据")
      } else {
        WebDomain.value = resp.data.data;
      }
      loading.close();
    });
}
</script>

<style scoped>
.container {
  padding: 50px;
  display: flex;
  flex-direction: column;
}
.box {
  display: flex;
  justify-content: center;
}
.result {
  width: auto;
  height: auto;
  margin-top: 50px;
  display: flex;
}
</style>
