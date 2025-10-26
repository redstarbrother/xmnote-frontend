<template>
  <div class="login-container">
    <div class="form-container">
      <div class="login-header">
        <h1>西木笔记</h1>
      </div>

      <form class="login-form" @submit.prevent="handleLogin">
        <div class="form-item">
          <label class="form-label">账号</label>
          <input
            v-model="loginIdentifier"
            class="form-input"
            placeholder="请输入手机号/邮箱"
            type="text"
            autocomplete="username"
          />
        </div>
        <div class="form-item">
          <label class="form-label">密码</label>
          <input
            v-model="password"
            class="form-input"
            placeholder="请输入密码"
            type="password"
            autocomplete="current-password"
          />
        </div>
        <div class="form-item" v-if="isPrivateServer">
          <label class="form-label">私服地址</label>
          <input
            v-model="serverAddress"
            class="form-input"
            placeholder="请输入私服地址"
            type="text"
          />
        </div>
        <div class="form-item">
          <button type="submit" class="primary-btn">登录</button>
        </div>

        <div v-if="message" class="message" :class="messageType">{{ message }}</div>
      </form>

      <div class="login-options">
        <button class="option-btn success" @click="handleWeChatLogin">微信扫码登录</button>
        <button class="option-btn warning" @click="handlePrivateServerLogin">{{ isPrivateServer ? '公服登录' : '私服登录' }}</button>
      </div>
    </div>

    <!-- 微信扫码登录弹窗（自实现） -->
    <div v-if="wechatDialogVisible" class="modal-overlay" @click.self="wechatDialogVisible=false">
      <div class="modal">
        <div class="modal-title">微信扫码登录</div>
        <div class="wechat-qr">
          <div class="qr-placeholder"></div>
          <p>请使用微信扫描二维码登录</p>
        </div>
        <div class="modal-actions">
          <button class="plain-btn" @click="wechatDialogVisible=false">关闭</button>
        </div>
      </div>
    </div>

    <!-- 私服地址已迁移至主表单，点击“私服登录”后显示输入栏 -->
  </div>
</template>

<script setup>
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { login } from "@/api/auth";
import { useRouter } from "vue-router";
import { LoginType } from "@/enums/LoginType";
import { useUserStore } from "@/stores/userStore";
import { setBaseUrl } from "@/api/request";

const router = useRouter();

const loginIdentifier = ref("");
const password = ref("");
const loginType = ref(LoginType.PASSWORD);

// 轻量消息提示
const message = ref("");
const messageType = ref("error"); // 'error' | 'success'
// 修改为 Element Plus 消息
const setMessage = (text, type = "error") => {
  const validTypes = ["success", "warning", "info", "error"];
  const msgType = validTypes.includes(type) ? type : "error";
  if (text) {
    ElMessage({ message: text, type: msgType, showClose: true, duration: 3000 });
  }
  // 清空旧内联消息状态，避免重复显示
  message.value = "";
  messageType.value = msgType;
};

const handleLogin = async () => {
  if (!loginIdentifier.value || !password.value) {
    setMessage("手机号/邮箱和密码不能为空", "error");
    return;
  }
  if (isPrivateServer.value) {
    if (!serverAddress.value) {
      setMessage("请输入私服地址", "error");
      return;
    }
    userStore.updateServerAddress(serverAddress.value);
    setBaseUrl(serverAddress.value);
  }
  try {
    const res = await login({
      principal: loginIdentifier.value,
      credential: password.value,
      loginType: loginType.value,
    });
    if (res.code === 200) {
      setMessage("登录成功", "success");
      localStorage.setItem('token', res.data.token);
      router.push("/note");
    } else {
      setMessage(res.message || "登录失败", "error");
    }
  } catch (error) {
    setMessage("网络错误或服务器异常", "error");
  }
};

const userStore = useUserStore();
const wechatDialogVisible = ref(false);
const isPrivateServer = ref(false);
const serverAddress = ref("");

const handleWeChatLogin = () => {
  loginType.value = LoginType.WECHAT;
  wechatDialogVisible.value = true;
};

const handlePrivateServerLogin = () => {
  isPrivateServer.value = !isPrivateServer.value;
};

// 私服地址校验与应用逻辑已移入 handleLogin
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
    }

    .form-item {
      width: 320px;
      margin-top: 10px;
      display: flex;
      flex-direction: column;
    }

    .form-label {
      font-size: 14px;
      color: #555;
    }

    .form-input {
      margin-top: 8px;
      padding: 10px 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      outline: none;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }

    .form-input:focus {
      border-color: #4A7B9D;
      box-shadow: 0 0 0 3px rgba(74, 123, 157, 0.15);
    }

    .primary-btn {
      margin-top: 10px;
      width: 100%;
      padding: 10px 12px;
      border: none;
      border-radius: 6px;
      background-color: #4A7B9D;
      color: #fff;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .primary-btn:hover {
      background-color: #3d6d8a;
    }

    .message {
      width: 320px;
      margin-top: 12px;
      padding: 8px 10px;
      border-radius: 6px;
      font-size: 13px;
    }

    .message.error {
      background: #ffecec;
      color: #d93025;
      border: 1px solid #f5c2c7;
    }

    .message.success {
      background: #e6ffed;
      color: #1a7f37;
      border: 1px solid #a5d6a7;
    }

    .login-options {
      display: flex;
      gap: 12px;
      margin-top: 16px;
      justify-content: center;
    }

    .option-btn {
      padding: 8px 12px;
      border-radius: 6px;
      border: 1px solid #ddd;
      background: #fff;
      cursor: pointer;
      transition: background-color 0.2s ease, border-color 0.2s ease;
    }

    .option-btn:hover {
      background: #f5f5f5;
    }

    .option-btn.success {
      border-color: #3bb273;
      color: #2e7d32;
    }

    .option-btn.warning {
      border-color: #f5a623;
      color: #8a5a00;
    }
  }

  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal {
    width: 360px;
    max-width: 90vw;
    background: #fff;
    border-radius: 10px;
    padding: 16px 18px;
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.2);
  }

  .modal-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 10px;
    text-align: center;
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 12px;
  }

  .plain-btn {
    padding: 8px 12px;
    border-radius: 6px;
    border: 1px solid #ddd;
    background: #fff;
    cursor: pointer;
  }

  .plain-btn:hover {
    background: #f5f5f5;
  }

  .wechat-qr {
    display: flex;
    flex-direction: column;
    align-items: center;

    .qr-placeholder {
      width: 220px;
      height: 220px;
      background: repeating-linear-gradient(45deg, #f0f0f0 0, #f0f0f0 10px, #e0e0e0 10px, #e0e0e0 20px);
      border-radius: 8px;
      margin-bottom: 12px;
    }
  }

  .ps-tip {
    color: #888;
    font-size: 12px;
    margin-top: 8px;
    text-align: center;
  }
}
</style>