<template>
  <div class="user-container">
    <el-popover
      v-model:visible="popoverVisible"
      placement="top-start"
      :width="260"
      trigger="click"
      popper-class="user-popover-popper"
      :show-arrow="true"
      :offset="12"
    >
      <template #reference>
        <div class="user-info-area">
          <div class="user-info-avatar">
            <el-avatar shape="circle" :size="36" :src="userInfo.avatarUrl" />
          </div>
          <div class="user-info-message">
            <span class="user-name">{{ userInfo.username }}</span>
            <span class="server-addr">
              <span class="status-dot"></span>
              {{ userInfo.serverAddress }}
            </span>
          </div>
          <div class="user-more">
            <el-icon :size="14"><CaretTop /></el-icon>
          </div>
        </div>
      </template>

      <!-- 弹出面板内容 -->
      <div class="popover-user-card">
        <!-- 头部大卡片 -->
        <div class="card-header">
          <el-avatar :size="48" :src="userInfo.avatarUrl" />
          <div class="card-user-info">
            <div class="card-username">{{ userInfo.username }}</div>
            <div class="card-server">
              <span class="status-dot pulsing"></span>
              在线 | {{ userInfo.serverAddress }}
            </div>
          </div>
        </div>

        <!-- 中间统计面板 -->
        <div class="card-stats">
          <div class="stats-item">
            <span class="stats-icon">📄</span>
            <div class="stats-detail">
              <span class="stats-label">笔记</span>
              <span class="stats-value">{{ docStats.noteCount }}</span>
            </div>
          </div>
          <div class="stats-item">
            <span class="stats-icon">📝</span>
            <div class="stats-detail">
              <span class="stats-label">字数</span>
              <span class="stats-value">{{ formatWordCount(docStats.wordCount) }}</span>
            </div>
          </div>
          <div class="stats-item">
            <span class="stats-icon">🔖</span>
            <div class="stats-detail">
              <span class="stats-label">书签</span>
              <span class="stats-value">{{ docStats.bookmarkCount }}</span>
            </div>
          </div>
        </div>

        <el-divider class="card-divider" />

        <!-- 操作按钮列表 -->
        <div class="card-actions">
          <div class="action-item" @click="handleOpenSettings">
            <el-icon :size="16"><Setting /></el-icon>
            <span class="action-text">个人设置</span>
          </div>
          <div class="action-item logout" @click="handleLogout">
            <el-icon :size="16"><SwitchButton /></el-icon>
            <span class="action-text">退出登录</span>
          </div>
        </div>
      </div>
    </el-popover>
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
import { Setting, SwitchButton, CaretTop } from "@element-plus/icons-vue";

// 用户信息
const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);

// 路由
const router = useRouter();

// 浮动面板显示状态
const popoverVisible = ref(false);

// 文档统计信息
const docStats = ref({
  noteCount: 42,
  wordCount: 12345,
  bookmarkCount: 7
});

// 用户设置组件引用
const userSettingsRef = ref(null);

// 格式化字数
const formatWordCount = (count) => {
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'k';
  }
  return count;
};

// 打开设置弹出框
const handleOpenSettings = () => {
  popoverVisible.value = false;
  userSettingsRef.value.open();
};

// 注销逻辑
const handleLogout = async () => {
  popoverVisible.value = false;
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

<style lang="scss">
/* 全局样式覆盖 Element Plus Popover */
.el-popover.user-popover-popper {
  padding: 0 !important;
  border-radius: 12px !important;
  border: 1px solid rgba(228, 228, 231, 0.8) !important;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.08) !important;
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(8px) !important;
}
</style>

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
  padding: 8px 12px;
  box-sizing: border-box;

  .user-info-area {
    display: flex;
    align-items: center;
    padding: 8px 10px;
    border-radius: 8px;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    user-select: none;
    background-color: transparent;
    border: 1px solid transparent;

    &:hover {
      background-color: rgba(244, 244, 245, 0.9);
      border-color: rgba(228, 228, 231, 0.6);
      box-shadow: 0 2px 8px -2px rgba(0, 0, 0, 0.04);

      .user-more {
        opacity: 0.8;
        transform: translateY(0);
      }
    }

    &:active {
      background-color: rgba(228, 228, 231, 0.8);
      transform: scale(0.98);
    }

    .user-info-avatar {
      height: 36px;
      display: flex;
      align-items: center;
      flex-shrink: 0;
      
      .el-avatar {
        transition: transform 0.3s ease;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
      }
    }
    
    &:hover .user-info-avatar .el-avatar {
      transform: scale(1.05);
    }

    .user-info-message {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 2px;
      margin-left: 10px;
      min-width: 0;
      flex: 1;

      .user-name {
        font-size: 13.5px;
        font-weight: 600;
        color: #1f2937;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
        letter-spacing: -0.01em;
      }

      .server-addr {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        background-color: rgba(244, 244, 245, 1);
        font-size: 10px;
        border-radius: 4px;
        padding: 1px 6px;
        color: #71717a;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
        font-weight: 500;

        .status-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background-color: #10b981;
        }
      }
    }

    .user-more {
      margin-left: 6px;
      display: flex;
      align-items: center;
      color: #9ca3af;
      opacity: 0.4;
      transform: translateY(1px);
      transition: all 0.2s ease;
      flex-shrink: 0;
    }
  }
}

/* 弹出卡片样式 */
.popover-user-card {
  padding: 16px;
  display: flex;
  flex-direction: column;
  user-select: none;

  .card-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;

    .el-avatar {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      border: 1.5px solid #ffffff;
    }

    .card-user-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;

      .card-username {
        font-size: 15px;
        font-weight: 700;
        color: #111827;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .card-server {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 11px;
        color: #6b7280;

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #10b981;
          
          &.pulsing {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
            animation: pulse 2s infinite;
          }
        }
      }
    }
  }

  /* 统计面板 */
  .card-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    background: rgba(244, 244, 245, 0.6);
    border-radius: 8px;
    padding: 10px 8px;
    margin-bottom: 12px;

    .stats-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      text-align: center;

      .stats-icon {
        font-size: 14px;
      }

      .stats-detail {
        display: flex;
        flex-direction: column;
        line-height: 1.2;

        .stats-label {
          font-size: 10px;
          color: #9ca3af;
        }

        .stats-value {
          font-size: 12.5px;
          font-weight: 700;
          color: #374151;
          margin-top: 1px;
        }
      }
    }
  }

  .card-divider {
    margin: 4px 0 10px 0 !important;
    border-color: rgba(228, 228, 231, 0.6) !important;
  }

  /* 操作列表 */
  .card-actions {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .action-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 13px;
      color: #4b5563;
      cursor: pointer;
      transition: all 0.15s ease;

      .el-icon {
        color: #9ca3af;
        transition: color 0.15s ease;
      }

      &:hover {
        background-color: rgba(244, 244, 245, 1);
        color: #1f2937;

        .el-icon {
          color: #4b5563;
        }
      }

      &:active {
        background-color: rgba(228, 228, 231, 1);
      }

      &.logout {
        color: #ef4444;

        .el-icon {
          color: rgba(239, 68, 68, 0.6);
        }

        &:hover {
          background-color: #fef2f2;
          color: #dc2626;

          .el-icon {
            color: #dc2626;
          }
        }

        &:active {
          background-color: #fee2e2;
        }
      }
    }
  }
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
  }
  
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 5px rgba(16, 185, 129, 0);
  }
  
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
  }
}
</style>