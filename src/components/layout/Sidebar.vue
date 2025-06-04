<template>
    <div class="search-area">
        <input type="text" class="search-input" placeholder="Search...">
        <button class="search-button">Search</button>
    </div>
    <div class="note-area">
        <p>笔记</p>
        <div class="note-list">
            <NoteItem v-for="note in notes" :key="note.id" :item="note" />
        </div>
    </div>
    <div class="blog-area">

    </div>
    <div class="sidebar">
        <p>this is home sidebar</p>

    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import NoteItem from '@/components/common/sidebar/NodeItem.vue'
import { useBreadcrumbStore } from '@/stores/breadcrumbStore'


const notes = ref([])
const breadcrumbStore = useBreadcrumbStore();

onMounted(() => {
    initNoteList()
    // 初始化面包屑store的notes数据
    breadcrumbStore.setFlatNotes(notes.value)
})

// 笔记目录列表初始化
function initNoteList() {
    // 随机生成一些笔记
    notes.value = [
        {
            id: 'J6G4FU0FDS6AJGFR877EJ7F43SCFG123',
            title: '工作笔记',
            logo: '📂',
            type: 'folder',
            parentId: null,
            child: [
                {
                    id: 'X7K4GR0FD76AKQFR123EK9F42ABCD456',
                    title: '会议记录',
                    logo: '📝',
                    type: 'note',
                    parentId: 'J6G4FU0FDS6AJGFR877EJ7F43SCFG123',
                    child: []
                },
                {
                    id: 'B6Y8RT0SD98LMGQP876AJ3T65ZXCV789',
                    title: '项目计划',
                    logo: '📝',
                    type: 'note',
                    parentId: 'J6G4FU0FDS6AJGFR877EJ7F43SCFG123',
                    child: []
                }
            ]
        },
        {
            id: 'C9H2PT1FGS9LKJHY564EW3G89QWER321',
            title: '生活记录',
            logo: '📂',
            type: 'folder',
            parentId: null,
            child: [
                {
                    id: 'K9P7YU3JJ88LOPWR234EL1M02QWED654',
                    title: '旅行计划',
                    logo: '📝',
                    type: 'note',
                    parentId: 'C9H2PT1FGS9LKJHY564EW3G89QWER321',
                    child: []
                },
                {
                    id: 'T7U3NB8ZW22LXCVR543AK6P77EDCF987',
                    title: '购物清单',
                    logo: '📝',
                    type: 'note',
                    parentId: 'C9H2PT1FGS9LKJHY564EW3G89QWER321',
                    child: []
                }
            ]
        },
        {
            id: 'L0F5DR8UE21MNBRY432EF2H88PLMK321',
            title: '学习笔记',
            logo: '📂',
            type: 'folder',
            parentId: null,
            child: []
        },
        {
            id: 'L0F5DR8UE21MNBRY432EF2H88PLMK321',
            title: '灵感随记',
            logo: '📝',
            type: 'note',
            parentId: null,
            child: []
        }
    ]
}
</script>

<style scoped></style>