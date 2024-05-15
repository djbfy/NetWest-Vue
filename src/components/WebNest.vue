<template>
  <div>
    <plum> </plum>
    <el-container>
      <el-header><navbar></navbar> </el-header>
      <el-main class="main-container">
        <div class="title">
          <span id="focus">WEBNEST</span>
        </div>
        <div class="tag-search">
          <div class="cate">
            <ul>
              <li><el-link :underline="false" @click="getAllItems()">ALL</el-link></li>
              <li v-for="(item, index) in tags" :key="index">
                <el-link :underline="false" @click="getItemByTag(item.type)">{{
                  item.type
                }}</el-link>
              </li>
              <li v-if="operation">
                <el-popover placement="right" :width="100" trigger="hover">
                  <template #reference>
                    <el-link :underline="false"
                      ><Icon icon="ic:baseline-add" width="1.1em" height="1.1em"
                    /></el-link>
                  </template>
                  <el-input
                    v-model="tag.type"
                    placeholder="tag name"
                    style="width: 100px"
                  ></el-input>
                  <el-link
                    :underline="false"
                    style="margin-left: 3px"
                    @click="insertTag()"
                    ><Icon icon="fluent:checkmark-12-filled"
                  /></el-link>
                </el-popover>
              </li>
            </ul>
          </div>
          <div class="search">
            <el-input placeholder="search" v-model="key" @keyup.enter="getItemByKey(key)">
              <template #prepend>
                <Icon
                  icon="material-symbols:search"
                  width="1.2rem"
                  height="1.2rem"
                /> </template
            ></el-input>
            <el-button
              type="info"
              link
              v-if="operation"
              @click="dialogInsertFormVisible = true"
              ><Icon icon="gridicons:add-outline" width="1.4em" height="1.4em"
            /></el-button>
            <el-button type="info" link
              ><Icon
                icon="ph:scissors-bold"
                width="1.4em"
                height="1.4em"
                v-if="operation"
                @click="openDelConfirms(ids)"
            /></el-button>
          </div>
        </div>
        <div class="data">
          <el-table
            :data="tableData"
            stripe
            style="width: 100%"
            empty-text="No Data"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" v-if="operation" />
            <el-table-column width="50" prop="faviconUrl">
              <template #default="scope">
                <img
                  :src="scope.row.favicon"
                  v-if="scope.row.ghm === 0"
                  style="width: 20px; height: 20px"
                />
                <img
                  :src="getImageUrl(scope.row.favicon)"
                  v-else
                  style="width: 20px; height: 20px"
                />
              </template>
            </el-table-column>
            <el-table-column prop="title" width="160" show-overflow-tooltip />
            <el-table-column prop="url" width="250" show-overflow-tooltip >
              <template #default="scope">
                <a :href="scope.row.url" target="_blank" class="tableStyle">
                  {{ scope.row.url }}
                </a>
              </template>
            </el-table-column>
            <el-table-column prop="description" width="300" show-overflow-tooltip />
            <el-table-column
              prop="tag"
              width="100"
              :filters="filterItem"
              :filter-method="filterTag"
              filter-placement="bottom-end"
            >
              <template #default="scope">
                <el-tag type="info" disable-transitions>{{ scope.row.tag }}</el-tag>
              </template>
            </el-table-column>

            <el-table-column fixed="right" width="150">
              <template #default="scope">
                <el-button
                  link
                  type="danger"
                  v-if="operation"
                  @click="openDelConfirm(scope.row.id)"
                  >del</el-button
                >
                <el-button
                  link
                  type="primary"
                  v-if="operation"
                  @click="openUpdateDiag(scope.row)"
                  >update</el-button
                >
                <el-button link type="primary" @click="updateStatus(scope.row)"
                  ><Icon
                    icon="ph:star"
                    width="1.2rem"
                    color="gray"
                    height="1.2rem"
                    v-if="scope.row.status === 0"
                  ></Icon>
                  <Icon
                    icon="ph:star-fill"
                    style="color: #e5cb48"
                    width="1.2rem"
                    height="1.2rem"
                    v-if="scope.row.status === 1"
                  ></Icon
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-main>
      <el-footer class="footer"><htmlFooter></htmlFooter></el-footer>
    </el-container>
  </div>

  <!-- insert表单 -->
  <el-dialog v-model="dialogInsertFormVisible" title="新增" width="450" @close="close">
    <el-form :model="webNest" label-width="auto" label-position="left">
      <el-form-item
        label="Title"
        prop="title"
        :rules="[
          {
            required: true,
            message: 'Please input TITLE',
            trigger: 'blur',
          },
        ]"
        :label-width="formLabelWidth"
      >
        <el-input
          v-model="webNest.title"
          autocomplete="off"
          style="width: 150px"
          placeholder="标题"
        />
      </el-form-item>
      <el-form-item
        label="Url"
        prop="url"
        :rules="[
          {
            required: true,
            message: 'Please input URL',
            trigger: 'blur',
          },
        ]"
        :label-width="formLabelWidth"
      >
        <el-input
          v-model="webNest.url"
          autocomplete="off"
          style="width: 250px"
          placeholder="URL"
        />
      </el-form-item>
      <el-form-item prop="description" label="描述" :label-width="formLabelWidth">
        <el-input
          v-model="webNest.description"
          autocomplete="off"
          type="textarea"
          style="width: 250px"
          placeholder="描述"
        />
      </el-form-item>
      <el-form-item prop="tag" label="Tag" :label-width="formLabelWidth">
        <el-select
          v-model="webNest.tag"
          placeholder="Select"
          size="small"
          style="width: 100px"
        >
          <el-option
            v-for="item in tags"
            :key="item.type"
            :label="item.type"
            :value="item.type"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="status" label="状态" :label-width="formLabelWidth">
        <el-radio v-model="webNest.status" :value="0" label="禁用"></el-radio>
        <el-radio v-model="webNest.status" :value="1" label="收藏"></el-radio>
      </el-form-item>
      <el-form-item label="站点Icon" :label-width="formLabelWidth">
        <el-checkbox v-model="checkFav"></el-checkbox>
      </el-form-item>
      <el-form-item
        prop="favicon "
        label="Icon"
        v-if="checkFav"
        :label-width="formLabelWidth"
      >
        <el-select
          v-model="webNest.favicon"
          placeholder="Icon"
          size="small"
          style="width: 100px"
        >
          <el-option
            v-for="item in iconList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogInsertFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="insertForm()"> Confirm </el-button>
      </div>
    </template>
  </el-dialog>
  <!-- insertForm end -->

  <!-- updateForm  -->
  <el-dialog v-model="dialogUpdateFormVisible" title="修改" width="400" @close="close">
    <el-form :model="webNest" label-position="left">
      <el-form-item prop="title" label="Title" :label-width="formLabelWidth">
        <el-input
          v-model="webNest.title"
          autocomplete="off"
          style="width: 150px"
          placeholder="标题"
        />
      </el-form-item>
      <el-form-item prop="url" label="Url" :label-width="formLabelWidth">
        <el-input
          v-model="webNest.url"
          autocomplete="off"
          style="width: 250px"
          placeholder="URL"
        />
      </el-form-item>
      <el-form-item prop="description" label="描述" :label-width="formLabelWidth">
        <el-input
          v-model="webNest.description"
          autocomplete="off"
          type="textarea"
          style="width: 250px"
          placeholder="描述"
        />
      </el-form-item>
      <el-form-item prop="tag" label="Tag" :label-width="formLabelWidth">
        <el-select
          v-model="webNest.tag"
          placeholder="Select"
          size="small"
          style="width: 100px"
        >
          <el-option
            v-for="item in tags"
            :key="item.type"
            :label="item.type"
            :value="item.type"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="status" label="Status" :label-width="formLabelWidth">
        <el-radio v-model="webNest.status" :value="0" label="禁用"></el-radio>
        <el-radio v-model="webNest.status" :value="1" label="收藏"></el-radio>
      </el-form-item>
      <el-form-item label="站点Icon" :label-width="formLabelWidth">
        <el-checkbox v-model="checkFav"></el-checkbox>
      </el-form-item>
      <el-form-item
        prop="favicon"
        label="Icon"
        v-if="checkFav"
        :label-width="formLabelWidth"
      >
        <el-select
          v-model="webNest.favicon"
          placeholder="Icon"
          size="small"
          style="width: 100px"
        >
          <el-option
            v-for="item in iconList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogUpdateFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="updateForm()"> Confirm </el-button>
      </div>
    </template>
  </el-dialog>
  <!-- udateForm end -->
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { ref, onMounted, inject } from "vue";
import navbar from "../components/layout/navbar.vue";
import plum from "../components/bg/plum.vue";
import htmlFooter from "../components/layout/footer.vue";
import axios from "axios";
import { ElMessage, ElMessageBox } from "element-plus";

