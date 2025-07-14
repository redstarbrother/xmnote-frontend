<template>
  <div class="content-container">
    <div class="content-title">
      <input
        class="content-title-input"
        v-model="title"
        placeholder="请输入标题"
        @keyup.enter="handleEnterTitle"
      />
    </div>
    <div class="content-editor">
      <XmEditor
        :extensions="extensions"
        :showToolbar="false"
        :backgroundColorOnFocus="'#ffffff'"
        :placeholder="sourceContent"
        :showBorder="false"
        :height="'100%'"
        :onUpdate="handleEditorChange"
      />
    </div>
    <div class="content-footer">
      <Footer />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from "vue";
import XmEditor from "xm-editor";
import {
  Heading,
  Bold,
  Italic,
  Strike,
  Underline,
  BulletList,
  OrderedList,
  TaskList,
  Blockquote,
  HorizontalRule,
  CodeBlock,
  Image,
} from "xm-editor";
import "xm-editor/xm-editor.css";
import { useDocumentStore } from "@/stores/documentStore";
import { getDocument, deleteDocument, updateDocument } from "@/api/doc";
import { ElMessage } from "element-plus";

const documentStore = useDocumentStore();
const documentId = computed(() => documentStore.getDocumentId());

const extensions = [
  Heading,
  Bold,
  Italic,
  Underline,
  Strike,
  BulletList,
  OrderedList,
  TaskList,
  Blockquote,
  HorizontalRule,
  CodeBlock,
  Image.configure({
    uploadUrl: import.meta.env.VITE_IMAGE_URL,
  }),
];

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
  content.value = editor.getJSON();
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

  .content-title {
    width: 80%;
    height: 60px; // 固定高度
    flex-shrink: 0;

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
    width: 80%;
    flex: 1;
    overflow: auto;
  }

  .content-footer {
    flex-shrink: 0;
  }
}
</style>
