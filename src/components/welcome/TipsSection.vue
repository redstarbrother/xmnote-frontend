<template>
  <section class="card">
    <h3>技巧与推荐</h3>
    <ul class="tips">
      <li>支持 Markdown 基本格式与代码块</li>
      <li>拖拽即可调整目录顺序</li>
      <li>图片可粘贴上传或拖拽到编辑器</li>
      <li>标题区支持 Emoji 作为文档图标</li>
    </ul>
  </section>
</template>

<script setup>
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

.tips {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 8px;
}
</style>