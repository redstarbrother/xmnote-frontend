<template>
  <div class="node-item">
    <div
      class="item-container"
      @click="expandFolder"
      :class="{ selected: documentInfo.id === documentStore.getDocumentId() }"
    >
      <div class="item-info">
        <span
          class="item-info-logo"
          :style="{ paddingLeft: `${(documentInfo.depth || 0) * 16}px` }"
          >{{ item.logo }}</span
        >
        <span
          v-if="!isRenaming"
          class="truncate"
          :class="{ file: documentInfo.type === NodeType.FOLDER }"
        >
          {{ documentInfo.title }}
        </span>
        <input
          v-else
          ref="inputRef"
          v-model="editTitle"
          class="rename-input"
          @keydown.enter="confirmRename"
          @blur="confirmRename"
          @keydown.esc="cancelRename"
        />
      </div>
      <div class="item-option">
        <span class="option-more" @click="showPopoverMenu($event)">
          <el-icon>
            <MoreFilled color="#868684" />
          </el-icon>
        </span>
        <span
          class="option-switch"
          v-if="documentInfo.type === NodeType.FOLDER"
        >
          <el-icon>
            <ArrowDownBold color="#868684" v-if="expanded" />
            <ArrowLeftBold color="#868684" v-else />
          </el-icon>
        </span>
      </div>
      <div
        v-if="popoverMenuVisible"
        class="popover-menu"
        ref="popoverMenuRef"
        :style="{
          top: `${popoverMenuPosition.top}px`,
          left: `${popoverMenuPosition.left}px`,
        }"
      >
        <div
          class="popover-menu-item"
          v-if="documentInfo.type === NodeType.FOLDER"
          @click="onPopoverSelect($event, 'addFolder')"
        >
          <el-icon><Folder /></el-icon> 新增目录
        </div>
        <div
          class="popover-menu-item"
          v-if="documentInfo.type === NodeType.FOLDER"
          @click="onPopoverSelect($event, 'addDoc')"
        >
          <el-icon><Document /></el-icon> 新增文档
        </div>
        <div
          class="popover-menu-item"
          @click="onPopoverSelect($event, 'rename')"
        >
          <el-icon><EditPen /></el-icon> 重命名
        </div>
        <div
          class="popover-menu-item"
          @click="onPopoverSelect($event, 'delete')"
        >
          <el-icon><Delete color="#F56C6C" /></el-icon> 删除
        </div>
      </div>
    </div>
    <div v-if="expanded">
      <NodeItem v-for="child in item.child" :key="child.id" :item="child" />
    </div>
  </div>
</template>

<script setup>
import { NodeType } from "@/enums/NodeType";
import { ref, onMounted, nextTick, onBeforeUnmount } from "vue";
import { useDocumentStore } from "@/stores/documentStore";
import { ArrowDownBold, ArrowLeftBold } from "@element-plus/icons-vue";
import { onClickOutside } from "@vueuse/core";
import { createFolder, updateFolder } from "@/api/folder";
import { createDocument, updateDocument } from "@/api/doc";
import { ElMessageBox, ElMessage } from 'element-plus';
import { deleteDocument } from '@/api/doc';
import { deleteFolder } from '@/api/folder'; // 需要你补充此接口

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

// 展开状态
const expanded = ref(false);
const documentInfo = ref(props.item);
// 气泡菜单是否可见
const popoverMenuVisible = ref(false);
// 绑定气泡菜单的位置元素
const popoverMenuPosition = ref({ top: 0, left: 0 });
const popoverMenuRef = ref(null);
const triggerBtn = ref(null); // 用于绑定“...”按钮元素
// 文档store
const documentStore = useDocumentStore();
// 重命名状态
const isRenaming = ref(false);
const editTitle = ref(documentInfo.value.title);
const inputRef = ref(null);

