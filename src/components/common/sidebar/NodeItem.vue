<template>
  <div class="node-item">
    <div class="item-container" @click="select">
      <div class="item-info">
        <span class="item-info-logo"
          >{{ "　".repeat(documentInfo.depth || 0) }}{{ item.logo }}</span
        >
        <span
          class="truncate"
          :class="{ file: documentInfo.type === NodeType.FOLDER }"
          >{{ item.title }}</span
        >
      </div>
      <div class="item-option">
        <span class="option-switch">
          <el-icon>
            <MoreFilled color="#868684" />
          </el-icon>
        </span>
        <span v-if="documentInfo.type === NodeType.FOLDER">
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
  </div>
</template>

<script setup>
import { NodeType } from "@/enums/NodeType";
import { ref, onMounted } from "vue";
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
// 面包屑strore
const breadcrumbStore = useBreadcrumbStore();
// 选中节点
const select = () => {
  if (documentInfo.value.type === NodeType.FOLDER) {
    expanded.value = !expanded.value;
  } else if (documentInfo.value.type === NodeType.NOTE) {
    // 打开笔记
    console.log("打开笔记");
    breadcrumbStore.setCurrentNoteId(documentInfo.value.id);
  }
};

onMounted(() => {
  // console.log(documentInfo);
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
    justify-content: center;
    gap: 5px;
    transition: all 0.5s ease;
    opacity: 0;

    span {
      padding: 3px;
      border-radius: 30%;
      cursor: pointer;
    }

    .option-switch {
      &:hover {
        background-color: #dddddd;
        border-radius: 4px;
      }
    }
  }

  .file {
    color: #3c3c39;
  }
}
</style>