<template>
  <section class="card">
    <h3>快捷键速览</h3>
    <div class="list">
      <div class="item"><span class="key">Ctrl/Cmd + N</span><span>新建文档</span></div>
      <div class="item"><span class="key">Ctrl/Cmd + K</span><span>搜索</span></div>
      <div class="item"><span class="key">Ctrl/Cmd + S</span><span>保存</span></div>
      <div class="item"><span class="key">Ctrl/Cmd + B</span><span>切换侧边栏</span></div>
      <div class="item"><span class="key">Ctrl/Cmd + E</span><span>编辑/预览切换</span></div>
    </div>
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

.list {
  display: grid;
  gap: 8px;
}

.item {
  display: flex;
  justify-content: space-between;
}

.key {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  background: #f5f5f5;
  border: 1px solid #eee;
  border-radius: 6px;
  padding: 2px 6px;
}
</style>