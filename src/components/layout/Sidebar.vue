<template>
  <div class="sidebar-container">
    <div class="main-content">
      <div class="search-area">
        <el-input
          v-model="searchContent"
          size="large"
          placeholder="Please Input"
          :suffix-icon="Search"
        />
      </div>
      <div class="domain-area">
        <div
          class="domain-item"
          v-for="domain in domainList"
          :key="domain.domainName"
        >
          <div class="domain-item-content">
            <p>{{ domain.domainName }}</p>
            <span class="option-add" @click="addFolder(domain.domainId)">
              <el-icon>
                <Plus color="#868684" />
              </el-icon>
            </span>
          </div>
          <div class="note-list">
            <NoteItem
              v-for="node in domain.nodeList"
              :key="node.id"
              :item="node"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="user-area">
      <!-- 用户区域内容 -->
      <UserArea />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { NodeType } from "@/enums/NodeType";
import NoteItem from "@/components/common/sidebar/NodeItem.vue";
import UserArea from "@/components/common/sidebar/UserArea.vue";
import { useFolderStore } from "@/stores/folderStore";
import { Search, Plus } from "@element-plus/icons-vue";

const searchContent = ref("");
const folderStore = useFolderStore();

// 使用派生树视图
const domainList = computed(() => folderStore.getDomainTrees());

// 新增文件夹（域根）
const addFolder = (domainId) => {
  const newItem = {
    id: `tmp_${Date.now()}`,
    title: "新建文件夹",
    type: NodeType.FOLDER,
    logo: "📂",
    depth: 0,
    parentId: null,
    domainId: domainId,
    child: [],
    isTemp: true,
  };
  folderStore.addFolder(domainId, newItem);
};

const addFolderNode = () => {
  console.log("新建目录");

};

</script>

<style scoped lang="scss">
.sidebar-container {
  width: 100%;
  height: 100vh; // 固定侧边栏高度为视口高度
  overflow: hidden; // 外层不出现滚动条
  padding: 10px;
  box-sizing: border-box;
  background-color: #f8f8f7;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .main-content {
    flex: 1;
    min-height: 0; // 允许子元素在 flex 容器内正确溢出
    overflow: auto; // 仅中间区域可滚动
    scrollbar-width: none; // Firefox 隐藏滚动条
    -ms-overflow-style: none; // IE/Edge 隐藏滚动条

    // WebKit 隐藏滚动条
    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }

    .search-area {
      position: sticky;
      top: 0;
      z-index: 1;
      background-color: #f8f8f7;
      padding-bottom: 10px;
      margin-bottom: 10px;
    }

    .domain-area {
      // 使用父容器滚动，避免自身滚动条

      .domain-item-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        p {
          color: #91918e;
        }
        .option-add {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 5px;
          cursor: pointer;
          opacity: 0; /* 默认隐藏 */
          transition: opacity 0.2s ease; /* 添加过渡效果 */
        }

        &:hover {
          .option-add {
            opacity: 1; /* 鼠标悬停时显示 */
          }
        }
      }

    }

    .note-area {
      margin-bottom: 20px;

      p {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 10px;
      }

      .note-list {
        // 笔记列表样式
      }
    }

    .blog-area {
      margin-bottom: 20px;
      // 博客区域样式
    }
  }

  .user-area {
    padding-top: 5px;
    border-top: 1px solid #ddd;
    background-color: #f8f8f7;
    z-index: 1;
    // 用户区域样式
  }
}
</style>