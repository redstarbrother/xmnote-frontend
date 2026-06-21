<template>
  <div class="main-container">
    <Content />
  </div>
</template>

<script setup>
import Content from "@/components/content/Content.vue";
</script>

<style lang="scss">
.main-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  align-items: center;
  overflow: hidden;
}
</style>
