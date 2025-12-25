<template>
  <section class="card">
    <div class="header">
      <div class="icon-wrapper">
        <el-icon><Monitor /></el-icon>
      </div>
      <h3>快捷键速览</h3>
    </div>
    <div class="list">
      <div class="item" v-for="(item, index) in shortcuts" :key="index">
        <div class="keys">
          <span class="key-box">Ctrl/Cmd</span>
          <span class="key-box">{{ item.key }}</span>
        </div>
        <span class="label">{{ item.desc }}</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Monitor } from '@element-plus/icons-vue'
import { ref } from 'vue'

const shortcuts = ref([
  { key: 'N', desc: '新建文档' },
  { key: 'K', desc: '全局搜索' },
  { key: 'S', desc: '保存内容' },
  { key: 'E', desc: '编辑/预览切换' }
])
</script>

<style scoped lang="scss">
.card {
  background: #fff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
  height: 100%;
  box-sizing: border-box;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  }
}

.header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;

  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    color: #1a1a1a;
  }
}

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  background: #ecf5ff;
  border-radius: 10px;
  color: #409eff;
  font-size: 18px;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.keys {
  display: flex;
  gap: 4px;
}

.key-box {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 3px 6px;
  font-size: 12px;
  color: #64748b;
  min-width: 22px;
  text-align: center;
  font-weight: 500;
}

.label {
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
}
</style>
