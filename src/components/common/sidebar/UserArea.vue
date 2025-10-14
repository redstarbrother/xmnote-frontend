<template>
  <div class="user-container">
    <div class="user-info-area">
      <div class="user-info-avatar">
        <el-avatar shape="square" :size="50" :src="userInfo.avatarUrl" />
      </div>
      <div class="user-info-message">
        <span class="user-name">{{ userInfo.username }}</span>
        <span class="server-addr">{{ userInfo.serverAddress }}</span>
      </div>
    </div>
    <!-- <div v-if="showDocInfo" class="doc-info-area">
      <span class="count-info">📄 笔记：{{ docStats.noteCount }}</span>
      <span class="count-info">🔢 字数：{{ docStats.wordCount }}</span>
      <span class="count-info">🔖 书签：{{ docStats.bookmarkCount }}</span>
    </div> -->
    <div class="options-area">
      <el-button link type="primary" class="option-btn" @click="showStats">📊 数据统计</el-button>
      <el-button link type="primary" class="option-btn" @click="openSettings">⚙️ 设置</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { useUserStore } from "@/stores/userStore"; // 假设有一个用户状态管理

// 从状态管理获取用户信息
const userStore = useUserStore();
const userInfo = reactive({
  username: computed(() => userStore.username || "未登录用户"),
  avatarUrl: computed(() => userStore.avatarUrl || "https://avatars.githubusercontent.com/u/45450994?v=4&size=64"),
  serverAddress: computed(() => userStore.serverAddress || "localhost")
});

// 文档统计信息
const showDocInfo = ref(true); // 控制是否显示文档信息区域
const docStats = reactive({
  noteCount: 23,
  wordCount: 65842,
  bookmarkCount: 18
});

// 功能按钮事件处理
const showStats = () => {
  // 实现显示统计数据的逻辑
  console.log("显示统计数据");
};

const openSettings = () => {
  // 实现打开设置的逻辑
  console.log("打开设置");
};
</script>

<style lang="scss" scoped>
// 使用CSS变量定义主题颜色和间距
:root {
  --text-primary: #333;
  --text-secondary: #999;
  --spacing-sm: 5px;
  --spacing-md: 10px;
}

.user-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: var(--spacing-sm);
  
  .user-info-area {
    display: flex;
    align-items: center;
    padding: 8px;
    border-radius: 8px;
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
      background-color: rgba(112, 108, 108, 0.10);
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(166, 166, 166, 0.1);
    }

    .user-info-avatar {
      // display: inline-block;
      height: 50px;
    }

    .user-info-message {
      height: 100%;
      display: flex;
      flex-wrap: wrap;
      align-content: space-around;
      margin-left: 10px;
      
      .user-name {
        width: 100%;
        font-size: 20px;
        font-weight: bold;
        margin-left: var(--spacing-md);
        color: var(--text-primary);
      }
      
      .server-addr {
        width: 100%;
        color: var(--text-secondary);
        font-size: 13px;
        margin-left: var(--spacing-md);
      }
    }
  }
  
  .doc-info-area {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin-top: var(--spacing-sm);
    
    .count-info {
      width: 100%;
      font-size: 14px;
      margin-top: 6px;
      color: var(--text-primary);
    }
  }
  
  .options-area {
    display: flex;
    align-items: center;
    margin-top: var(--spacing-sm);
    
    .option-btn {
      font-size: 14px;
      margin-right: var(--spacing-md);
      
      &:last-child {
        margin-right: 0;
      }
    }
  }
}

// 添加响应式设计
@media (max-width: 768px) {
  .user-container {
    .user-info-area {
      flex-direction: column;
      
      .user-info-message {
        margin-top: var(--spacing-sm);
        text-align: center;
        
        .user-name, .server-addr {
          margin-left: 0;
        }
      }
    }
  }
}
</style>