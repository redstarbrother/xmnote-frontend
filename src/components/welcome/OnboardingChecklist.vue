<template>
  <section class="card">
    <div class="header">
      <div class="icon-wrapper">
        <el-icon><School /></el-icon>
      </div>
      <h3>新手指南</h3>
    </div>
    <ul class="checklist">
      <li v-for="(item, index) in listItems" :key="index">
        {{ item }}
      </li>
    </ul>
  </section>
</template>


<script setup>
import { School } from '@element-plus/icons-vue'
import { ref } from 'vue'

const listItems = ref([
  '创建第一个文档',
  '建立一个文件夹',
  '尝试一个模板'
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
  background: #fef0e6;
  border-radius: 10px;
  color: #fa8c16;
  font-size: 18px;
}

.checklist {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;

  li {
    position: relative;
    padding-left: 18px;
    color: #4b5563;
    font-size: 14px;
    line-height: 1.4;
    font-weight: 500;

    &::before {
      content: '';
      position: absolute;
      left: 4px;
      top: 8px;
      width: 5px;
      height: 5px;
      background-color: #fa8c16;
      border-radius: 50%;
    }
  }
}
</style>
