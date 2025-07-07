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
  const document = ref(null);

  const saveStatus = ref(false); // false: 未保存, true: 已保存

  function setDocument(doc) {
    document.value = doc;
  }

  function getDocument() {
    return document.value;
  }

  function getDocumentId() {
    return document.value?.id;
  }

  function setSaveStatus(status) {
    saveStatus.value = status;
  }

  function getSaveStatus() {
    return saveStatus.value;
  }

  return { setDocument, getDocument, getSaveStatus, setSaveStatus, getDocumentId };
});
