<template>
  <div class="user-container">
    <div class="user-info-area">
      <div class="user-info-avatar">
        <el-avatar shape="square" :size="40" :src="userInfo.avatarUrl" />
      </div>
      <div class="user-info-message">
        <span class="user-name">{{ userInfo.username }}</span>
        <span class="server-addr">{{ userInfo.serverAddress }}</span>
      </div>
      <!-- 新增：右侧注销按钮 -->
      <div class="user-actions">
        <el-button link class="action-btn" @click.stop="openSettings" title="设置">
          <el-icon :size="20"><Setting /></el-icon>
        </el-button>
        <el-button link type="danger" class="action-btn" @click.stop="logout" title="注销">
          <el-icon :size="20"><SwitchButton /></el-icon>
        </el-button>
      </div>
    </div>
    <!-- <div v-if="showDocInfo" class="doc-info-area">
      <span class="count-info">📄 笔记：{{ docStats.noteCount }}</span>
      <span class="count-info">🔢 字数：{{ docStats.wordCount }}</span>
      <span class="count-info">🔖 书签：{{ docStats.bookmarkCount }}</span>
    </div> -->
    <!-- <div class="options-area">
      <el-button link type="primary" class="option-btn" @click="showStats">📊 数据统计</el-button>
      <el-button link type="primary" class="option-btn" @click="openSettings">⚙️ 设置</el-button>
    </div> -->
  </div>

  <!-- 引入设置组件 -->
  <UserSettings ref="userSettingsRef" />

</template>

<script setup>
import { ref, computed } from "vue";
import { useUserStore } from "@/stores/userStore";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import UserSettings from "@/components/common/settings/UserSettings.vue";
import { Setting, SwitchButton } from "@element-plus/icons-vue";

// 用户信息
const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);

// 路由
const router = useRouter();

// 文档统计信息
const showDocInfo = ref(true);
const docStats = ref({
  noteCount: 42,
  wordCount: 12345,
  bookmarkCount: 7
});

// 用户设置组件引用
const userSettingsRef = ref(null);

// 打开设置弹出框
const openSettings = () => {
  userSettingsRef.value.open();
};

// 显示统计信息
const showStats = () => {
  ElMessage({
    message: '统计功能正在开发中...',
    type: 'info'
  });
};

// 注销逻辑
const logout = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要注销并退出登录吗？',
      '确认注销',
      {
        confirmButtonText: '注销',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );
    // 清除本地 token
    localStorage.removeItem('token');
    // 更新用户状态
    userStore.logout();
    // 成功提示并跳转登录
    ElMessage({ message: '已注销并退出登录', type: 'success' });
    router.push('/login');
  } catch (e) {
    // 用户取消
  }
};
</script>

<style lang="scss" scoped>
// 设置弹出框样式
:deep(.settings-dialog) {
  .el-dialog__body {
    max-height: 70vh;
    overflow-y: auto;
  }
}

.user-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 8px 12px;

  .user-info-area {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    border-radius: 4px;
    transition: background-color 0.2s ease;
    cursor: pointer;
    user-select: none;

    &:hover {
      background-color: #f8f9fa;

      .user-actions {
        opacity: 1;
      }
    }

    &:active {
      background-color: #f0f0ef;
    }

    .user-actions {
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    .user-info-avatar {
      height: 40px;
      flex-shrink: 0;
    }

    .user-info-message {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
      margin-left: 10px;
      min-width: 0;
      flex: 1;

      .user-name {
        font-size: 14px;
        font-weight: 600;
        color: #3c3c39;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
      }

      .server-addr {
        background-color: #f0f0ef;
        font-size: 10px;
        border-radius: 4px;
        padding: 1px 6px;
        color: #8e8e93;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
      }
    }

    .user-actions {
      margin-left: auto;
      display: flex;
      align-items: center;
      flex-shrink: 0;

      .action-btn {
        padding: 4px;
        height: auto;
        margin-left: 0;
        color: #868684;

        &:hover {
          background-color: #e6e6e4;
          border-radius: 4px;
          color: #5f5f5b;
        }
      }
    }
  }
}
</style>