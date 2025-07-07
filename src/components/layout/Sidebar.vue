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
          v-for="domain in folderStore.getDomainList()"
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
import { onMounted, ref } from "vue";
import { NodeType } from "@/enums/NodeType";
import NoteItem from "@/components/common/sidebar/NodeItem.vue";
import UserArea from "@/components/common/sidebar/UserArea.vue";
import { useBreadcrumbStore } from "@/stores/breadcrumbStore";
import { useFolderStore } from "@/stores/folderStore";
import { Search } from "@element-plus/icons-vue";
import { getDirInfo } from "@/api/folder";

const searchContent = ref("");
const breadcrumbStore = useBreadcrumbStore();
const folderStore = useFolderStore();

onMounted(() => {
  initDomainList();
  // 初始化面包屑store的notes数据
  breadcrumbStore.setFlatNotes(folderStore.getDomainList());
});

// 测试数据
let format = [
  {
    domainName: "笔记",
    documents: [
      {
        id: "J6G4FU0FDS6AJGFR877EJ7F43SCFG123",
        title: "工作笔记",
        logo: "📂",
        type: "folder",
        depth: 0,
        parentId: null,
        child: [],
      },
    ],
  },
];

// 笔记目录列表初始化
async function initDomainList() {
  // TODO 动态获取用户id
  let response = await getDirInfo({ userId: 2 });
  folderStore.setDomainList(response.data.domainFolderTreeList);
}

// 新增文件夹
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
    isTemp: true, // 用于标记是否为临时项
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
  height: 100vh;
  padding: 10px;
  box-sizing: border-box;
  background-color: #f8f8f7;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .main-content {
    flex-grow: 1;
    .search-area {
      margin-bottom: 20px;
    }

    .domain-area {
      max-height: 80vh;
      overflow: auto;
      scrollbar-width: none; // Firefox 隐藏滚动条
      -ms-overflow-style: none; // IE/Edge 隐藏滚动条

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

      // &::-webkit-scrollbar {
      //   width: 8px;
      //   height: 8px;
      //   background: transparent;
      //   opacity: 0; // 初始隐藏
      //   transition: opacity 0.3s;
      // }

      // &::-webkit-scrollbar-thumb {
      //   background-color: rgba(0, 0, 0, 0.3);
      //   border-radius: 4px;
      // }

      // &:hover {
      //   &::-webkit-scrollbar {
      //     opacity: 1; // 鼠标悬停时显示滚动条
      //   }
      // }
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
    padding-top: 20px;
    border-top: 1px solid #ddd;
    // 用户区域样式
  }
}
</style>