<template>
  <div class="home">
    <el-container>
      <el-aside width="15vw">
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
import { onMounted } from "vue";
import Sidebar from '@/components/layout/Sidebar.vue';
import Header from '@/components/layout/Header.vue';
import Content from '@/components/layout/Content.vue';
import Footer from '@/components/layout/Footer.vue';
import { useFolderStore } from '@/stores/folderStore';
import { getDirInfo } from '@/api/folder';
import { getUserIdFromToken } from '@/utils/jwtUtil';

const folderStore = useFolderStore();

onMounted(async () => {
  const userId = getUserIdFromToken();
  if (!userId) {
    console.error("User ID not found in token");
    return;
  }
  const response = await getDirInfo({ userId });
  folderStore.setDomainList(response.data.domainFolderTreeList);
});
</script>

<style scoped lang="scss">
.home {
  background-color: #ffffff;
  height: 100vh;
  width: 100%;
  overflow: hidden;

  .el-container {
    height: 100%;
  }

  .el-main {
    padding: 4vh 2vw 0 2vw;
    overflow: hidden;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
}
</style>