//页面刷新
const reload = inject<Function>("reload")!;
const refresh = () => {
  setTimeout(() => {
    reload();
  }, 1000);
};
//token
const headerToken = ref();
//权限
const operation = ref(false);

const dialogInsertFormVisible = ref(false);
const dialogUpdateFormVisible = ref(false);

//表单label宽度
const formLabelWidth = "100px";

interface selId {
  id: number;
}

//批量删除用的数组
const ids = ref<number[] | undefined>(undefined);

interface webNest {
  favicon: string;
  title: string;
  url: string;
  description: string;
  tag: string;
  status: number;
  ghm: number;
}

const webNest = ref<webNest>({
  favicon: "",
  title: "",
  url: "",
  description: "",
  tag: "",
  status: 0,
  ghm: 0,
});

const iconList = [
  {
    value: "favicon.ico",
    label: "Tencent",
  },
  {
    value: "java.png",
    label: "Java",
  },
  {
    value: "javaScript.png",
    label: "JavaScript",
  },
  {
    value: "steam.png",
    label: "Steam",
  },
  {
    value: "green.png",
    label: "Green",
  },
  {
    value: "mxico.png",
    label: "Max",
  },
  {
    value: "auto.png",
    label: "Auto",
  },
];
//表格
const tableData = ref([
  {
    id: 0,
    favicon: "",
    title: "",
    url: "",
    description: "",
    tag: "",
    status: 0,
    ghm: 1,
  },
]);

