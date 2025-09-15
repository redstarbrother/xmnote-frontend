<template>
  <div class="login-container">
    <div class="form-container">
      <div class="login-header">
        <h1>西木笔记</h1>
      </div>
      <div class="login-form">
        <el-input v-model="loginIdentifier" placeholder="请输入手机号/邮箱"></el-input>
        <el-input
          v-model="password"
          placeholder="请输入密码"
          type="password"
          @keyup.enter="handleLogin"
        ></el-input>
        <el-button type="primary" @click="handleLogin">登录</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { login } from "@/api/auth";
import { useRouter } from "vue-router";
import { LoginType } from "@/enums/LoginType";

const router = useRouter();

const loginIdentifier = ref("");
const password = ref("");
const loginType = ref(LoginType.PASSWORD);

const handleLogin = async () => {
  console.log(loginIdentifier.value, password.value);
  if (!loginIdentifier.value || !password.value) {
    ElMessage.error("手机号/邮箱和密码不能为空");
    return;
  }
  try {
    const res = await login({
      principal: loginIdentifier.value,
      credential: password.value,
      loginType: loginType.value,
    });
    if (res.code === 200) {
      ElMessage.success("登录成功");
      localStorage.setItem('token', res.data.token);
      router.push("/note");
    }
  } catch (error) {
    
  }
};
</script>

<style lang="scss" scoped>
.login-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;

  .form-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding: 50px 100px;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

    .login-header {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .el-input {
        margin-top: 10px;
      }
      .el-button {
        margin-top: 10px;
      }
    }
  }
}
</style>