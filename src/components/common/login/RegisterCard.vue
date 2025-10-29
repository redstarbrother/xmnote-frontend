<template>
    <div class="register-card">
        <div class="register-card-header">
            <div class="tab-container">
                <span>用户注册</span>
                <div class="tab-indicator" :style="indicatorStyle"></div>
            </div>
        </div>
        <div class="register-card-content">
            <div class="register-form">
                
                <div class="form-group">
                    <label for="username">用户名</label>
                    <el-input v-model="registerForm.username" placeholder="请输入用户名" required />
                </div>
                <div class="form-group">
                    <label for="email">邮箱</label>
                    <el-input v-model="registerForm.email" placeholder="请输入邮箱" required />
                </div>
                <div class="form-group">
                    <label for="password">密码</label>
                    <el-input v-model="registerForm.password" type="password" placeholder="请输入密码" show-password required />
                </div>
                <div class="form-group">
                    <label for="confirmPassword">确认密码</label>
                    <el-input v-model="registerForm.confirmPassword" type="password" placeholder="请再次输入密码" show-password required />
                </div>
                <div class="form-group">
                    <label for="isPrivate">私服注册</label>
                    <el-switch v-model="registerForm.isPrivate" />
                </div>
                <div class="form-group" v-if="registerForm.isPrivate">
                    <label for="serverAddr">服务器地址</label>
                    <el-input v-model="registerForm.serverAddr" placeholder="请输入服务器地址" required />
                </div>
                <div class="form-group">
                    <el-button type="primary" @click="handleRegister" style="width: 100%;">注册</el-button>
                </div>
                <div class="login-footer">
                    <span>已有账号? <a href="#" @click="isRegister = false">立即登录</a>, 注册即代表你同意<a href="#">用户协议</a></span>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['register'])
const isRegister = defineModel('isRegister', {
    type: Boolean,
    default: false
})

const registerForm = ref({
    isPrivate: false,
    serverAddr: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
})

// 处理注册
const handleRegister = () => {
    // 表单验证
    if (!registerForm.value.username) {
        ElMessage.error('请输入用户名')
        return
    }
    
    if (!registerForm.value.email) {
        ElMessage.error('请输入邮箱')
        return
    }
    
    if (!registerForm.value.password) {
        ElMessage.error('请输入密码')
        return
    }
    
    if (registerForm.value.password !== registerForm.value.confirmPassword) {
        ElMessage.error('两次输入的密码不一致')
        return
    }
    
    // 调用父组件注册方法
    emit('register', registerForm.value)
}

// 计算指示器样式
const indicatorStyle = computed(() => {
    return {
        transform: 'translateX(0%)'
    }
})
</script>

<style lang="scss" scoped>
.register-card {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .register-card-header {
        display: flex;
        width: 100%;
        justify-content: flex-start;
        margin-bottom: 20px;

        .tab-container {
            position: relative;
            display: flex;
            gap: 20px;
            padding-bottom: 8px;
        }

        .tab-indicator {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 2px;
            background-color: #007bff;
            transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        }

        span {
            position: relative;
            padding: 5px 10px;
            font-size: 16px;
            color: #007bff;
            font-weight: 500;
        }
    }

    .register-card-content {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 20px;

        .register-form {
            width: 100%;
            max-width: 360px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            gap: 20px;

            .login-footer {
                width: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                margin-top: 10px;

                span {
                    font-size: 12px;
                    color: #8e8d8d;
                }
            }
        }

        .form-group {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 8px;

            label {
                font-size: 14px;
                color: #333;
                font-weight: 500;
            }
        }
    }
}
</style>