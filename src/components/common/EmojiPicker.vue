<template>
    <el-popover placement="bottom-start" :width="350" trigger="click" v-model:visible="popoverVisible">
        <template #reference>
            <slot name="reference">
                <div class="default-trigger">{{ modelValue }}</div>
            </slot>
        </template>
        <div class="emoji-picker">
            <span v-for="(emoji, index) in emojiList" :key="index" class="emoji-item" @click="handleSelect(emoji)">
                {{ emoji }}
            </span>
        </div>
    </el-popover>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    modelValue: {
        type: String,
        default: '📝'
    }
});

const emit = defineEmits(['update:modelValue', 'select']);

const popoverVisible = ref(false);

const emojiList = Array.from(new Set([
    "✨", "💡", "💭", "🤔", "🤯", "🧠", "⚡", "💫", "❓", "❕", "💯", "🔥", "📝", "📄", "🗒", "📑", "📚", "📖", "📰", "📓", "📔", "📒", "📗", "📘", "📙",
    "📌", "📁", "🏷", "🔗", "🗂", "📈", "📊", "🔎", "⚙", "🔑", "📦", "🗃", "🗳", "🎯", "✅", "⏳", "⭐", "🔔", "🚩", "🚧", "🛑", "🆕", "🔄", "🔜", "🔚",
    "▶", "⏸", "🚀", "🛠", "🧑‍💻", "✍", "🖋", "🎨", "🎥", "🎙", "💻", "📱", "⌨", "🖱", "💾", "👥", "🤝", "🗣", "✉", "📬", "📤", "📥", "📈", "📉", "💼",
    "📈", "⚖", "📅", "🗓", "⏱", "⏰", "📆", "🕰", "⏳", "☀", "🌑", "🌅", "🌃", "☔", "🌈", "🧊", "🔮", "💎", "💚", "🧡", "💙", "💜", "🤍", "🖤", "⚫",
    "⚪", "📍", "🏠", "🌐", "📡", "☁", "🔌", "🗺"
]));

const handleSelect = (emoji) => {
    emit('update:modelValue', emoji);
    emit('select', emoji);
    popoverVisible.value = false;
};
</script>

<style scoped lang="scss">
.emoji-picker {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    max-height: 300px;
    overflow-y: auto;
    gap: 8px;
    padding: 10px;

    .emoji-item {
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        font-size: 24px;
        padding: 4px;
        border-radius: 4px;
        transition: background-color 0.2s;
        user-select: none;

        &:hover {
            background-color: #f0f0f0;
        }
    }
}
</style>
