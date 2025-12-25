<template>
  <div class="header-container">
    <div class="header-left">
      <span class="document-logo">{{ documentInfo.logo }}</span>
      <span class="document-title">{{ documentInfo.title }}.md</span>
    </div>
    <div v-if="documentId" class="header-right">
      <div v-if="saveStatus === 'unsaved'" class="save-status unsaved">未保存</div>
      <div v-else-if="saveStatus === 'saving'" class="save-status saving">
        <el-icon class="is-loading saving-spinner" aria-label="保存中">
          <Loading />
        </el-icon>
      </div>
      <div v-else class="save-status saved">已保存</div>
      <el-icon class="promotion-icon" aria-label="分享" @click="handleShare">
        <Promotion />
      </el-icon>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useDocumentStore } from '@/stores/documentStore'
import { useDomainStore } from '@/stores/domainStore'

const documentStore = useDocumentStore()
const domainStore = useDomainStore()
const saveStatus = computed(() => documentStore.getSaveStatus())
const documentId = computed(() => documentStore.getDocumentId())
const documentInfo = computed(() => domainStore.findNode(documentId.value))
const handleShare = () => {
  ElMessage.info('分享功能未开放')
}
</script>

<style scoped lang="scss">
.header-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .header-left {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-left: 20px;

    .document-logo {
      font-size: 16px;
      color: #606266;
    }

    .document-title {
      font-size: 16px;
      color: #606266;
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-right: 30px;
  }

  .save-status {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;

    &.unsaved {
      color: #d76e6e;
    }

    &.saving {
      color: #909399;
    }

    &.saved {
      color: #67c23a;
    }
  }

  .saving-spinner {
    font-size: 18px;
  }

  .promotion-icon {
    font-size: 20px;
    color: #606266;
    cursor: pointer;
    transition: color 0.2s ease;

    &:hover {
      color: #409eff;
    }
  }
}
</style>