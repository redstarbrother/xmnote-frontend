<template>
    <div class="toc-sidebar" :class="{ 'toc-sidebar-collapsed': isCollapsed }">
        <!-- 折叠时的悬浮按钮 -->
        <div v-if="isCollapsed" class="toc-collapsed-trigger" @click="toggleCollapse">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="4" y1="6" x2="20" y2="6"></line>
                <line x1="4" y1="12" x2="14" y2="12"></line>
                <line x1="4" y1="18" x2="18" y2="18"></line>
            </svg>
        </div>

        <!-- 展开的目录面板 -->
        <transition name="toc-slide">
            <div v-if="!isCollapsed" class="toc-panel">
                <!-- 面板头部 -->
                <div class="toc-header">
                    <span class="toc-title">目录</span>
                    <span class="toc-close" @click="toggleCollapse" title="收起目录">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="m9 18 6-6-6-6" />
                        </svg>
                    </span>
                </div>

                <!-- 目录内容 -->
                <div ref="tocBodyRef" class="toc-body">
                    <!-- 空状态 -->
                    <div v-if="tocItems.length === 0" class="toc-empty">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                            <polyline points="10 9 9 9 8 9" />
                        </svg>
                        <span>添加标题以生成目录</span>
                    </div>

                    <!-- 目录列表 -->
                    <nav v-else class="toc-nav">
                        <!-- 竖线指示器轨道 -->
                        <div class="toc-track"></div>
                        <a v-for="(item, index) in tocItems" :key="item.id + '-' + index" class="toc-item"
                            :ref="el => { if (item.isActive) activeItemRef = el }"
                            :class="[`toc-level-${item.level}`, { 'toc-active': item.isActive }]" :title="item.text"
                            @click.prevent="handleClick(item)">
                            <span class="toc-indicator"></span>
                            <span class="toc-text">{{ item.text || '空标题' }}</span>
                        </a>
                    </nav>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
    editor: {
        type: Object,
        default: null,
    },
})

const isCollapsed = ref(false)
const tocItems = ref([])
const tocBodyRef = ref(null)
const activeItemRef = ref(null)

// 从 editor storage 同步 TOC 数据
function syncFromStorage() {
    if (!props.editor || !props.editor.instance) return

    const storage = props.editor.instance.storage?.toc
    if (!storage) return

    const items = storage.tocItems || []
    const activeId = storage.activeId

    tocItems.value = items.map(item => ({
        ...item,
        isActive: item.id === activeId,
    }))
}

// 点击目录项
function handleClick(item) {
    if (!props.editor) return
    props.editor.scrollToHeading(item.id, { smooth: true, focus: false })

    // 通知 Extension 层更新 activeId
    const storage = props.editor.instance?.storage?.toc
    if (storage?.highlighter) {
        storage.highlighter.setActiveId(item.id)
    }

    // 立即同步本地状态
    nextTick(() => syncFromStorage())
}

// 切换折叠
function toggleCollapse() {
    isCollapsed.value = !isCollapsed.value
}

// 滚动激活项到可见区域
function scrollActiveItemIntoView() {
    nextTick(() => {
        if (!activeItemRef.value || !tocBodyRef.value) return
        const activeRect = activeItemRef.value.getBoundingClientRect()
        const bodyRect = tocBodyRef.value.getBoundingClientRect()
        if (activeRect.top < bodyRect.top || activeRect.bottom > bodyRect.bottom) {
            activeItemRef.value.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
        }
    })
}

let pollerTimer = null

// 监听 editor prop 变化
watch(() => props.editor, (newEditor) => {
    if (pollerTimer) {
        clearInterval(pollerTimer)
        pollerTimer = null
    }

    if (newEditor && newEditor.instance) {
        syncFromStorage()

        // 监听 transaction 以实时同步
        const handler = ({ transaction }) => {
            if (transaction.docChanged) {
                syncFromStorage()
            } else {
                syncFromStorage()
                scrollActiveItemIntoView()
            }
        }
        newEditor.instance.on('transaction', handler)

        // 定时器兜底：检测 storage.activeId 变更
        pollerTimer = setInterval(() => {
            const storage = newEditor.instance?.storage?.toc
            if (!storage) return
            const currentActiveId = tocItems.value.find(i => i.isActive)?.id
            if (storage.activeId !== currentActiveId) {
                syncFromStorage()
                scrollActiveItemIntoView()
            }
        }, 150)

        // 清理函数
        onUnmounted(() => {
            newEditor.instance.off('transaction', handler)
            if (pollerTimer) {
                clearInterval(pollerTimer)
                pollerTimer = null
            }
        })
    }
}, { immediate: true })

