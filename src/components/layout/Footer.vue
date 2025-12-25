<template>
    <div class="footer-container">
        <div class="left-section">
            <Breadcrumb />
            <span class="encoding">UTF-8</span>
        </div>
        <div class="right-section">
            <div class="status">
                <el-icon class="status-icon">
                    <Connection />
                </el-icon>
                <span>ONLINE</span>
            </div>
            <span class="powered-by">POWERED BY XMNOTE</span>
        </div>
    </div>
</template>

<script setup>
import { Connection } from '@element-plus/icons-vue'
import Breadcrumb from '@/components/common/header/Breadcrumb.vue'

</script>

<style lang="scss" scoped>
.footer-container {
    height: 30px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    background-color: #fff;
    font-size: 12px;
    color: #909399;
    user-select: none;
}

.left-section {
    display: flex;
    align-items: center;
    gap: 50px;
}

.right-section {
    display: flex;
    align-items: center;
    gap: 30px;
}

.status {
    display: flex;
    align-items: center;
    gap: 6px;

    .status-icon {
        font-size: 14px;
    }

    span {
        font-size: 12px;
        color: #37d237;
    }
}

.powered-by {
    color: #409eff;
    display: inline-flex;
    align-items: center;
    padding-top: 2px;
    font-size: 12px;
    font-weight: 550;
    font-family: Arial, sans-serif;
}
</style>