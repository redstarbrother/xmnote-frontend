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
          <el-footer>
            <Footer />
          </el-footer>
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
import Footer from '@/components/layout/Footer.vue';
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
      height: 100%;
      display: flex;
      flex-direction: column;
      background-color: #fff;

      .el-header {
          border-bottom: 1px solid rgb(233, 236, 239);
      }
      .el-main {
        background-color: #f8f9fa;
      }
      .el-footer {
        display: flex;
        align-items: center;
        width: 100%;
        height: 40px;
        border-top: 1px solid rgb(233, 236, 239);
      }
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