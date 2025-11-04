/**
 * 目录store, 归一化存储 + 派生视图
 */
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useFolderStore = defineStore("folder", () => {
  // 归一化数据
  const domainById = ref({}); // { [domainId]: { id, name } }
  const nodeById = ref({}); // { [nodeId]: { id, domainId, type, title, logo, depth, parentId } }
  const childrenByParentId = ref({}); // { [parentId|null]: [childId, ...] }
  const rootNodeIdsByDomainId = ref({}); // { [domainId]: [rootNodeId, ...] }

  // 将服务端的 domainFolderTreeList 转为归一化
  function setDomainList(list) {
    hydrateFromServer(list || []);
  }

  function hydrateFromServer(list) {
    domainById.value = {};
    nodeById.value = {};
    childrenByParentId.value = {};
    rootNodeIdsByDomainId.value = {};

    const ensureArr = (obj, key) => {
      if (!Array.isArray(obj[key])) obj[key] = [];
      return obj[key];
    };

    const ingestNode = (node, domainId, parentId = null) => {
      const { child, ...rest } = node;
      const base = {
        ...rest,
        domainId,
        parentId: parentId ?? null,
      };
      nodeById.value[base.id] = base;

      if (parentId === null) {
        ensureArr(rootNodeIdsByDomainId.value, domainId).push(base.id);
      } else {
        ensureArr(childrenByParentId.value, parentId).push(base.id);
      }

      if (Array.isArray(child) && child.length > 0) {
        for (const c of child) {
          ingestNode(c, domainId, base.id);
        }
      }
    };

    for (const domain of list) {
      domainById.value[domain.domainId] = {
        id: domain.domainId,
        name: domain.domainName,
      };
      const nodes = Array.isArray(domain.nodeList) ? domain.nodeList : [];
      for (const node of nodes) {
        ingestNode(node, domain.domainId, null);
      }
    }
    console.log("domainById:", domainById.value);
    console.log("nodeById:", nodeById.value);
    console.log("childrenByParentId:", childrenByParentId.value);
    console.log("rootNodeIdsByDomainId:", rootNodeIdsByDomainId.value);
  }

  // 组装树（供 Sidebar 使用）
  function getDomainTrees() {
    const buildNode = (id) => {
      const base = nodeById.value[id];
      const childrenIds = childrenByParentId.value[id] || [];
      const child = childrenIds.map(buildNode);
      return { ...base, child };
    };

    return Object.values(domainById.value).map((d) => {
      const rootIds = rootNodeIdsByDomainId.value[d.id] || [];
      const nodeList = rootIds.map(buildNode);
      return {
        domainId: d.id,
        domainName: d.name,
        nodeList,
      };
    });
  }

  // 扁平视图（供 Breadcrumb 使用）
  function getFlatNotes() {
    return Object.values(nodeById.value);
  }

  function findNode(id) {
    return nodeById.value[id] || null;
  }

  function getPathToNode(id) {
    const path = [];
    let curr = nodeById.value[id];
    while (curr) {
      path.unshift(curr);
      if (!curr.parentId) break;
      curr = nodeById.value[curr.parentId];
    }
    return path;
  }

  // 更新节点的部分字段（如标题、logo 等），用于同步侧边栏和面包屑
  // 注意：替换整个节点引用和容器引用，确保依赖此数据的 computed 重新计算
  function updateNode(id, partial) {
    const node = nodeById.value[id];
    if (!node || !partial) return;
    const updated = { ...node, ...partial };
    nodeById.value = { ...nodeById.value, [id]: updated };
  }

  // 兼容入口：新增文件夹（根或某父节点下）
  function addFolder(domainId, node) {
    if (!domainById.value[domainId]) {
      domainById.value[domainId] = { id: domainId, name: "" };
    }
    const { child, ...rest } = node || {};
    const base = {
      ...rest,
      domainId,
      parentId: rest.parentId ?? null,
    };
    nodeById.value[base.id] = base;

    if (base.parentId === null) {
      if (!Array.isArray(rootNodeIdsByDomainId.value[domainId])) {
        rootNodeIdsByDomainId.value[domainId] = [];
      }
      rootNodeIdsByDomainId.value[domainId].push(base.id);
    } else {
      if (!Array.isArray(childrenByParentId.value[base.parentId])) {
        childrenByParentId.value[base.parentId] = [];
      }
      childrenByParentId.value[base.parentId].push(base.id);
    }
  }

  // 通用新增节点（支持文件夹或文档）
  function addNode(node) {
    if (!node || !node.id) return;
    const domainId = node.domainId;
    if (!domainById.value[domainId]) {
      domainById.value[domainId] = { id: domainId, name: "" };
    }
    const { child, ...rest } = node;
    const base = {
      ...rest,
      parentId: rest.parentId ?? null,
    };
    nodeById.value[base.id] = base;

    if (base.parentId === null) {
      if (!Array.isArray(rootNodeIdsByDomainId.value[domainId])) {
        rootNodeIdsByDomainId.value[domainId] = [];
      }
      rootNodeIdsByDomainId.value[domainId].push(base.id);
    } else {
      if (!Array.isArray(childrenByParentId.value[base.parentId])) {
        childrenByParentId.value[base.parentId] = [];
      }
      childrenByParentId.value[base.parentId].push(base.id);
    }
  }

  // 兼容入口：删除文档（按 id）
  function removeDoc(docId) {
    deleteNode(docId);
  }

  // 通用删除（递归移除节点及其子树）
  function deleteNode(id) {
    const node = nodeById.value[id];
    if (!node) return;

    // 先递归删除子节点
    const childIds = childrenByParentId.value[id] || [];
    for (const cid of childIds) {
      deleteNode(cid);
    }
    delete childrenByParentId.value[id];

    // 从父的 children 或 domain 根集合里移除
    if (node.parentId === null) {
      const roots = rootNodeIdsByDomainId.value[node.domainId] || [];
      rootNodeIdsByDomainId.value[node.domainId] = roots.filter(
        (x) => x !== id
      );
    } else {
      const siblings = childrenByParentId.value[node.parentId] || [];
      childrenByParentId.value[node.parentId] = siblings.filter(
        (x) => x !== id
      );
    }

    // 移除自身
    delete nodeById.value[id];
  }

  // 兼容旧接口（保持现有 Sidebar 等可逐步迁移）
  function getDomainList() {
    return getDomainTrees();
  }

  return {
    // 设置/派生
    setDomainList,
    getDomainList,
    getDomainTrees,
    getFlatNotes,
    findNode,
    getPathToNode,
    updateNode,
    // 操作
    addFolder,
    addNode,
    removeDoc,
    deleteNode,
  };
});
