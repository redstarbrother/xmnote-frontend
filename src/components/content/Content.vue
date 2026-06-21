<template>
    <div class="content-container">
        <div class="content-title">
            <EmojiPicker v-model="logo" @select="changeLogo">
                <template #reference>
                    <div class="logo">{{ logo }}</div>
                </template>
            </EmojiPicker>
            <textarea class="content-title-input" ref="titleInputRef" v-model="title" placeholder="请输入标题" maxlength="50"
                @input="resize" @keyup.enter="handleEnterTitle" rows="1" />
        </div>
        <div class="content-editor">
            <div id="xm-editor"> </div>
        </div>

        <!-- 骨架屏遮罩（加载过渡效果） -->
        <transition name="fade">
            <div v-if="initializing" class="loading-overlay">
                <el-skeleton animated style="padding: 10px 20px">
                    <template #template>
                        <div style="padding: 0">
                            <!-- 模拟标题和图标 -->
                            <div style="display: flex; align-items: center; margin-bottom: 30px;">
                                <el-skeleton-item variant="rect" style="width: 48px; height: 48px; border-radius: 8px; margin-right: 16px;" />
                                <el-skeleton-item variant="h1" style="width: 40%; height: 40px;" />
                            </div>
                            <!-- 模拟内容 -->
                            <el-skeleton-item variant="text" style="width: 100%; margin-bottom: 20px; height: 16px" />
                            <el-skeleton-item variant="text" style="width: 80%; margin-bottom: 20px; height: 16px" />
                            <el-skeleton-item variant="text" style="width: 90%; margin-bottom: 20px; height: 16px" />
                            <el-skeleton-item variant="text" style="width: 70%; margin-bottom: 20px; height: 16px" />
                            <el-skeleton-item variant="text" style="width: 60%; margin-bottom: 20px; height: 16px" />
                            <el-skeleton-item variant="text" style="width: 85%; margin-bottom: 20px; height: 16px" />
                            <el-skeleton-item variant="text" style="width: 75%; margin-bottom: 20px; height: 16px" />
                        </div>
                    </template>
                </el-skeleton>
            </div>
        </transition>

        <!-- 右侧目录 -->
        <TocSidebar v-if="!initializing" :editor="editorRef" />
    </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from "vue";
import { XmEditor, Extensions, Presets } from "@putanut/xm-editor";
import "@putanut/xm-editor/xm-editor-notion.css"
import { useDocumentStore } from "@/stores/documentStore";
import { useDomainStore } from "@/stores/domainStore";
import {
    getDocument,
    updateDocument,
    uploadImage,
} from "@/api/doc";
import { ElMessage } from "element-plus";

import EmojiPicker from "@/components/common/EmojiPicker.vue";
import TocSidebar from "@/components/content/TocSidebar.vue";

const documentStore = useDocumentStore();
const documentId = computed(() => documentStore.documentId);
const domainStore = useDomainStore();
const titleInputRef = ref(null);
// 内容修改回调方法
const handleEditorChange = () => {
    if (initializing.value) return;
    documentStore.content = editor.getJSON();
    documentStore.saveStatus = "unsaved";
};

// 调整标题输入框高度
const resize = async () => {
    await nextTick()
    const el = titleInputRef.value
    if (!el) return
    el.style.height = 'auto'
    el.style.height = el.scrollHeight + 'px'
}

let editor = null;
const editorRef = ref(null);
let autoSaveTimer = null;

const initEditor = (initialContent) => {
    if (editor) {
        if (typeof editor.destroy === 'function') {
            editor.destroy();
        } else if (editor.editor && typeof editor.editor.destroy === 'function') {
            editor.editor.destroy();
        }
        const el = document.querySelector("#xm-editor");
        if (el) el.innerHTML = "";
        editor = null;
    }

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
                Extensions.Toc.configure({
                    mode: "data"
                })
            ],
            editorOption: {
                placeholder: "输入 '/' 唤起命令菜单...",
                autofocus: true,
            },
            events: {
                onUpdate: handleEditorChange,
            },
            style: {
                customClass: 'xm-editor-custom',
            },
        }),
    });

    if (initialContent) {
        editor.setContent(initialContent);
    }

    // 更新响应式引用供 TocSidebar 使用
    editorRef.value = editor;
};

