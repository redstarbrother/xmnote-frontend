<template>
  <div class="node-item">
    <div class="item-container" @click="clickNode" :class="{ selected: isSelected, 'is-folder': isFolder }">
      <div class="item-info">
        <EmojiPicker :modelValue="item.logo" @select="onLogoSelect">
          <template #reference>
            <span class="item-info-logo" :style="{ paddingLeft: `${(nodeInfo.depth || 0) * 16}px` }" @click.stop>
              <span class="logo-inner">
                {{ item.logo }}
              </span>
            </span>
          </template>
        </EmojiPicker>
        <span v-if="!isRenaming" class="truncate" :class="{ file: isFolder }">
          {{ nodeInfo.title }}
        </span>
        <input v-else ref="inputRef" v-model="editTitle" class="rename-input" @keydown.enter="confirmRename"
          @blur="confirmRename" @keydown.esc="cancelRename" />
      </div>
      <div class="node-actions">
        <span class="child-count" v-if="isFolder">{{ (nodeInfo.child && nodeInfo.child.length) || 0 }}</span>
        <div class="item-option">
        <!-- 使用 Element Plus 下拉菜单替代手写气泡 -->
        <el-dropdown @command="onCommand" trigger="click">
          <span class="option-more">
            <el-icon size="12">
              <MoreFilled color="#868684" />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-if="isFolder" command="addFolder">
                <el-icon size="12">
                  <Folder />
                </el-icon> 新增目录
              </el-dropdown-item>
              <el-dropdown-item v-if="isFolder" command="addDoc">
                <el-icon size="12">
                  <Document />
                </el-icon> 新增文档
              </el-dropdown-item>
              <el-dropdown-item command="rename">
                <el-icon size="12">
                  <EditPen />
                </el-icon> 重命名
              </el-dropdown-item>
              <el-dropdown-item command="delete">
                <el-icon size="12">
                  <Delete color="#F56C6C" />
                </el-icon> 删除
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <span class="option-switch" v-if="isFolder">
          <el-icon size="12">
            <ArrowDownBold color="#868684" v-if="expanded" />
            <ArrowLeftBold color="#868684" v-else />
          </el-icon>
        </span>
      </div>
    </div>
    </div>
  </div>
  <el-collapse-transition>
    <div v-if="expanded">
      <NodeItem v-for="child in item.child" :key="child.id" :item="{
        ...child,
        depth: (nodeInfo.depth || 0) + 1
      }" />
    </div>
  </el-collapse-transition>
</template>

<script setup>
import { NodeType } from "@/enums/NodeType";
import { ref, onMounted, nextTick, computed, watch } from "vue";
import { useDocumentStore } from "@/stores/documentStore";
import { ArrowDownBold, ArrowLeftBold, MoreFilled, Folder, Document, EditPen, Delete } from "@element-plus/icons-vue";
import { createFolder, updateFolder, deleteFolder } from "@/api/folder";
import { createDocument, updateDocument, deleteDocument } from "@/api/doc";
import { ElMessageBox, ElMessage } from 'element-plus';
import { useDomainStore } from '@/stores/domainStore';
import EmojiPicker from "@/components/common/EmojiPicker.vue";

// props.item:
// {
//   id: `tmp_${Date.now()}`,
//   title: isFolder ? "新建文件夹" : "新建文档",
//   type,
//   logo,
//   depth: (nodeInfo.value.depth || 0) + 1,
//   parentId: nodeInfo.value.id,
//   domainId: nodeInfo.value.domainId,
//   child: [],
//   isTemp: true,
// }
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const domainStore = useDomainStore();
const documentStore = useDocumentStore();

// 展开状态
const expanded = ref(false);
const nodeInfo = ref(props.item);

const onLogoSelect = async (newLogo) => {
  // 1. Update store (optimistic)
  domainStore.updateNode(props.item.id, { logo: newLogo });

  // 2. Update backend
  const params = {
    id: props.item.id,
    title: props.item.title,
    folderId: props.item.parentId,
    logo: newLogo,
    domainId: props.item.domainId
  };

  let response;
  try {
    if (isFolder.value) {
      response = await updateFolder({
        id: params.id,
        logo: params.logo
      });
    } else {
      response = await updateDocument(params);
    }

    if (response?.code !== 200) {
      ElMessage.error("图标更新失败");
    }
  } catch (e) {
    ElMessage.error("图标更新出错: " + e.message);
  }
};


// 计算属性：减少模板判断
const isFolder = computed(() => nodeInfo.value.type === NodeType.FOLDER);
const isSelected = computed(() => nodeInfo.value.id === documentStore.getDocumentId());

// 重命名状态
const isRenaming = ref(false);
const editTitle = ref(nodeInfo.value.title);
const inputRef = ref(null);

// 展开目录
const clickNode = (event) => {
  // 避免点击“更多”触发展开
  if (event.target.closest(".option-more")) return;

  if (isFolder.value) {
    expanded.value = !expanded.value;
  } else {
    documentStore.setDocumentId(nodeInfo.value.id);
  }
};

// 下拉菜单命令统一处理
const onCommand = async (action) => {
  if (action === 'delete') {
    try {
      await ElMessageBox.confirm('确定删除该项吗？此操作不可撤销。', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      });
      const api = isFolder.value ? deleteFolder : deleteDocument;
      const response = await api({ id: nodeInfo.value.id });
      if (response.code === 200) {
        domainStore.deleteNode(nodeInfo.value.id);
        ElMessage({ message: '删除成功', type: 'success' });
      } else {
        ElMessage({ message: '删除失败', type: 'error' });
      }
    } catch (error) {
      ElMessage({ message: '删除失败', type: 'error' });
      console.log('删除失败', error);
    }
  } else if (action === 'rename') {
    onRename();
  } else if (action === 'addFolder') {
    addChildNode(NodeType.FOLDER);
  } else if (action === 'addDoc') {
    addChildNode(NodeType.DOCUMENT);
  }
};