// 展开目录
const expandFolder = (event) => {
  // 如果点击的是 .option-more 或其子元素，则不触发展开
  if (event.target.closest(".option-more")) {
    return;
  }
  console.log("run expand dir");
  console.log("type: ", documentInfo.value.type);

  if (documentInfo.value.type === NodeType.FOLDER) {
    expanded.value = !expanded.value;
  } else if (documentInfo.value.type === NodeType.DOCUMENT) {
    // 打开笔记
    console.log("打开笔记");
    documentStore.setDocument(documentInfo.value);
  }
};

const showPopoverMenu = (event) => {
  event.stopPropagation();
  const rect = event.currentTarget.getBoundingClientRect();
  popoverMenuPosition.value = {
    top: rect.bottom + 6 + window.scrollY,
    left: rect.left + window.scrollX,
  };
  popoverMenuVisible.value = true;
};

// 使用 VueUse 监听点击外部关闭菜单
onClickOutside(popoverMenuRef, () => {
  popoverMenuVisible.value = false;
});

const onPopoverSelect = async (event, action) => {
  event.stopPropagation();
  if (action === 'delete') {
    try {
      await ElMessageBox.confirm('确定删除该项吗？此操作不可撤销。', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      });
      let response;
      if (documentInfo.value.type === NodeType.FOLDER) {
        response = await deleteFolder({ id: documentInfo.value.id });
      } else {
        response = await deleteDocument({ id: documentInfo.value.id });
      }
      if (response.code === 200) {
        ElMessage({ message: '删除成功', type: 'success' });
        // TODO: 更新界面，移除该节点
      } else {
        ElMessage({ message: '删除失败', type: 'error' });
      }
    } catch (error) {
      // 取消删除或出错
    }
  } else if (action === 'rename') {
    onRename();
  } else if (action === 'addFolder') {
    addTemporaryNode(NodeType.FOLDER);
  } else if (action === 'addDoc') {
    addTemporaryNode(NodeType.DOCUMENT);
  }
  popoverMenuVisible.value = false;
};

// 重命名
const onRename = () => {
  editTitle.value = documentInfo.value.title;
  isRenaming.value = true;
  nextTick(() => {
    inputRef.value?.focus();
  });
};

const confirmRename = () => {
  if(!isRenaming.value) {
    return;
  }
  if (editTitle.value.trim() !== "") {
    documentInfo.value.title = editTitle.value.trim();
    // 如果需要调用 API 同步保存，建议在这里加
    if (documentInfo.value.isTemp && documentInfo.value.isTemp == true) {
      // 新增node
      saveNode();
      documentInfo.value.isTemp = false;
    } else {
      // 更新node
      console.log("更新node");
      
      updateNode();
    }
  }
  isRenaming.value = false;
};

const cancelRename = () => {
  isRenaming.value = false;
  editTitle.value = documentInfo.value.title;
};

// 新建目录/文档
const addTemporaryNode = (type) => {
  let newNode = undefined;
  if (!Array.isArray(documentInfo.value.child)) {
    documentInfo.value.child = [];
  }
  if (type === NodeType.FOLDER) {
    newNode = addFolderNode();
  } else {
    newNode = addNoteNode();
  }
  if (newNode) {
    documentInfo.value.child.push(newNode);
    expanded.value = true;
  }
};

const addFolderNode = () => {
  console.log("新建目录");
  const newItem = {
    id: `tmp_${Date.now()}`,
    title: "新建文件夹",
    type: NodeType.FOLDER,
    logo: "📂",
    depth: documentInfo.value.depth + 1,
    parentId: documentInfo.value.id,
    domainId: documentInfo.value.domainId,
    child: [],
    isTemp: true, // 用于标记是否为临时项
  };
  return newItem;
};

const addNoteNode = () => {
  console.log("新建文档");
  const newItem = {
    id: `tmp_${Date.now()}`,
    title: "新建文档",
    type: NodeType.DOCUMENT,
    logo: "📝",
    depth: documentInfo.value.depth + 1,
    parentId: documentInfo.value.id,
    domainId: documentInfo.value.domainId,
    child: [],
    isTemp: true, // 用于标记是否为临时项
  };
  return newItem;
};