const tags = ref([
  {
    id: 0,
    type: "",
  },
]);

const tag = ref({
  type: "",
});

//搜索的key
const key = ref("");

//关闭表单初始化
const close = () => {
  webNest.value = {
    favicon: "",
    title: "",
    url: "",
    description: "",
    tag: "",
    status: 0,
    ghm: 0,
  };
};

const checkFav = ref(false);

const getImageUrl = (name: string) => {
  return new URL(`../assets/${name}`, import.meta.url).href;
};

//tag标签过滤
const filterItem = ref([]);

//标签分类
const filterTag = (value: string, row: webNest) => {
  return row.tag === value;
};

function getTags() {
  axios
    .get("/api/tag/getTags")
    .then((resp) => {
      tags.value = resp.data.data;
      filterItem.value = resp.data.data.map((item: any) => ({
        text: item.type,
        value: item.type,
      }));
    })
    .catch((error) => {
      console.log(error);
    });
}

function getItemByTag(tag: string) {
  axios.get("/api/webNest/getItemsByTag", { params: { tag: tag } }).then((resp) => {
    tableData.value = resp.data.data;
  });
}

function getItemByKey(a: string) {
  if (a === null || a === undefined || a.trim() === "") {
    return;
  }
  axios.get("/api/webNest/getItemLike", { params: { key: a } }).then((resp) => {
    tableData.value = resp.data.data;
  });
}

