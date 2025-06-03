<template>
    <div class="pl-4">
        <div class="flex items-center gap-2 py-1 cursor-pointer hover:bg-gray-100 rounded px-1">
            <span>{{ item.logo }}</span>
            <span class="truncate">{{ item.title }}</span>
        </div>
        <div v-if="item.child && item.child.length > 0">
            <NoteItem v-for="child in item.child" :key="child.id" :item="child" />
        </div>
    </div>
</template>

<script setup>
defineProps({
    item: {
        type: Object,
        required: true
    }
})
</script>

<style scoped>
.truncate {
    max-width: 160px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>