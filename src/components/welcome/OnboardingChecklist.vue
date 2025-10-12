<template>
  <section class="card">
    <h3>新手指南</h3>
    <ul>
      <li>
        <el-checkbox v-model="steps.createDoc" disabled>创建第一个文档</el-checkbox>
      </li>
      <li>
        <el-checkbox v-model="steps.createFolder" disabled>建立一个文件夹</el-checkbox>
      </li>
      <li>
        <el-checkbox v-model="steps.tryTemplate" disabled>尝试一个模板</el-checkbox>
      </li>
      <li>
        <el-checkbox v-model="steps.share" disabled>邀请协作或分享</el-checkbox>
      </li>
      <li>
        <el-checkbox v-model="steps.tag" disabled>给文档添加标签</el-checkbox>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { reactive } from 'vue';

const steps = reactive({
  createDoc: false,
  createFolder: false,
  tryTemplate: false,
  share: false,
  tag: false,
});
</script>

<style scoped lang="scss">
.card {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 16px;
}

h3 {
  margin: 0 0 12px 0;
  font-size: 16px;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 8px;
}
</style>