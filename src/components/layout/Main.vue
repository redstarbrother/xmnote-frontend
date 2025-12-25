<template>
  <div class="main-container">
    <Content />
  </div>
</template>

<script setup>
import Content from "@/components/content/Content.vue";
</script>

<style lang="scss">
.main-container::-webkit-scrollbar {
  width: 8px !important;
  background-color: transparent !important;
}

.main-container::-webkit-scrollbar-thumb {
  background-color: #D3D1CB !important;
  border-radius: 4px !important;
  border: none !important;
}

.main-container::-webkit-scrollbar-track {
  background-color: transparent !important;
}

.main-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  align-items: center;
  overflow: auto; // 使容器可滚动
}
</style>