onMounted(() => {
    resize();

    // 合并后的定时器设置：5秒自动保存
    autoSaveTimer = setInterval(() => {
        const status = documentStore.saveStatus;
        if (status === "unsaved") {
            // 保存文档
            saveDocument();
        }
    }, 5000);
})

onUnmounted(() => {
    if (autoSaveTimer) {
        clearInterval(autoSaveTimer);
        autoSaveTimer = null;
    }
});

const logo = ref("");
const title = ref("");

// 使用保存状态统一驱动未保存标记与自动保存
const initializing = ref(false);

const handleEnterTitle = () => {
    if (editor) editor.focus();
};

const isSaving = ref(false);

// 保存文档
const saveDocument = async () => {
    if (!documentId.value || isSaving.value) return;

    isSaving.value = true;
    // 更新保存状态为保存中
    documentStore.saveStatus = "saving";

    try {
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
            documentStore.saveStatus = "unsaved";
        } else {
            // 只有当在此期间用户没有做新的修改时，才置为已保存状态
            if (documentStore.saveStatus === "saving") {
                documentStore.saveStatus = "saved";
            }
        }
    } catch (err) {
        ElMessage.error("内容保存失败");
        documentStore.saveStatus = "unsaved";
    } finally {
        isSaving.value = false;
    }
};

// 手动改变保存状态
const changeSaveStatus = (status) => {
    if (initializing.value) return;
    documentStore.saveStatus = status;
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
    async (newId, oldId) => {
        // 1. 如果切换前，旧文档状态为未保存，先同步/异步保存旧文档
        if (oldId && editor && documentStore.saveStatus === "unsaved") {
            try {
                const oldContent = editor.getJSON();
                const oldTitle = title.value;
                const oldLogo = logo.value;
                await updateDocument({
                    id: oldId,
                    title: oldTitle,
                    logo: oldLogo,
                    content: JSON.stringify(oldContent),
                });
            } catch (err) {
                console.error("Failed to auto-save previous document on switch:", err);
            }
        }

        if (!newId) return;
        initializing.value = true;
        
        // 切换文档时自动滚动到顶部
        const mainContainer = document.querySelector('.main-container');
        if (mainContainer) {
            mainContainer.scrollTop = 0;
        }

        // 从接口获取文档数据
        const response = await getDocument({
            documentId: newId,
        });

        if (response.code !== 200) {
            ElMessage.error(response.message);
            return;
        } else {
            title.value = response.data.title || "";
            logo.value = response.data.logo || "📝";
            // 数据加载完成后，调整标题输入框高度
            resize();
            let parsed = {};
            try {
                const raw = response.data.content;
                parsed = raw ? JSON.parse(raw) : {};
            } catch (e) {
                parsed = {};
            }
            // 重新创建编辑器实例并设置内容
            initEditor(parsed);
            // 切换文档后默认视为已保存
            documentStore.saveStatus = "saved";
        }


        await nextTick();
        initializing.value = false;
    },
    { immediate: true }
);
</script>

<style lang="scss">
.content-container {
    width: 70%;
    position: relative; // 为了让 loading-overlay 和 TOC 绝对定位

    // 骨架屏遮罩层
    .loading-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        min-height: 100vh;
        background-color: #fff;
        z-index: 10;
        pointer-events: auto; // 阻止加载时点击底层内容
    }

    // 渐变过渡动画
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.3s ease;
    }

    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }

    .content-title {
        width: 100%;
        height: auto; // 固定高度
        flex-shrink: 0;
        display: flex;
        align-items: flex-start;
        background-color: #fff;
        padding: 10px 20px;

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
            height: auto;
            resize: none;
            /* 禁止拖拽 */
            line-height: 1.5;
            box-sizing: border-box;
            font-size: 40px;
            font-weight: 600;
            border: none;
            outline: none;
            background-color: #fff;
            overflow: hidden;

            &::placeholder {
                color: #bcbcb8;
            }
        }
    }

    .content-editor {
        width: 100%;
        flex: 1;
        overflow: visible;
    }

    .xm-editor-custom {
        border: 0;
    }

    .content-footer {
        flex-shrink: 0;
    }
}

// TOC 侧边栏定位：绝对定位到 content-container 右侧外部
.content-container > .toc-sidebar {
    position: absolute;
    top: 0;
    left: 100%; // 紧贴内容区右侧
    margin-left: 8px;
}
</style>
