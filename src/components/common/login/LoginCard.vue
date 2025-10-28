<template>
    <div class="login-card">
        <div class="login-card-header">
            <div class="tab-container">
                <span :class="{ 'active': activeTab === 'phone' }" @click="switchTab('phone')">快捷登录</span>
                <span :class="{ 'active': activeTab === 'password' }" @click="switchTab('password')">密码登录</span>
                <div class="tab-indicator" :style="indicatorStyle"></div>
            </div>
        </div>
        <transition name="slide-fade" mode="out-in">
            <div v-if="activeTab === 'phone'" key="phone" class="login-card-content">
                <div class="login-form">
                    <div class="form-group">
                        <label for="phone">手机号</label>
                        <input type="text" id="phone" name="phone" placeholder="请输入手机号" required>
                    </div>
                    <div class="form-group verification-group">
                        <label for="verification">验证码</label>
                        <div class="verification-input-group">
                            <input type="text" id="verification" name="verification" placeholder="请输入验证码" required>
                            <button class="verification-btn">获取验证码</button>
                        </div>
                    </div>
                    <div class="form-group">
                        <el-button type="primary">注册/登录</el-button>
                    </div>
                    <div class="login-footer">
                        <span>未注册手机验证后将自动注册，登录即代表你同意<a href="#">用户协议</a></span>
                        <hr class="divider">
                        <div class="social-login">
                            <span>其他方式登录</span>
                            <div class="social-container">
                                <div class="sccial-item">
                                    <img class="social-icon" src="@/assets/wechat.svg" alt="微信登录"></img>
                                    <span>微信</span>
                                </div>
                                <div class="sccial-item">
                                    <img class="social-icon" src="@/assets/cloud.svg" alt="私服登录"></img>
                                    <span>私服</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else key="password" class="login-card-content">
                <div class="login-form">
                    <div class="form-group">
                        <label for="username-pwd">用户名</label>
                        <input type="text" id="username-pwd" name="username" placeholder="请输入用户名" required>
                    </div>
                    <div class="form-group">
                        <label for="password">密码</label>
                        <input type="password" id="password" name="password" placeholder="请输入密码" required>
                    </div>
                    <div class="form-group">
                        <el-button type="primary">登录</el-button>
                    </div>
                    <div class="login-footer">
                        <span>未注册手机验证后将自动注册，登录即代表你同意<a href="#">用户协议</a></span>
                        <hr class="divider">
                        <div class="social-login">
                            <span>其他方式登录</span>
                            <div class="social-container">
                                <div class="sccial-item">
                                    <img class="social-icon" src="@/assets/wechat.svg" alt="微信登录"></img>
                                    <span>微信</span>
                                </div>
                                <div class="sccial-item">
                                    <img class="social-icon" src="@/assets/cloud.svg" alt="私服登录"></img>
                                    <span>私服</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>

    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeTab = ref('phone')
const activeTabIndex = ref(0)

// 计算指示器样式
const indicatorStyle = computed(() => {
    return {
        transform: `translateX(${activeTabIndex.value * 100}%)`
    }
})

// 切换标签的方法
const switchTab = (tab) => {
    activeTab.value = tab
    activeTabIndex.value = tab === 'phone' ? 0 : 1
}
</script>

<style lang="scss" scoped>
.login-card {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .login-card-header {
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
            width: 50%;
            height: 2px;
            background-color: #007bff;
            transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        }

        span {
            position: relative;
            padding: 5px 10px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.3s ease;

            &:hover {
                color: #0056b3;
            }

            &.active {
                color: #007bff;
                font-weight: 500;
                transform: scale(1.2);
            }
        }
    }

    .login-card-content {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 20px;

        .login-form {
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
                // margin-top: 20px;

                .divider {
                    width: 100%;
                    margin: 20px 0;
                    border: 0;
                    border-top: 1px solid #cfcfcf;
                }

                .social-login {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;

                    span {
                        position: relative;
                        top: 1px;
                        font-size: 12px;
                        color: #8e8d8d;
                        text-align: center;
                    }

                    .social-container {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        gap: 10px;

                        .sccial-item {
                            display: flex;
                            // justify-content: center;
                            align-items: center;
                            cursor: pointer;
                            gap: 5px;
                            padding: 4px 6px;
                            border-radius: 4px;
                            transition: transform 0.1s ease;

                            img {
                                width: 16px;
                                height: 16px;
                            }

                            &:hover {
                                transform: scale(1.1);
                                transition: transform 0.1s ease;
                                box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
                            }
                        }
                    }
                }

                span {
                    font-size: 12px;
                    color: #8e8d8d;
                    // font-weight: 500;
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

            input {
                width: 100%;
                padding: 10px 12px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 14px;
                box-sizing: border-box;
                transition: border-color 0.3s ease, box-shadow 0.3s ease;

                &:focus {
                    outline: none;
                    border-color: #007bff;
                    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
                }

                &::placeholder {
                    color: #aaa;
                }
            }
        }

        .verification-group {
            .verification-input-group {
                display: flex;
                width: 100%;
                gap: 10px;

                input {
                    flex: 1;
                }

                .verification-btn {
                    white-space: nowrap;
                    padding: 0 15px;
                    height: 38px;
                    background-color: #f0f0f0;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    color: #333;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.3s ease;

                    &:hover {
                        background-color: #e0e0e0;
                    }

                    &:active {
                        transform: scale(0.98);
                    }
                }
            }
        }
    }


    // 过渡动画效果
    .slide-fade-enter-active,
    .slide-fade-leave-active {
        transition: all 0.3s ease;
    }

    .slide-fade-enter-from {
        opacity: 0;
        transform: translateX(-20px);
    }

    .slide-fade-leave-to {
        opacity: 0;
        transform: translateX(20px);
    }
}
</style>