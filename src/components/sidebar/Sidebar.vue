<template>
  <div class="sidebar-container" :style="{ width: containerWidth }">
    <div class="sidebar-wrapper" ref="wrapperRef">
      <div class="logo-area" @click="handleLogoClick">
        <img src="/logo.svg" alt="logo" class="logo" />
        <div class="highlight">西木笔记</div>
      </div>
      <div class="quick-area">
        <!-- 快捷操作区域内容 -->
        <!-- <QuickArea /> -->
      </div>
      <div class="document-area">
        <!-- <div class="search-area">
          <el-input v-model="searchContent" size="large" placeholder="Please Input" :suffix-icon="Search" />
        </div> -->
        <div class="domain-area">
          <div class="domain-item" v-for="domain in domainTree" :key="domain.domainName">
            <div class="domain-item-content">
              <p>{{ domain.domainName }}</p>
              <span class="option-add" @click="addFolder(domain.domainId)">
                <el-icon :size="12">
                  <Plus color="#868684"/>
                </el-icon>
              </span>
            </div>
            <div class="note-list">
              <NoteItem v-for="node in domain.nodeList" :key="node.id" :item="node" />
            </div>
          </div>
        </div>
      </div>
      <div class="user-area">
        <!-- 用户区域内容 -->
        <UserArea />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { NodeType } from "@/enums/NodeType";
import NoteItem from "@/components/sidebar/NodeItem.vue";
import UserArea from "@/components/sidebar/UserArea.vue";
import { Search, Plus } from "@element-plus/icons-vue";
import { useDomainStore } from "@/stores/domainStore";
import { useDocumentStore } from "@/stores/documentStore";
import { createFolder } from "@/api/folder";

const searchContent = ref("");

const domainStore = useDomainStore();
const documentStore = useDocumentStore();

const domainTree = computed(() => domainStore.getDomainTree());

// 侧边栏宽度动画逻辑
const wrapperRef = ref(null);
const containerWidth = ref("240px");
let resizeObserver = null;

// 处理logo点击事件
const handleLogoClick = () => {
  // 切换侧边栏展开状态
  documentStore.reset();
  console.log("documentStore:", documentStore);
};

const updateWidth = () => {
  if (wrapperRef.value) {
    const contentWidth = wrapperRef.value.scrollWidth;
    const maxWidth = window.innerWidth * 0.3; // 30vw
    const minWidth = 240;
    let newWidth = Math.max(minWidth, contentWidth);
    
    // 限制最大宽度，但如果内容本身就很宽，可能需要截断或者允许滚动
    // 这里我们按照要求限制在 30vw
    if (newWidth > maxWidth) {
      newWidth = maxWidth;
    }
    
    containerWidth.value = `${newWidth}px`;
  }
};

onMounted(() => {
  if (wrapperRef.value) {
    resizeObserver = new ResizeObserver(() => {
      // 使用 requestAnimationFrame 避免 loop limit exceeded 错误
      requestAnimationFrame(updateWidth);
    });
    resizeObserver.observe(wrapperRef.value, { box: 'border-box' });
    // 同时监听 document-area 的子元素变化可能更准确，但 wrapper 整体变化也行
  }
  window.addEventListener('resize', updateWidth);
});

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
  window.removeEventListener('resize', updateWidth);
});

// 新增文件夹（域根）
const addFolder = async (domainId) => {
  // const newItem = {
  //   id: `tmp_${Date.now()}`,
  //   title: "新建文件夹",
  //   type: NodeType.FOLDER,
  //   logo: "📂",
  //   depth: 0,
  //   parentId: null,
  //   domainId: domainId,
  //   child: [],
  //   isTemp: true,
  // };
  // folderStore.addFolder(domainId, newItem);

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
  const response = await createFolder({
    title: newItem.title,
    parentId: newItem.parentId,
    domainId: newItem.domainId,
    logo: newItem.logo,
  });
  if (response.code === 200) {
    newItem.id = response.data.id;
  }

  // 同步到 Store，保持全局一致
  domainStore.addNode(newItem);
};

const addFolderNode = () => {
  console.log("新建目录");

};

</script>

<style scoped lang="scss">
.sidebar-container {
  width: 240px; // 初始宽度
  min-width: 240px;
  max-width: 100%;
  height: 100vh; // 固定侧边栏高度为视口高度
  overflow: hidden; // 外层不出现滚动条
  background-color: #ffffff;
  border-right: 1px solid rgb(233 236 239 / 1);
  transition: width 0.3s ease-in-out; // 添加过渡效果

  // ::after, ::before {
  //   box-sizing: border-box;
  //   border-width: 0;
  //   border-style: solid;
  //   border-color: #e5e7eb;
  // }

  .sidebar-wrapper {
    min-width: 240px;
    width: fit-content; // 让内容撑开宽度
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
  }

  .logo-area {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: nowrap;
    cursor: pointer;
    gap: 10px;
    padding: 24px;
    transition: transform 0.3s ease;

    .logo {
      width: 40px;
      height: 40px;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
    }

    .highlight {
      font-size: 1.5rem;
      -webkit-background-clip: text;
      background-clip: text;
      color: #5f5f5b;
      font-weight: 600;
    }
  }

  .document-area {
    flex: 1;
    min-height: 0; // 允许子元素在 flex 容器内正确溢出
    overflow: auto; // 仅中间区域可滚动
    scrollbar-width: none; // Firefox 隐藏滚动条
    -ms-overflow-style: none; // IE/Edge 隐藏滚动条
    padding: 0 16px ;
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
        height: 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 5px;
        padding: 0 12px;

        p {
          color: #8e8e93;
          font-size: 0.75rem;
          line-height: 1rem;
          font-weight: 600;
          margin: 0;
        }

        .option-add {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 5px;
          cursor: pointer;
          opacity: 0;
          /* 默认隐藏 */
          transition: opacity 0.2s ease;
          /* 添加过渡效果 */
        }

        &:hover {
          .option-add {
            opacity: 1;
            /* 鼠标悬停时显示 */
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
    // background-color: #fcfcfd;
    z-index: 1;
    // 用户区域样式
  }
}
</style>