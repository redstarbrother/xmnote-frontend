<template>
    <div class="breadcrumb-container">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item >首页</el-breadcrumb-item>
            <el-breadcrumb-item v-for="item in breadcrumbPath" :key="item.id">
                {{ item.title }}
            </el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useBreadcrumbStore } from '@/stores/breadcrumbStore'

const breadcrumbStore = useBreadcrumbStore()

// 计算面包屑路径
const breadcrumbPath = computed(() => {
    const currentId = breadcrumbStore.currentNoteId
    const notes = breadcrumbStore.flatNotes
    
    if (!currentId || !notes || notes.length === 0) return []

    const path = []
    let currentNote = notes.find(note => note.id === currentId)
    
    // 如果找到当前笔记，将其加入路径
    if (currentNote) {
        path.unshift(currentNote)
        
        // 循环查找父节点，直到找到根节点（parentId为null）
        while (currentNote.parentId) {
            currentNote = notes.find(note => note.id === currentNote.parentId)
            if (currentNote) {
                path.unshift(currentNote)
            } else {
                break
            }
        }
    }
    
    return path
})
</script>

<style lang="scss" scoped>
.breadcrumb-container {
    padding: 16px;
}
</style>