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
    </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from "vue";
import { XmEditor, Extensions, Presets } from "@putanut/xm-editor";
import "@putanut/xm-editor/xm-editor.css"
import { useDocumentStore } from "@/stores/documentStore";
import { useDomainStore } from "@/stores/domainStore";
import {
    getDocument,
    updateDocument,
    uploadImage,
} from "@/api/doc";
import { ElMessage } from "element-plus";

import EmojiPicker from "@/components/common/EmojiPicker.vue";

const documentStore = useDocumentStore();
const documentId = computed(() => documentStore.getDocumentId());
const domainStore = useDomainStore();
const titleInputRef = ref(null);
// 内容修改回调方法
const handleEditorChange = () => {
    if (initializing.value) return;
    documentStore.setContent(editor.getJSON());
    documentStore.setSaveStatus("unsaved");
};

console.log("Presets:", Presets);

// 调整标题输入框高度
const resize = async () => {
    await nextTick()
    const el = titleInputRef.value
    if (!el) return
    el.style.height = 'auto'
    el.style.height = el.scrollHeight + 'px'
}

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
    resize();
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
            // 数据加载完成后，调整标题输入框高度
            resize();
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

<style lang="scss" scoped>
.content-container {
    width: 70%;

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
            // width: 100%;
            font-size: 40px;
            font-weight: 600;
            // height: 100%;
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
        overflow: visible; // 修改为visible，防止内部出现滚动条
    }
    
    .content-footer {
        flex-shrink: 0;
    }
}

:deep(.xm-editor-custom) {
    border: 0;
}
</style>