onMounted(() => {
  // 如果是临时项，则说明为新增node
  if (documentInfo.value.isTemp) {
    onRename();
  }
});

const saveNode = async () => {
  // 新增node
  let response = undefined;
  const successMsg =
    documentInfo.value.type === NodeType.FOLDER
      ? "新建目录成功"
      : "新建文档成功";
  const failMsg =
    documentInfo.value.type === NodeType.FOLDER
      ? "新建目录失败"
      : "新建文档失败";
  if (documentInfo.value.type === NodeType.FOLDER) {
    response = await createFolder({
      title: documentInfo.value.title,
      parentId: documentInfo.value.parentId,
      domainId: documentInfo.value.domainId,
      logo: documentInfo.value.logo,
    });
  } else {
    response = await createDocument({
      title: documentInfo.value.title,
      folderId: documentInfo.value.parentId,
      logo: documentInfo.value.logo,
      content: "",
      domainId: documentInfo.value.domainId,
    });
  }
  if (response.code === 200) {
    ElMessage({
      message: successMsg,
      type: "success",
    });
    documentInfo.value.id = response.data.id;
  } else {
    ElMessage({
      message: failMsg,
      type: "error",
    });
  }
};

const updateNode = async () => {
  // 更新node
  let response = undefined;
  const successMsg =
    documentInfo.value.type === NodeType.FOLDER
      ? "更新目录成功"
      : "更新文档成功";
  const failMsg =
    documentInfo.value.type === NodeType.FOLDER
      ? "更新目录失败"
      : "更新文档失败";
  if (documentInfo.value.type === NodeType.FOLDER) {
    response = await updateFolder({
      id: documentInfo.value.id,
      title: documentInfo.value.title,
      parentId: documentInfo.value.parentId,
      domainId: documentInfo.value.domainId,
      logo: documentInfo.value.logo,
    });
  } else {
    response = await updateDocument({
      id: documentInfo.value.id,
      title: documentInfo.value.title,
      folderId: documentInfo.value.parentId,
      logo: documentInfo.value.logo,
      content: null,
    });
  }
  if (response.code === 200) {
    ElMessage({
      message: successMsg,
      type: "success",
    });
  } else {
    ElMessage({
      message: failMsg,
      type: "error",
    });
  }
};
</script>

<style scoped lang="scss">
.node-item {
  margin: 5px 0;
  cursor: pointer;

  .selected {
    background-color: #e8e8e7;
  }

  .item-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 20px;
    padding: 5px 3px;
    // 避免用户选中文字
    user-select: none;
    border-radius: 4px;
    transition: all 0.5s ease;

    .item-info {
      display: flex;
      align-items: center;
      .item-info-logo {
        display: flex;
        align-items: center;
        font-size: 16px;
        line-height: 1;
        margin-right: 5px;
        transform: translateY(-2px);
      }

      .truncate {
        color: #5f5f5b;
        max-width: 160px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .rename-input {
        font-size: 16px;
        line-height: 1;
        margin-right: 5px;
        border: 1px solid #e4e2e2;
        border-radius: 4px;
        width: 100%;
        color: #5f5f5b;
      }
    }

    &:hover {
      background-color: #e8e8e7;
      transition: all 0.5s ease;
      .item-option {
        opacity: 1;
      }
    }

    &:active {
      background-color: #f0f0ef;
      .item-option {
        opacity: 1;
      }
    }
  }

  .item-option {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 5px;
    transition: all 0.5s ease;
    opacity: 0;
    padding-right: 5px;

    span {
      padding: 3px;
      border-radius: 30%;
      cursor: pointer;
      &:hover {
        background-color: #dddddd;
        border-radius: 4px;
      }
    }
  }

  .file {
    color: #3c3c39;
  }

  .popover-menu {
    position: absolute;
    width: 120px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
    z-index: 999;
    padding: 8px 0;
    transition: all 0.2s ease;
  }

  .popover-menu-item {
    padding: 8px 16px;
    font-size: 14px;
    color: #232321;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .popover-menu-item:hover {
    background-color: #f5f5f5;
  }
}
</style>