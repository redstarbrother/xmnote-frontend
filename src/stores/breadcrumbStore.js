/**
 * 面包屑导航store, 记录当前笔记id，并从目录store派生扁平列表
 */
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useFolderStore } from "./folderStore";

export const useBreadcrumbStore = defineStore("breadcrumb", () => {
  const folderStore = useFolderStore();
  const currentNoteId = ref(null);

  const flatNotes = computed(() => folderStore.getFlatNotes());

  function setCurrentNoteId(id) {
    currentNoteId.value = id;
  }

  return { currentNoteId, flatNotes, setCurrentNoteId };
});
