<template>
    <div class="breadcrumb-container">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item v-for="item in breadcrumbPath" :key="item.id">
                {{ item.title }}
            </el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useDocumentStore } from '@/stores/documentStore'
import { useDomainStore } from '@/stores/domainStore'

const documentStore = useDocumentStore()
const domainStore = useDomainStore()

const breadcrumbPath = computed(() => {
    const currentId = documentStore.getDocumentId()
    if (!currentId) return []
    return domainStore.getPathToNode(currentId)
})
</script>

<style lang="scss" scoped>
.breadcrumb-container {
    padding: 16px;
    height: 100%;
}
</style>