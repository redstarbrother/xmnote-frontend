<template>
  <div class="home">
    <el-container>
      <el-aside width="20vw">
        <Sidebar />
      </el-aside>
      <el-container>
        <el-header>
          <Header />
        </el-header>
        <el-main>
          <Content />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import Sidebar from '@/components/layout/Sidebar.vue';
import Header from '@/components/layout/Header.vue';
import Content from '@/components/layout/Content.vue';
</script>

<style scoped lang="scss">
.home {
  background-color: #ffffff;
  height: 100vh;
  width: 100vw;
}
</style>