<template>
  <div class="login-root">
    <transition name="fade">
      <div v-if="!isRegister" class="login-container">
        <LoginCard @login="handleLogin" v-model:isRegister="isRegister" />
      </div>
      <div v-else class="register-container">
        <RegisterCard
          @register="handleRegister"
          v-model:isRegister="isRegister"
        />
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from "vue";
import LoginCard from "@/components/common/login/LoginCard.vue";
import RegisterCard from "@/components/common/login/RegisterCard.vue";
import { login } from "@/api/auth";
import { setBaseUrl } from "@/api/request";
import router from "@/router";
import { ElMessage } from "element-plus";

const isRegister = ref(false);

const handleLogin = (loginForm) => {
  if (loginForm.isPrivate) {
    // 检查私有服务器是否存在
    if (!checkPrivateServer(loginForm.serverAddr)) {
      // 私有服务器不存在，提示用户
      ElMessage.error("私有服务器连接失败！");
      return;
    }
    // 修改request对象，重置baseURL
    setBaseUrl(loginForm.serverAddr);
  } else {
    // 重置为默认的 baseURL
    setBaseUrl(import.meta.env.VITE_API_BASE_URL);
  }
  // 构建登录请求对象
  var loginReq = {
    principal: loginForm.principal,
    credential: loginForm.credential,
    loginType: loginForm.loginType.toUpperCase(),
  };
  login(loginReq).then((res) => {
    ElMessage.success("登录成功！");
    // 登录成功，保存token
    localStorage.setItem("token", res.data.token);
    // 登录成功，跳转到首页
    router.push({ name: "note" });
  });
};

const checkPrivateServer = (serverAddr) => {
  // TODO 检查私有服务器是否存在
  return true;
};
</script>

<style lang="scss" scoped>
.login-root {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  .login-container,
  .register-container {
    width: 400px;
    // height: 400px;
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>