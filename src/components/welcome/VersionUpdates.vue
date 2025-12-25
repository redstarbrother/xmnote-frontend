<template>
  <section class="card">
    <div class="header">
      <div class="icon-wrapper">
        <el-icon><Place /></el-icon>
      </div>
      <h3>版本动态</h3>
    </div>
    <div class="content">
      <div class="date">2025年12月23日 更新</div>
      <p>新增 AI 智能纠错功能，极大提升内容润色效率。同时优化了移动端离线保存的稳定性。</p>
      <a href="#" class="link">查看完整日志 →</a>
    </div>
  </section>
</template>

<script setup>
import { Place } from '@element-plus/icons-vue'
</script>

<style scoped lang="scss">
.card {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
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
  margin-bottom: 20px;

  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 700;
    color: #1a1a1a;
  }
}

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: #ecf5ff;
  border-radius: 10px;
  color: #409eff;
  font-size: 20px;
}

.content {
  .date {
    color: #409eff;
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 12px;
  }

  p {
    color: #4b5563;
    font-size: 14px;
    line-height: 1.6;
    margin: 0 0 16px 0;
  }

  .link {
    color: #409eff;
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
