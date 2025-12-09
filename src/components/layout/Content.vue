<template>
  <ContentWelcome v-show="!documentId" />
  <div class="content-container">
    <div class="content-title">
      <div class="logo">{{ logo }}</div>
      <input class="content-title-input" v-model="title" placeholder="请输入标题" @keyup.enter="handleEnterTitle" />
    </div>
    <div class="content-editor">
      <!-- <XmEditor v-bind="editorProps" v-model:content="content"/> -->
      <div id="xm-editor"> </div>
    </div>
    <div class="content-footer">
      <Footer />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from "vue";
import { XmEditor, Extensions, Presets } from "@putanut/xm-editor";
import "@putanut/xm-editor/xm-editor.css"
import ContentWelcome from "@/components/welcome/ContentWelcome.vue";
import { useDocumentStore } from "@/stores/documentStore";
import { useDomainStore } from "@/stores/domainStore";
import {
  getDocument,
  updateDocument,
  uploadImage,
} from "@/api/doc";
import { ElMessage } from "element-plus";

const documentStore = useDocumentStore();
const documentId = computed(() => documentStore.getDocumentId());
const domainStore = useDomainStore();
const editorInitialized = ref(false);
// 内容修改回调方法
const handleEditorChange = () => {
  if (initializing.value) return;
  documentStore.setContent(editor.getJSON());
  documentStore.setSaveStatus("unsaved");
};

console.log("Presets:", Presets);

let editor = null;

onMounted(() => {
  // 第一次打开文档时初始化editor
  editor = new XmEditor({
    el: "#xm-editor",
    config: Presets.NotionLike.configure({
      extensions: [
        Extensions.Image.configure({
          uploadHandler: (file) => {
            const formData = new FormData();
            formData.append("type", file.type);
            formData.append("file", file);
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
      ],
      onUpdate: handleEditorChange,
    }),
  });
})



const logo = ref("");
const title = ref("");

// 使用保存状态统一驱动未保存标记与自动保存
const initializing = ref(false);

const handleEnterTitle = () => {
  console.log("回车键被按下！");
  editor.focus();
};

onMounted(() => {
  // TODO 设置30秒自动保存
  setInterval(() => {
    const status = documentStore.getSaveStatus();
    if (status === "unsaved") {
      // 保存文档
      saveDocument();
    }
  }, 5000);
});

// 保存文档
const saveDocument = async () => {
  if (!documentId.value) return;

  // 更新保存状态为保存中
  documentStore.setSaveStatus("saving");

  let content = editor.getJSON();
  const response = await updateDocument({
    id: documentId.value,
    title: title.value,
    logo: logo.value,
    content: JSON.stringify(content),
  });
  if (response.code !== 200) {
    ElMessage.error("内容保存失败");
    // 保存失败维持未保存状态
    documentStore.setSaveStatus("unsaved");
  } else {
    documentStore.setSaveStatus("saved");
  }
};

// 手动改变保存状态
const changeSaveStatus = (status) => {
  if (initializing.value) return;
  documentStore.setSaveStatus(status);
};

// 当标题变化时，同步更新侧边栏与面包屑的标题
watch(
  title,
  (newTitle) => {
    const id = documentId.value;
    if (!id) return;
    domainStore.updateNode(id, { title: newTitle });
    changeSaveStatus("unsaved");
  }
);

watch(
  logo,
  (newLogo) => {
    const id = documentId.value;
    if (!id) return;
    domainStore.updateNode(id, { logo: newLogo });
    changeSaveStatus("unsaved");
  }
);

// 监听当前文档 ID 变化，自动加载内容
watch(
  documentId,
  async (id) => {
    if (!id) return;
    initializing.value = true;
    // 从接口获取文档数据
    const response = await getDocument({
      documentId: id,
    });

    if (response.code !== 200) {
      ElMessage.error(response.message);
      return;
    } else {
      title.value = response.data.title || "";
      logo.value = response.data.logo || "📝";
      let parsed = {};
      try {
        const raw = response.data.content;
        parsed = raw ? JSON.parse(raw) : {};
      } catch (e) {
        parsed = {};
      }
      editor.setContent(parsed);
      // 切换文档后默认视为已保存
      documentStore.setSaveStatus("saved");
    }


    await nextTick();
    initializing.value = false;
  },
  { immediate: true }
);
</script>

<style lang="scss">
.content-container::-webkit-scrollbar {
  width: 8px !important;
  background-color: transparent !important;
}

.content-container::-webkit-scrollbar-thumb {
  background-color: #D3D1CB !important;
  border-radius: 4px !important;
  border: none !important;
}

.content-container::-webkit-scrollbar-track {
  background-color: transparent !important;
}

.content-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  align-items: center;
  overflow: auto; // 使容器可滚动

  .content-title {
    width: 70%;
    height: 60px; // 固定高度
    flex-shrink: 0;
    display: flex;
    align-items: flex-start;
    background-color: #fff;
    padding: 2px;

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
    width: 70%;
    flex: 1;
    overflow: visible; // 修改为visible，防止内部出现滚动条
  }

  .content-footer {
    flex-shrink: 0;
  }
}
</style>
