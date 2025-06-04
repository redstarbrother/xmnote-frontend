<template>
    <div class="node-item">
        <div class="item" @click="select">
            <span>{{ item.logo }}</span>
            <span class="truncate">{{ item.title }}</span>
            <span v-if="documentInfo.type === NodeType.FOLDER" >
                {{ expanded ? '▼' : '▶' }}
            </span>
        </div>
        <div v-if="expanded">
            <NodeItem v-for="child in item.child" :key="child.id" :item="child" />
        </div>
    </div>
</template>

<script setup>
import { NodeType } from "@/enums/NodeType"
import { ref, onMounted } from "vue"
import { useBreadcrumbStore } from '@/stores/breadcrumbStore'

const props = defineProps({
    item: {
        type: Object,
        required: true
    }
})

// 展开状态
const expanded = ref(false)
const documentInfo = ref(props.item)
// 面包屑strore
const breadcrumbStore = useBreadcrumbStore();
// 选中节点
const select = () => {

    if (documentInfo.value.type === NodeType.FOLDER) {
        expanded.value = !expanded.value
    } else if (documentInfo.value.type === NodeType.NOTE) {
        // 打开笔记
        console.log("打开笔记");
        breadcrumbStore.setCurrentNoteId(documentInfo.value.id)
    }
}

onMounted(() => {
    console.log(documentInfo);
    
})
</script>

<style scoped lang="scss">
.node-item {
    padding-left: 16px;
    margin: 5px 0;
    cursor: pointer;

    .item {
        width: 100%;
        // 避免用户选中文字
        user-select: none;

        :hover {
            background-color: #f5f5f5;
        }
    }

    .truncate {
        max-width: 160px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
}
</style>