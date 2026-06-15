/**
 * 文档store, 用于记录当前文档的信息, 以及文档的保存状态
 * document: {
 *  id: "1",
 *  logo: 📝,
 *  domainId: "100",
 *  type: "document",
 *  title: "文档标题",
 *  content: "文档内容",
 *  parentId: "100", 
 * }
 */
import { defineStore } from "pinia";
import { ref } from "vue";

export const useDocumentStore = defineStore("document", () => {
  const documentId = ref("");
  const content = ref({});
  const saveStatus = ref("saved");

  function reset() {
    documentId.value = "";
    content.value = {};
    saveStatus.value = "saved";
  }

  return { documentId, content, saveStatus, reset };
});
