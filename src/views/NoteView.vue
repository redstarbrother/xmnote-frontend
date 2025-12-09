<template>
  <div class="home">
    <el-container>
      <el-aside width="15vw" height="100vh">
        <Sidebar />
      </el-aside>
      <el-container>
        <el-header>
          <Header />
        </el-header>
        <el-main>
          <Main />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import Sidebar from '@/components/layout/Sidebar.vue';
import Header from '@/components/layout/Header.vue';
import Main from '@/components/layout/Main.vue';
import { useDomainStore } from '@/stores/domainStore';
import { getDomainTree } from '@/api/folder';
import { getUserIdFromToken } from '@/utils/jwtUtil';

const domainStore = useDomainStore();

onMounted(async () => {
  const userId = getUserIdFromToken();
  if (!userId) {
    console.error("User ID not found in token");
    return;
  }
  const response2 = await getDomainTree({ userId });
  domainStore.init(response2.data);
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

  .el-aside {
    height: 100vh; // 固定侧边栏为视口高度
    overflow: hidden; // 禁止外层滚动条出现
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