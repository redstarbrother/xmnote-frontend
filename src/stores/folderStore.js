/**
 * 目录store, 用于记录当前目录的信息, 以及目录的保存状态
 */
import { defineStore } from "pinia";
import { ref } from "vue";

export const useFolderStore = defineStore("folder", () => {
  const domainList = ref([]);

  function setDomainList(list) {
    domainList.value = list;
  }

  function getDomainList() {
    return domainList.value;
  }

  function removeDoc(docId) {
    for (let domain of domainList.value) {
      if (domain.nodeList) {
        domain.nodeList = domain.nodeList.filter((item) => item.id !== docId);
      }
    }
  }

  function addFolder(domainId, node) {
    let domain = domainList.value.find((item) => item.domainId === domainId);
    if (domain) {
      if (!Array.isArray(domain.nodeList)) {
        domain.nodeList = [];
      }
      domain.nodeList.push(node);
    }
  }

  return { setDomainList, getDomainList, addFolder, removeDoc };
});
