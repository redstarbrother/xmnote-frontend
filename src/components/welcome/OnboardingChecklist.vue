<template>
  <section class="card">
    <h3>新手指南</h3>
    <ul>
      <li>
        创建第一个文档
      </li>
      <li>
        建立一个文件夹
      </li>
      <li>
        尝试一个模板
      </li>
      <li>
        邀请协作或分享
      </li>
      <li>
        给文档添加标签
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