function insertTag() {
  if (tag.value.type === "" || tag.value === null) {
    ElMessage({
      message: "tag不能为空",
      type: "info",
      plain: true,
    });
    return;
  }
  axios
    .post("/api/tag/insetTag", tag.value, {
      headers: { Authorization: headerToken.value },
    })
    .then((resp) => {
      if (resp.data.code !== 200) {
        ElMessage({
          message: "新增失败",
          type: "error",
          plain: true,
        });
      }
    });
  refresh();
}

function getAllItems() {
  axios
    .get("/api/webNest/getAllItems")
    .then((resp) => {
      tableData.value = resp.data.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

function insertForm() {
  if (checkFav.value) {
    webNest.value.ghm = 1;
  }
  axios
    .post("/api/webNest/addItem", webNest.value, {
      headers: { Authorization: headerToken.value },
    })
    .then((resp) => {
      if (resp.data.code === 200) {
        ElMessage({
          message: "新增成功",
          type: "success",
          plain: true,
        });
        refresh();
      } else {
        ElMessage({
          message: "新增失败",
          type: "error",
          plain: true,
        });
      }
    });
  dialogInsertFormVisible.value = false;
}

function openUpdateDiag(row: any) {
  dialogUpdateFormVisible.value = true;
  webNest.value = { ...row };
  checkFav.value = webNest.value.ghm === 1;
}

function updateForm() {
  if (checkFav.value) {
    webNest.value.ghm = 1;
  } else {
    webNest.value.ghm = 0;
  }
  axios
    .post("/api/webNest/updateItem", webNest.value, {
      headers: { Authorization: headerToken.value },
    })
    .then((resp) => {
      if (resp.data.code === 200) {
        ElMessage({
          message: "修改成功",
          type: "success",
          plain: true,
        });
        refresh();
      } else {
        ElMessage({
          message: "修改失败",
          type: "error",
          plain: true,
        });
      }
    });
  dialogUpdateFormVisible.value = false;
}

const openDelConfirm = (id: number) => {
  ElMessageBox.confirm("确认删除吗?", "Warning", {
    confirmButtonText: "OK",
    cancelButtonText: "Cancel",
    type: "warning",
  }).then(() => {
    delItems([id]);
  });
};

const openDelConfirms = (ids: number[] | undefined) => {
  if (!ids || ids.length === 0) {
    // 处理 ids 为 undefined 的情况，比如给出提示或者使用默认值
    ElMessage.error("未选中内容！");
    return;
  }
  ElMessageBox.confirm("确认删除吗?", "Warning", {
    confirmButtonText: "OK",
    cancelButtonText: "Cancel",
    type: "warning",
  }).then(() => {
    delItems(ids);
  });
};

const handleSelectionChange = (val: selId[]) => {
  ids.value = val.map((item) => item.id);
  console.log(ids.value);
};

function delItems(id: number[]) {
  axios
    .delete("/api/webNest/delItem/" + id, {
      headers: { Authorization: headerToken.value },
    })
    .then((resp) => {
      if (resp.data.code === 200) {
        ElMessage({
          message: "删除成功",
          type: "success",
          plain: true,
        });
        refresh();
      } else {
        ElMessage({
          message: "删除失败",
          type: "error",
          plain: true,
        });
      }
    });
}

// 无感更新状态的方法
const updateStatus = (row: { status: number; id: number }) => {
  // 切换状态
  row.status = row.status === 0 ? 1 : 0;
  // 调用更新函数
  star(row.id, row.status);
};

function star(a: number, b: number) {
  axios
    .post(
      "/api/webNest/updateStatus",
      { id: a, status: b },
      { headers: { Authorization: headerToken.value } }
    )
    .then((resp) => {
      if (resp.data.code !== 200) {
        ElMessage.warning(resp.data);
        refresh();
      }
    })
    .catch((error) => {
      ElMessage.error(error);
    });
}

function isOperation() {
  if (localStorage.getItem("Authorization") !== null) {
    headerToken.value = localStorage.getItem("Authorization");
    operation.value = true;
  }
}

onMounted(() => {
  getAllItems();
  getTags();
  isOperation();
});
</script>

<style scoped>
@import "./style/WebNest.css";
</style>
