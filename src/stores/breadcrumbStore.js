/**
 * 面包屑导航store, 用于记录当前笔记的id, 以及扁平化笔记节点列表, 提供文档路径计算功能
 */
import { defineStore } from "pinia";
import { ref } from "vue";

export const useBreadcrumbStore = defineStore("breadcrumb", () => {
  const currentNoteId = ref(null);
  const flatNotes = ref([]); // 扁平化笔记节点列表

  function setCurrentNoteId(id) {
    currentNoteId.value = id;
  }

  function setFlatNotes(notes) {
    flatNotes.value = flatNotesTree(notes);
  }

  // 扁平化笔记节点列表
  function flatNotesTree(notes) {
    const result = [];

    function traverse(nodeList) {
      for (const node of nodeList) {
        // 拷贝当前节点（避免修改原始数据）
        const { child, ...rest } = node;
        result.push(rest);

        // 递归处理子节点
        if (child && child.length > 0) {
          traverse(child);
        }
      }
    }

    traverse(notes);
    return result;
  }

  return { currentNoteId, flatNotes, setFlatNotes, setCurrentNoteId };
});
