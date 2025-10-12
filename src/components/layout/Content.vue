<template>
  <ContentWelcome v-if="!documentId" />
  <div v-else class="content-container">
    <div class="content-title">
      <div class="logo">{{logo}}</div>
      <input
        class="content-title-input"
        v-model="title"
        placeholder="请输入标题"
        @keyup.enter="handleEnterTitle"
      />
    </div>
    <div class="content-editor">
      <XmEditor v-bind="editorProps" v-model:content="content"/>
    </div>
    <div class="content-footer">
      <Footer />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from "vue";
import XmEditor from "xm-editor";
import ContentWelcome from "@/components/welcome/ContentWelcome.vue";
import {
  Heading,
  Bold,
  Italic,
  Strike,
  Underline,
  List,
  Blockquote,
  HorizontalRule,
  CodeBlock,
  Image,
  Table,
} from "xm-editor";
import "xm-editor/xm-editor.css";
import { useDocumentStore } from "@/stores/documentStore";
import {
  getDocument,
  deleteDocument,
  updateDocument,
  uploadImage,
} from "@/api/doc";
import { ElMessage } from "element-plus";

const documentStore = useDocumentStore();
const documentId = computed(() => documentStore.getDocumentId());

const extensions = [
  Heading,
  Bold,
  Italic,
  Underline,
  Strike,
  List,
  Blockquote,
  HorizontalRule,
  CodeBlock,
  Image.configure({
    uploadHandler: (file) => {
      const formData = new FormData();
      formData.append("type", file.type);
      formData.append("file", file);
      console.log("formData:");
      for (let [k, v] of formData.entries()) {
        console.log(k, v);
      }
      return uploadImage(formData)
        .then((res) => {
          return {
            url: res.data.url,
          };
        })
        .catch((err) => {
          ElMessage.error(err.message);
          return Promise.reject(err);
        });
    },
  }),
  Table,
];

const editorProps = computed(() => ({
  extensions,
  fixedMenuEnabled: false,
  backgroundColorOnFocus: "#ffffff",
  placeholder: "",
  showBorder: false,
  height: "100%",
  onUpdate: handleEditorChange,
}));

const logo = ref("");
const title = ref("");
const content = ref({});
const sourceContent = ref({});

const isChanged = ref(false);

const handleEnterTitle = () => {
  console.log("回车键被按下！");
};

// 内容修改回调方法
const handleEditorChange = ({ editor }) => {
  // content.value = editor.getJSON();
  console.log(content.value);
};

onMounted(() => {
  // TODO 设置30秒自动保存
  setInterval(() => {
    if (isChanged.value) {
      // 保存文档
      saveDocument();
    }
  }, 5000);
});

// 保存文档
const saveDocument = async () => {
  if (!documentId.value) return;

  const response = await updateDocument({
    id: documentId.value,
    title: title.value,
    logo: logo.value,
    content: JSON.stringify(content.value),
  });
  if (response.code !== 200) {
    ElMessage.error("内容保存失败");
  } else {
    isChanged.value = false;
  }
};

// 监听文档信息变化，更改isChanged
watch(
  [logo, title, content],
  () => {
    isChanged.value = true;
  },
  { deep: true }
);

// 监听当前文档 ID 变化，自动加载内容
watch(
  documentId,
  async (id) => {
    if (!id) return;
    // 从接口获取文档数据
    const response = await getDocument({
      documentId: id,
    });

    if (response.code !== 200) {
      ElMessage.error(response.message);
      return;
    } else {
      title.value = response.data.title;
      sourceContent.value = JSON.parse(response.data.content);
      logo.value = response.data.logo;
      content.value = sourceContent.value;
    }
    await nextTick();
  },
  { immediate: true }
);
</script>

<style scoped lang="scss">
.content-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  align-items: center;
  overflow: auto; // 使容器可滚动

  .content-title {
    width: 50%;
    height: 60px; // 固定高度
    flex-shrink: 0;
    display: flex;
    align-items: flex-start;
    position: sticky; // 吸顶效果
    top: 0; 
    background-color: #fff;
    z-index: 10;
    padding: 2px;
    
    // 添加底部渐变阴影效果
    &::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 0;
      width: 100%;
      height: 10px;
      background: linear-gradient(to bottom, rgba(255, 255, 255, 1), transparent);
      pointer-events: none; // 确保不会影响鼠标事件
    }
    .logo {
      padding: 0;
      font-size: 3rem;
      font-weight: 600;
      color: #000000;
      cursor: pointer;
      &:hover {
        background-color: rgba(55, 53, 47, 0.06);
      }
    }

    .content-title-input {
      width: 100%;
      font-size: 40px;
      font-weight: 600;
      height: 100%;
      border: none;
      outline: none;

      &::placeholder {
        color: #bcbcb8;
      }
    }
  }

  .content-editor {
    width: 50%;
    flex: 1;
    overflow: visible; // 修改为visible，防止内部出现滚动条
  }

  .content-footer {
    flex-shrink: 0;
  }
}
</style>
