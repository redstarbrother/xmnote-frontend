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
        :placeholder="content"
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
import { ref, computed, watch, nextTick } from "vue";
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
} from "xm-editor";
import "xm-editor/xm-editor.css";
import { useBreadcrumbStore } from "@/stores/breadcrumbStore";
import { getDocument, deleteDocument } from "@/api/doc";
import { ElMessage } from "element-plus";


const breadcrumbStore = useBreadcrumbStore();
const currentNoteId = computed(() => breadcrumbStore.currentNoteId);

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
];

const xmEditorRef = ref(null);
const title = ref("");
const content = ref({});

const handleEnterTitle = () => {
  console.log("回车键被按下！");
};

const handleEditorChange = ({ editor }) => {
  const json = editor.getJSON();
  console.log("编辑器内容改变：", editor.getJSON());
  console.log("json: ", JSON.stringify(json));
};

// 监听当前文档 ID 变化，自动加载内容
watch(
  currentNoteId,
  async (documentId) => {
    if (!documentId) return;

    console.log("documentId: ", documentId);

    // 从接口获取文档数据
    const response = await getDocument({
      documentId: documentId,
    });

    if (response.code !== 200) {
      ElMessage.error(response.message);
      return;
    } else {
      title.value = response.data.title;
      content.value = JSON.parse(response.data.content);
    }

    await nextTick();
    if (xmEditorRef.value?.editor) {
      xmEditorRef.value.editor.commands.setContent(content.value);
    }
  },
  { immediate: true }
);

// 模拟文档数据
const mockDocs = {
  1: { title: "文档1", content: "这是文档1内容" },
  2: {
    title: "Python 与 Java 对比",
    content:
      '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"print(\\"Hello Python\\")\\nSystem.out.println(\\"Hello Java\\");"}]}]}',
  },
};
</script>

<style scoped lang="scss">
.content-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  flex-grow: 1;
  height: calc(100vh - 100px);

  .content-title {
    width: 80%;

    .content-title-input {
      width: 100%;
      font-size: 40px;
      font-weight: 600;
      height: 60px;
      border: none;
      outline: none;

      &::placeholder {
        color: #bcbcb8;
      }
    }
  }

  .content-editor {
    width: 80%;
    flex-grow: 1;
  }
}
</style>
