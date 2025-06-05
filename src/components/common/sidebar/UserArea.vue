<template>
    <div class="user-container">
        <div class="user-info-area">
            <el-avatar :size="40" :src="avatarUrl" />
            <span class="user-name">举个锤子</span>
        </div>
        <div class="doc-info-area">
            <span class="count-info">📄 笔记：{{ noteCount }}</span>
            <span class="count-info">🔢 字数：{{ wordCount }}  </span>
            <span class="count-info">🔖 书签：{{ bookmarkCount }}</span>
        </div>
        <div class="options-area">
            <el-button type="text" class="option-btn">📊 数据统计</el-button>
            <el-button type="text" class="option-btn">⚙️ 设置</el-button>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";


const avatarUrl = ref('https://avatars.githubusercontent.com/u/45450994?v=4&size=64')
const noteCount = ref(23)
const wordCount = ref(65842)
const bookmarkCount = ref(18)

</script>

<style lang="scss" scoped>
.user-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background-color: #f5f5f5;
    .user-info-area {
        display: flex;
        align-items: center;
        .user-name {
            font-size: 16px;
            font-weight: bold;
            margin-left: 10px;
        }
    }
    .doc-info-area {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
       .count-info {
            width: 100%;
            font-size: 14px;
            margin-top: 6px;
        }
    }
    .options-area {
        display: flex;
        align-items: center;
        margin-top: 10px;
        .option-btn {
            font-size: 14px;
            margin-right: 10px;
            &:last-child {
                margin-right: 0;
            }
        }
    }
}
</style>