<template>
  <div class="login-root">
    <div v-if="!isRegister" class="login-container">
      <transition name="fade">
        <div v-if="serverType === 'public'" class="container public-container">
          <LoginCard />
        </div>
        <div v-else class="container private-container">

        </div>
      </transition>
    </div>
    <div v-else class="register-container">
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LoginCard from '@/components/common/login/LoginCard.vue'

const serverType = ref("public")
const isRegister = ref(false)
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