// 重命名
const onRename = () => {
  editTitle.value = nodeInfo.value.title;
  isRenaming.value = true;
  nextTick(() => inputRef.value?.focus());
};

const confirmRename = async () => {
  if (!isRenaming.value) return;
  const newTitle = editTitle.value.trim();
  if (newTitle !== "") {
    nodeInfo.value.title = newTitle;
    await updateNode();
  }
  isRenaming.value = false;
};

const cancelRename = () => {
  isRenaming.value = false;
  editTitle.value = nodeInfo.value.title;
};

// 合并新增临时节点逻辑
const addChildNode = async (type) => {
  const isFolder = type === NodeType.FOLDER;
  const logo = isFolder ? "📂" : "📝";
  const newItem = {
    id: `tmp_${Date.now()}`,
    title: isFolder ? "新建文件夹" : "新建文档",
    type,
    logo,
    depth: (nodeInfo.value.depth || 0) + 1,
    parentId: nodeInfo.value.id,
    domainId: nodeInfo.value.domainId,
    child: [],
    isTemp: true,
  };
  if (isFolder) {
    const response = await createFolder({
      title: newItem.title,
      parentId: newItem.parentId,
      domainId: newItem.domainId,
      logo: newItem.logo,
    });
    if (response.code === 200) {
      newItem.id = response.data.id;
    }
  } else {
    const response = await createDocument({
      title: newItem.title,
      folderId: newItem.parentId,
      domainId: newItem.domainId,
      logo: newItem.logo,
      content: "",
    });
    if (response.code === 200) {
      newItem.id = response.data.id;
    }
  }
  // 本地插入，立即更新可见的子节点列表
  if (!Array.isArray(nodeInfo.value.child)) {
    nodeInfo.value.child = [];
  }
  nodeInfo.value.child.push(newItem);
  // 同步到 Store，保持全局一致
  domainStore.addNode(newItem);
  // 展开当前节点以显示刚添加的子项
  expanded.value = true;
};

onMounted(() => {
  if (nodeInfo.value.isTemp) {
    onRename();
  }
});

// 当父组件传入的 item 更新（例如标题在内容区修改并写入 store），同步到本地副本
watch(
  () => props.item,
  (newItem) => {
    nodeInfo.value = newItem;
    // 若当前正处于重命名输入框展示，保持输入值与新标题一致
    if (!isRenaming.value) {
      editTitle.value = newItem.title;
    }
  },
  { deep: false }
);

// 更新Node
const updateNode = async () => {
  const response = isFolder.value
    ? await updateFolder({
      id: nodeInfo.value.id,
      title: nodeInfo.value.title,
      parentId: nodeInfo.value.parentId,
      domainId: nodeInfo.value.domainId,
      logo: nodeInfo.value.logo,
    })
    : await updateDocument({
      id: nodeInfo.value.id,
      title: nodeInfo.value.title,
      folderId: nodeInfo.value.parentId,
      logo: nodeInfo.value.logo,
      domainId: nodeInfo.value.domainId,
    });

  if (response?.code === 200) {
    domainStore.updateNode(nodeInfo.value.id, { title: nodeInfo.value.title, logo: nodeInfo.value.logo });
    ElMessage({ message: (isFolder.value ? "文件夹" : "文档") + "更新成功", type: "success" });
  } else {
    ElMessage({ message: (isFolder.value ? "文件夹" : "文档") + "更新失败", type: "error" });
  }
}
</script>

<style scoped lang="scss">
.node-item {
  margin: 5px 0;
  cursor: pointer;

  .selected {
    background-color: #f8f9fa;
  }

  .item-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    // box-sizing: border-box;
    // height: 30px;
    padding: 8px 12px;
    // 避免用户选中文字
    user-select: none;
    border-radius: 4px;
    transition: all 0.5s ease;

    .item-info {
      display: flex;
      align-items: center;
      height: 24px;

      .item-info-logo {
        display: flex;
        align-items: center;
        font-size: 16px;
        line-height: 1;
        margin-right: 5px;
        transform: translateY(-2px);

        .logo-inner {
          padding: 2px;
          border-radius: 4px;
          transition: background-color 0.2s;

          &:hover {
            background-color: #e6e6e6;
          }
        }
      }

      .truncate {
        color: #5f5f5b;
        // max-width: 160px; // 移除固定宽度限制，使其自适应
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

    .child-count {
      font-size: 12px;
      color: #909399;
      // margin-right: 15px;
      background-color: #f8f9fa;
      padding: 3px 6px;
      border-radius: 3px;
    }

    .node-actions {
      display: grid;
      grid-template-areas: "stack";
      align-items: center;
      justify-items: end;
      flex-shrink: 0;

      > * {
        grid-area: stack;
      }
    }

    &.is-folder {
      .node-actions {
        min-width: 46px;
      }

      .child-count {
        transition: opacity 0.2s;
      }

      .item-option {
        pointer-events: none;
      }

      &:hover {
        .child-count {
          opacity: 0;
        }

        .item-option {
          pointer-events: auto;
        }
      }
    }

    &:hover {
      background-color: #f8f9fa;
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
    max-height: 18px;

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