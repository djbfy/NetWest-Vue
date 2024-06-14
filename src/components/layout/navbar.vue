<template>
  <div class="navbar">
    <div class="navbar-wrapper">
      <div class="logo-container">
        <Icon
          icon="fluent-emoji-high-contrast:cat-face"
          width="3em"
          height="3em"
          style="color: #6f6d6d"
        />
      </div>
      <div class="content">
        <div class="links">
          <a href="/" class title="Home"><span>Home</span></a>
          <a href="/Images" class title="Images"><span>Images</span></a>
          <a href="/HtmlApi" class title="ELse"><span>Else</span></a>
          <a class title="Verify" 
            ><Icon
              icon="material-symbols:lock-outline"
              width="1.1em"
              height="1.1em"
              @click="dialogVisible = true"
              v-if="token === null" />
            <Icon icon="ic:round-lock-open" width="1.1em" height="1.1em"  @click="clearToken()" v-else
          /></a>
          <el-dialog v-model="dialogVisible" title="密码验证" width="500">
            <el-input v-model="password" placeholder="请输入密码" show-password @keyup.enter="verify()"></el-input>
            <template #footer>
              <div class="dialog-footer">
                <el-button @click="dialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="verify()" > Confirm </el-button>
              </div>
            </template>
          </el-dialog>
          <span></span>
        </div>
        <toggle />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, onMounted } from "vue";
import { Icon } from "@iconify/vue";
import { ElMessage,ElMessageBox } from "element-plus";
import toggle from "./toggle.vue";
import axios from "axios";

const dialogVisible = ref(false);
const password = ref("");
const reload = inject<Function>("reload")!;

const token = ref();

function verify() {
  if (password.value === "") {
    ElMessage.error("密码为空");
  } else {
    axios.post("/api/user/verify", { pass: password.value }).then((resp) => {
      if (resp.data.code === 200) {
        localStorage.setItem("Authorization", resp.data.data);
        ElMessage.success("欢迎");
        setTimeout(() => {
          reload();
        }, 1000);
      } else {
        ElMessage.error(resp.data.msg);
      }
    });
  }
  dialogVisible.value = false;
}
function clearToken() {
  ElMessageBox.confirm(
    '确定退出吗',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  )
    .then(() => {
      localStorage.removeItem("Authorization")
      setTimeout(() => {
          reload();
        }, 1000);
    })
}
onMounted(() => {
  token.value = localStorage.getItem("Authorization");
});
</script>

<style scoped>
@import "./css/navbar.css";
</style>
