/**
 * 用户store, 用于管理用户信息和状态
 * userInfo: {
 *  id: "1",
 *  username: "用户名",
 *  avatarUrl: "头像URL",
 *  serverAddress: "服务器地址",
 *  email: "邮箱",
 *  role: "角色"
 * }
 */
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useUserStore = defineStore("user", () => {
  // 用户基本信息
  const userInfo = ref({
    id: "",
    username: "举个锤子", // 默认用户名
    avatarUrl: "https://avatars.githubusercontent.com/u/45450994?v=4&size=64", // 默认头像
    serverAddress: "localhost", // 默认服务器地址
    email: "",
    role: ""
  });

  // 用户登录状态
  const isLoggedIn = ref(false);

  // 计算属性
  const username = computed(() => userInfo.value.username);
  const avatarUrl = computed(() => userInfo.value.avatarUrl);
  const serverAddress = computed(() => userInfo.value.serverAddress);
  const userId = computed(() => userInfo.value.id);

  // 设置用户信息
  function setUserInfo(info) {
    if (info) {
      userInfo.value = { ...userInfo.value, ...info };
      isLoggedIn.value = true;
    }
  }

  // 获取用户信息
  function getUserInfo() {
    return userInfo.value;
  }

  // 更新用户头像
  function updateAvatar(url) {
    userInfo.value.avatarUrl = url;
  }

  // 更新用户名
  function updateUsername(name) {
    userInfo.value.username = name;
  }

  // 更新服务器地址
  function updateServerAddress(address) {
    userInfo.value.serverAddress = address;
  }

  // 登出
  function logout() {
    userInfo.value = {
      id: "",
      username: "未登录用户",
      avatarUrl: "",
      serverAddress: "",
      email: "",
      role: ""
    };
    isLoggedIn.value = false;
  }

  return {
    // 状态
    userInfo,
    isLoggedIn,
    // 计算属性
    username,
    avatarUrl,
    serverAddress,
    userId,
    // 方法
    setUserInfo,
    getUserInfo,
    updateAvatar,
    updateUsername,
    updateServerAddress,
    logout
  };
});