<template>
  <div class="node-item">
    <div class="item-container" @click="expandDir">
      <div class="item-info">
        <span
          class="item-info-logo"
          :style="{ paddingLeft: `${(documentInfo.depth || 0) * 16}px` }"
          >{{ item.logo }}</span
        >
        <span
          class="truncate"
          :class="{ file: documentInfo.type === NodeType.FOLDER }"
          >{{ item.title }}</span
        >
      </div>
      <div class="item-option">
        <span class="option-more" @click="showPopoverMenu($event, item.id)">
          <el-icon>
            <MoreFilled color="#868684" />
          </el-icon>
        </span>
        <span
          class="option-switch"
          v-if="documentInfo.type === NodeType.FOLDER"
        >
          <el-icon>
            <ArrowDownBold color="#868684" v-if="expanded" />
            <ArrowLeftBold color="#868684" v-else />
          </el-icon>
        </span>
      </div>
    </div>
    <div v-if="expanded">
      <NodeItem v-for="child in item.child" :key="child.id" :item="child" />
    </div>
    <div
      v-if="popoverMenuVisible"
      class="popover-menu"
      :style="{ top: `${popoverMenuPosition.top}px`, left: `${popoverMenuPosition.left}px` }"
      ref="popoverMenuRef"
    >
      <div class="popover-menu-item" @click="onPopoverSelect('view')">
        👁️ View
      </div>
      <div class="popover-menu-item" @click="onPopoverSelect('save')">
        ⬇️ Save
      </div>
      <div class="popover-menu-item" @click="onPopoverSelect('apply')">
        🟦 Apply
      </div>
    </div>
  </div>
</template>

<script setup>
import { NodeType } from "@/enums/NodeType";
import { ref, onMounted, nextTick, onBeforeUnmount } from "vue";
import { useBreadcrumbStore } from "@/stores/breadcrumbStore";
import { ArrowDownBold, ArrowLeftBold } from "@element-plus/icons-vue";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

// 展开状态
const expanded = ref(false);
const documentInfo = ref(props.item);
// 气泡菜单是否可见
const popoverMenuVisible = ref(false);
// 绑定气泡菜单的位置元素
const popoverMenuPosition = ref({ top: 0, left: 0 });
const popoverMenuRef = ref(null);
const triggerBtn = ref(null); // 用于绑定“...”按钮元素
// 面包屑strore
const breadcrumbStore = useBreadcrumbStore();
// 选中节点
const expandDir = (event) => {
  // 如果点击的是 .option-more 或其子元素，则不触发展开
  if (event.target.closest(".option-more")) {
    return;
  }
  if (documentInfo.value.type === NodeType.FOLDER) {
    expanded.value = !expanded.value;
  }
  // else if (documentInfo.value.type === NodeType.NOTE) {
  //   // 打开笔记
  //   console.log("打开笔记");
  //   breadcrumbStore.setCurrentNoteId(documentInfo.value.id);
  // }
};

let handleClickOutside = undefined;
// 显示气泡菜单
const showPopoverMenu = (event) => {
  event.stopPropagation();
  const rect = event.currentTarget.getBoundingClientRect();
  popoverMenuPosition.value = {
    top: rect.bottom + 6 + window.scrollY,
    left: rect.left + window.scrollX,
  };
  popoverMenuVisible.value = true;

  // 点击外部时关闭菜单
  setTimeout(() => {
  if (handleClickOutside) {
    document.removeEventListener("click", handleClickOutside);
  }

  handleClickOutside = (e) => {
    if (
      popoverMenuRef.value &&
      !popoverMenuRef.value.contains(e.target) &&
      !event.currentTarget.contains(e.target)
    ) {
      popoverMenuVisible.value = false;
      document.removeEventListener("click", handleClickOutside);
      handleClickOutside = undefined;
    }
  };

  document.addEventListener("click", handleClickOutside);
}, 0);
};

const onPopoverSelect = (action) => {
  console.log("Selected:", action);
  popoverMenuVisible.value = false;
};

onMounted(() => {
  // console.log(documentInfo);
});

// 清理：组件卸载时移除监听器，防止内存泄漏
onBeforeUnmount(() => {
  if (handleClickOutside) {
    document.removeEventListener("click", handleClickOutside);
  }
});
</script>

<style scoped lang="scss">
.node-item {
  margin: 5px 0;
  cursor: pointer;

  .item-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 20px;
    padding: 5px 3px;
    // 避免用户选中文字
    user-select: none;
    border-radius: 4px;
    transition: all 0.5s ease;

    .item-info {
      display: flex;
      align-items: center;
      .item-info-logo {
        display: flex;
        align-items: center;
        font-size: 16px;
        line-height: 1;
        margin-right: 5px;
        transform: translateY(-2px);
      }

      .truncate {
        color: #5f5f5b;
        max-width: 160px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }

    &:hover {
      background-color: #e8e8e7;
      transition: all 0.5s ease;
      .item-option {
        opacity: 1;
      }
    }

    &:active {
      background-color: #f0f0ef;
      .item-option {
        opacity: 1;
      }
    }
  }

  .item-option {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 5px;
    transition: all 0.5s ease;
    opacity: 0;
    padding-right: 5px;

    span {
      padding: 3px;
      border-radius: 30%;
      cursor: pointer;
      &:hover {
        background-color: #dddddd;
        border-radius: 4px;
      }
    }
  }

  .file {
    color: #3c3c39;
  }

  .popover-menu {
  position: absolute;
  width: 120px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
  z-index: 999;
  padding: 8px 0;
  transition: all 0.2s ease;
}

.popover-menu-item {
  padding: 8px 16px;
  font-size: 14px;
  color: #232321;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.popover-menu-item:hover {
  background-color: #f5f5f5;
}
}
</style>