<template>
  <div class="home">
    <el-container>
      <el-aside width="auto">
        <Sidebar />
      </el-aside>
      <el-container>
        <div class="content-container" v-if="showContent">
          <el-header>
            <Header />
          </el-header>
          <el-main>
            <Main />
          </el-main>
        </div>
        <div class="content-container" v-else>
          <ContentWelcome />
        </div>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import Sidebar from '@/components/sidebar/Sidebar.vue';
import Header from '@/components/layout/Header.vue';
import Main from '@/components/layout/Main.vue';
import ContentWelcome from "@/components/welcome/ContentWelcome.vue";
import { useDomainStore } from '@/stores/domainStore';
import { getDomainTree } from '@/api/folder';
import { getUserIdFromToken } from '@/utils/jwtUtil';
import { useDocumentStore } from "@/stores/documentStore";

const documentStore = useDocumentStore();
const showContent = computed(() => documentStore.getDocumentId() !== "");

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
    width: 100%;
    background-color: #f8f9fa; 
    // display: flex;
    // justify-content: center;
    .content-container {
      width: 100%;
    }
  }

  .el-aside {
    height: 100vh; // 固定侧边栏为视口高度
    overflow: hidden; // 禁止外层滚动条出现
    max-width: 30vw;
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