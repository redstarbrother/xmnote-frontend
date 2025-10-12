<template>
  <section class="hero">
    <div class="brand">
      <img src="/favicon.ico" alt="logo" class="logo" />
      <h1>欢迎使用 <span class="highlight">西木笔记</span></h1>
    </div>
    <p class="subtitle">高效记录灵感，轻松组织知识</p>
    <div class="cta-row">
      <el-button type="primary" :icon="Plus" round disabled>
        新建文档
      </el-button>
      <el-button :icon="Collection" round disabled>
        浏览模板
      </el-button>
    </div>
  </section>
</template>

<script setup>
import { Plus, Collection } from '@element-plus/icons-vue';
</script>

<style scoped lang="scss">
.hero {
  width: 100%;
  max-width: 800px;
  text-align: center;
  margin: 6vh auto 4vh;
  padding: 0 20px;
}

.brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .logo {
    width: 56px;
    height: 56px;
    margin-bottom: 16px;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
    transition: transform 0.3s ease;
    
    &:hover {
      transform: scale(1.05);
    }
  }
  
  h1 {
    font-size: 32px;
    font-weight: 600;
    margin: 0;
    color: #303133;
    letter-spacing: -0.5px;
    
    .highlight {
      background: linear-gradient(90deg, #409EFF, #67C23A);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      font-weight: 700;
    }
  }
}

.subtitle {
  margin: 16px 0;
  font-size: 18px;
  color: #606266;
  font-weight: 400;
  max-width: 80%;
  margin-left: auto;
  margin-right: auto;
}

.cta-row {
  margin-top: 24px;
  display: flex;
  justify-content: center;
  gap: 16px;
  
  .el-button {
    padding: 12px 24px;
    font-size: 16px;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    
    &:not(:disabled):hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  }
}

@media (max-width: 768px) {
  .hero {
    margin: 4vh auto 3vh;
  }
  
  .brand h1 {
    font-size: 28px;
  }
  
  .subtitle {
    font-size: 16px;
    max-width: 90%;
  }
  
  .cta-row {
    flex-direction: column;
    align-items: center;
    gap: 12px;
    
    .el-button {
      width: 80%;
      max-width: 240px;
    }
  }
}
</style>