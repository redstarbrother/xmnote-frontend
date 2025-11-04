<template>
  <div class="node-item">
    <div
      class="item-container"
      @click="expandFolder"
      :class="{ selected: isSelected }"
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
          :class="{ file: isFolder }"
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
        <!-- 使用 Element Plus 下拉菜单替代手写气泡 -->
        <el-dropdown @command="onCommand" trigger="click">
          <span class="option-more">
            <el-icon>
              <MoreFilled color="#868684" />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-if="isFolder" command="addFolder">
                <el-icon><Folder /></el-icon> 新增目录
              </el-dropdown-item>
              <el-dropdown-item v-if="isFolder" command="addDoc">
                <el-icon><Document /></el-icon> 新增文档
              </el-dropdown-item>
              <el-dropdown-item command="rename">
                <el-icon><EditPen /></el-icon> 重命名
              </el-dropdown-item>
              <el-dropdown-item command="delete">
                <el-icon><Delete color="#F56C6C" /></el-icon> 删除
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <span
          class="option-switch"
          v-if="isFolder"
        >
          <el-icon>
            <ArrowDownBold color="#868684" v-if="expanded" />
            <ArrowLeftBold color="#868684" v-else />
          </el-icon>
        </span>
      </div>
    </div>
    <div v-if="expanded">
      <NodeItem 
        v-for="child in item.child" 
        :key="child.id" 
        :item="{
          ...child,
          depth: (documentInfo.depth || 0) + 1
        }" 
      />
    </div>
  </div>
</template>

<script setup>
import { NodeType } from "@/enums/NodeType";
import { ref, onMounted, nextTick, computed, watch } from "vue";
import { useDocumentStore } from "@/stores/documentStore";
import { ArrowDownBold, ArrowLeftBold } from "@element-plus/icons-vue";
import { createFolder, updateFolder, deleteFolder } from "@/api/folder";
import { createDocument, updateDocument, deleteDocument } from "@/api/doc";
import { ElMessageBox, ElMessage } from 'element-plus';
import { useFolderStore } from '@/stores/folderStore';

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const folderStore = useFolderStore();
const documentStore = useDocumentStore();

// 展开状态
const expanded = ref(false);
const documentInfo = ref(props.item);

// 计算属性：减少模板判断
const isFolder = computed(() => documentInfo.value.type === NodeType.FOLDER);
const isSelected = computed(() => documentInfo.value.id === documentStore.getDocumentId());

// 重命名状态
const isRenaming = ref(false);
const editTitle = ref(documentInfo.value.title);
const inputRef = ref(null);

// 展开目录
const expandFolder = (event) => {
  // 避免点击“更多”触发展开
  if (event.target.closest(".option-more")) return;

  if (isFolder.value) {
    expanded.value = !expanded.value;
  } else {
    documentStore.setDocument(documentInfo.value);
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
      const response = await api({ id: documentInfo.value.id });
      if (response.code === 200) {
        folderStore.deleteNode(documentInfo.value.id);
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
  editTitle.value = documentInfo.value.title;
  isRenaming.value = true;
  nextTick(() => inputRef.value?.focus());
};

const confirmRename = async () => {
  if (!isRenaming.value) return;
  const newTitle = editTitle.value.trim();
  if (newTitle !== "") {
    documentInfo.value.title = newTitle;
    await persistRename();
  }
  isRenaming.value = false;
};

const cancelRename = () => {
  isRenaming.value = false;
  editTitle.value = documentInfo.value.title;
};

// 合并新增临时节点逻辑
const addChildNode = (type) => {
  const logo = type === NodeType.FOLDER ? "📂" : "📝";
  const newItem = {
    id: `tmp_${Date.now()}`,
    title: type === NodeType.FOLDER ? "新建文件夹" : "新建文档",
    type,
    logo,
    depth: (documentInfo.value.depth || 0) + 1,
    parentId: documentInfo.value.id,
    domainId: documentInfo.value.domainId,
    child: [],
    isTemp: true,
  };
  // 本地插入，立即更新可见的子节点列表
  if (!Array.isArray(documentInfo.value.child)) {
    documentInfo.value.child = [];
  }
  documentInfo.value.child.push(newItem);
  // 同步到 Store，保持全局一致
  folderStore.addNode(newItem);
  // 展开当前节点以显示刚添加的子项
  expanded.value = true;
};

onMounted(() => {
  if (documentInfo.value.isTemp) {
    onRename();
  }
});

// 当父组件传入的 item 更新（例如标题在内容区修改并写入 store），同步到本地副本
watch(
  () => props.item,
  (newItem) => {
    documentInfo.value = newItem;
    // 若当前正处于重命名输入框展示，保持输入值与新标题一致
    if (!isRenaming.value) {
      editTitle.value = newItem.title;
    }
  },
  { deep: false }
);

// 新增/更新统一持久化
const persistRename = async () => {
  let response;
  const isFolderNode = isFolder.value;
  const successMsg = isFolderNode ? "目录保存成功" : "文档保存成功";
  const failMsg = isFolderNode ? "目录保存失败" : "文档保存失败";

  if (documentInfo.value.isTemp) {
    // 新增
    response = isFolderNode
      ? await createFolder({
          title: documentInfo.value.title,
          parentId: documentInfo.value.parentId,
          domainId: documentInfo.value.domainId,
          logo: documentInfo.value.logo,
        })
      : await createDocument({
          title: documentInfo.value.title,
          folderId: documentInfo.value.parentId,
          logo: documentInfo.value.logo,
          content: "",
          domainId: documentInfo.value.domainId,
        });
    if (response.code === 200) {
      documentInfo.value.id = response.data.id;
      documentInfo.value.isTemp = false;
    }
  } else {
    // 更新
    response = isFolderNode
      ? await updateFolder({
          id: documentInfo.value.id,
          title: documentInfo.value.title,
          parentId: documentInfo.value.parentId,
          domainId: documentInfo.value.domainId,
          logo: documentInfo.value.logo,
        })
      : await updateDocument({
          id: documentInfo.value.id,
          title: documentInfo.value.title,
          folderId: documentInfo.value.parentId,
          logo: documentInfo.value.logo,
          domainId: documentInfo.value.domainId,
        });
  }

  if (response?.code === 200) {
    ElMessage({ message: successMsg, type: "success" });
  } else {
    ElMessage({ message: failMsg, type: "error" });
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