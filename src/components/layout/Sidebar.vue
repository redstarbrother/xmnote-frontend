<template>
    <div class="sidebar-container">
        <div class="main-content">
            <div class="search-area">
                <el-input v-model="searchContent" size="large" placeholder="Please Input"
                    :suffix-icon="Search" />
            </div>
            <div class="note-area">
                <p class="categary-title">笔记</p>
                <div class="note-list">
                    <NoteItem v-for="note in notes" :key="note.id" :item="note" />
                </div>
            </div>
            <div class="blog-area">

            </div>
        </div>
        <div class="user-area">
            <!-- 用户区域内容 -->
            <UserArea />
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import NoteItem from '@/components/common/sidebar/NodeItem.vue'
import UserArea from '@/components/common/sidebar/UserArea.vue'
import { useBreadcrumbStore } from '@/stores/breadcrumbStore'
import { Search } from '@element-plus/icons-vue'

const notes = ref([])
const searchContent = ref('')
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
            depth: 0,
            parentId: null,
            child: [
                {
                    id: 'X7K4GR0FD76AKQFR123EK9F42ABCD456',
                    title: '会议记录',
                    logo: '📝',
                    type: 'note',
                    depth: 1,
                    parentId: 'J6G4FU0FDS6AJGFR877EJ7F43SCFG123',
                    child: []
                },
                {
                    id: 'B6Y8RT0SD98LMGQP876AJ3T65ZXCV789',
                    title: '项目计划',
                    logo: '📝',
                    type: 'note',
                    depth: 1,
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
            depth: 0,
            parentId: null,
            child: [
                {
                    id: 'K9P7YU3JJ88LOPWR234EL1M02QWED654',
                    title: '旅行计划',
                    logo: '📝',
                    type: 'note',
                    depth: 1,
                    parentId: 'C9H2PT1FGS9LKJHY564EW3G89QWER321',
                    child: []
                },
                {
                    id: 'T7U3NB8ZW22LXCVR543AK6P77EDCF987',
                    title: '购物清单',
                    logo: '📝',
                    type: 'note',
                    depth: 1,
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
            depth: 0,
            parentId: null,
            child: []
        },
        {
            id: 'L0F5DR8UE21MNBRY432EF5H88PLMK321',
            title: '灵感随记',
            logo: '📝',
            type: 'note',
            depth: 0,
            parentId: null,
            child: []
        }
    ]
}
</script>

<style scoped lang="scss">
.sidebar-container {
    width: 100%;
    height: 100vh;
    padding: 15px;
    box-sizing: border-box;
    background-color: #f8f8f7;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .main-content {
        flex-grow: 1;

        .categary-title {
            color: #91918e;
        }
        .search-area {
            margin-bottom: 20px;
        }

        .note-area {
            margin-bottom: 20px;

            p {
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 10px;
            }

            .note-list {
                // 笔记列表样式
            }
        }

        .blog-area {
            margin-bottom: 20px;
            // 博客区域样式
        }
    }

    .user-area {
        padding-top: 20px;
        border-top: 1px solid #ddd;
        // 用户区域样式
    }
}
</style>