onUnmounted(() => {
    if (pollerTimer) {
        clearInterval(pollerTimer)
        pollerTimer = null
    }
})
</script>

<style lang="scss" scoped>
.toc-sidebar {
    position: sticky;
    top: 0;
    height: fit-content;
    max-height: calc(100vh - 120px);
    flex-shrink: 0;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.toc-sidebar-collapsed {
    width: 36px;
}

// 折叠时的触发按钮
.toc-collapsed-trigger {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    cursor: pointer;
    color: #9b9a97;
    transition: all 0.2s ease;
    margin-top: 4px;

    &:hover {
        background-color: rgba(55, 53, 47, 0.08);
        color: #37352f;
    }
}

// 展开的面板
.toc-panel {
    width: 200px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

// 面板头部
.toc-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 14px 8px;
    user-select: none;
}

.toc-title {
    font-size: 11px;
    font-weight: 600;
    color: #9b9a97;
    text-transform: uppercase;
    letter-spacing: 0.08em;
}

.toc-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: 4px;
    cursor: pointer;
    color: #9b9a97;
    transition: all 0.15s ease;

    &:hover {
        background-color: rgba(55, 53, 47, 0.08);
        color: #37352f;
    }
}

// 目录内容区
.toc-body {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 4px 0 16px;

    // 滚动条
    &::-webkit-scrollbar {
        width: 3px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
    }

    &::-webkit-scrollbar-thumb {
        background-color: transparent;
        border-radius: 3px;
        transition: background-color 0.2s;
    }

    &:hover::-webkit-scrollbar-thumb {
        background-color: rgba(55, 53, 47, 0.15);
    }
}

// 空状态
.toc-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 32px 16px;
    color: #c4c4c0;
    font-size: 12px;
    text-align: center;
}

// 目录导航
.toc-nav {
    display: flex;
    flex-direction: column;
    position: relative;
    gap: 0;
}

.toc-track {
    position: absolute;
    left: 14px;
    top: 0;
    bottom: 0;
    width: 1.5px;
    background-color: rgba(55, 53, 47, 0.06);
    border-radius: 1px;
}

// 目录项
.toc-item {
    display: flex;
    align-items: center;
    gap: 0;
    padding: 4px 12px 4px 14px;
    cursor: pointer;
    text-decoration: none;
    color: #787774;
    font-size: 12.5px;
    line-height: 1.5;
    transition: all 0.15s ease;
    position: relative;

    &:hover {
        color: #37352f;

        .toc-text {
            background-color: rgba(55, 53, 47, 0.04);
        }
    }

    &.toc-active {
        color: #2383e2;

        .toc-indicator {
            background-color: #2383e2;
            opacity: 1;
            transform: scaleY(1);
        }
    }
}

// 指示器（左侧高亮条）
.toc-indicator {
    position: absolute;
    left: 13.25px;
    width: 2px;
    height: 60%;
    border-radius: 1px;
    background-color: transparent;
    opacity: 0;
    transform: scaleY(0.5);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1;
}

.toc-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
    padding: 1px 6px;
    border-radius: 4px;
    transition: background-color 0.15s ease;
}

// 层级缩进
.toc-item.toc-level-1 {
    padding-left: 14px;
    font-weight: 500;
    font-size: 12.5px;

    .toc-text {
        padding-left: 10px;
    }
}

.toc-item.toc-level-2 {
    padding-left: 14px;
    font-weight: 400;
    font-size: 12px;

    .toc-text {
        padding-left: 22px;
    }
}

.toc-item.toc-level-3 {
    padding-left: 14px;
    font-weight: 400;
    font-size: 11.5px;
    color: #9b9a97;

    &.toc-active {
        color: #2383e2;
    }

    .toc-text {
        padding-left: 34px;
    }
}

.toc-item.toc-level-4 {
    padding-left: 14px;
    font-weight: 400;
    font-size: 11px;
    color: #b4b4b0;

    &.toc-active {
        color: #2383e2;
    }

    .toc-text {
        padding-left: 46px;
    }
}

// 展开/收起过渡动画
.toc-slide-enter-active,
.toc-slide-leave-active {
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.toc-slide-enter-from,
.toc-slide-leave-to {
    opacity: 0;
    transform: translateX(10px);
}
</style>
