import { defineStore } from "pinia";
import { ref } from "vue";
import { NodeType } from "@/enums/NodeType";

export const useDomainStore = defineStore("domain", () => {
    const domainList = ref([]);

    const domainMap = ref({});

    const folderMap = ref({});

    const folderChildrenMap = ref({});

    const folderDocumentMap = ref({});

    const init = (data) => {
        domainList.value = data.domainList || [];
        domainMap.value = data.domainMap || {};
        folderMap.value = data.folderMap || {};
        folderChildrenMap.value = data.folderChildrenMap || {};
        folderDocumentMap.value = data.folderDocumentMap || {};
    }

    const getDomainTree = () => {
        const result = [];
        const dList = Array.isArray(domainList.value) ? domainList.value : [];
        for (const domainId of dList) {
            const domain = domainMap.value?.[domainId] || {};
            const buildFolderNode = (folderId, depth) => {
                const folder = folderMap.value?.[folderId] || {};
                const base = {
                    id: folder.id,
                    domainId: folder.domainId,
                    type: NodeType.FOLDER,
                    title: folder.name,
                    logo: folder.logo || "📂",
                    depth: depth || 0,
                    parentId: folder.parentId ?? null,
                    child: []
                };
                const childFolderIds = folderChildrenMap.value?.[folderId] || [];
                const childFolders = Array.isArray(childFolderIds)
                    ? childFolderIds.map((cid) => buildFolderNode(cid, (depth || 0) + 1))
                    : [];
                const docs = folderDocumentMap.value?.[folderId] || [];
                const docNodes = Array.isArray(docs)
                    ? docs.map((doc) => ({
                        id: doc.id,
                        domainId: folder.domainId,
                        type: NodeType.DOCUMENT,
                        title: doc.title,
                        logo: doc.logo || "📝",
                        depth: (depth || 0) + 1,
                        parentId: folder.id,
                        child: []
                    }))
                    : [];
                base.child = [...childFolders, ...docNodes];
                return base;
            };

            const rootFolderIds = folderChildrenMap.value?.[domainId] || [];
            const nodeList = Array.isArray(rootFolderIds)
                ? rootFolderIds.map((fid) => buildFolderNode(fid, 0))
                : [];
            result.push({
                domainId: domain.id ?? domainId,
                domainName: domain.name ?? "",
                nodeList
            });
        }
        return result;
    }

    const addNode = (node) => {
        if (!node || !node.id) return;
        const isFolder = node.type === NodeType.FOLDER;
        if (isFolder) {
            const base = {
                id: node.id,
                domainId: node.domainId,
                parentId: node.parentId ?? null,
                name: node.title,
                logo: node.logo
            };
            folderMap.value[base.id] = base;
            if (base.parentId === null) {
                if (!Array.isArray(folderChildrenMap.value[node.domainId])) {
                    folderChildrenMap.value[node.domainId] = [];
                }
                folderChildrenMap.value[node.domainId].push(base.id);
            } else {
                if (!Array.isArray(folderChildrenMap.value[base.parentId])) {
                    folderChildrenMap.value[base.parentId] = [];
                }
                folderChildrenMap.value[base.parentId].push(base.id);
            }
        } else {
            const doc = {
                id: node.id,
                folderId: node.parentId,
                title: node.title,
                logo: node.logo,
                type: node.type
            };
            if (!Array.isArray(folderDocumentMap.value[node.parentId])) {
                folderDocumentMap.value[node.parentId] = [];
            }
            folderDocumentMap.value[node.parentId].push(doc);
        }
    }

    const deleteNode = (id) => {
        if (!id) return;
        if (folderMap.value[id]) {
            const folder = folderMap.value[id];
            const childFolders = folderChildrenMap.value[id] || [];
            for (const cid of childFolders) deleteNode(cid);
            delete folderChildrenMap.value[id];
            delete folderDocumentMap.value[id];
            if (folder.parentId === null) {
                const roots = folderChildrenMap.value[folder.domainId] || [];
                folderChildrenMap.value[folder.domainId] = roots.filter((x) => x !== id);
            } else {
                const siblings = folderChildrenMap.value[folder.parentId] || [];
                folderChildrenMap.value[folder.parentId] = siblings.filter((x) => x !== id);
            }
            delete folderMap.value[id];
            return;
        }
        for (const key of Object.keys(folderDocumentMap.value)) {
            const list = folderDocumentMap.value[key] || [];
            const idx = list.findIndex((d) => d.id === id);
            if (idx >= 0) {
                list.splice(idx, 1);
                folderDocumentMap.value[key] = [...list];
                break;
            }
        }
    }

    const updateNode = (id, partial) => {
        if (!id || !partial) return;
        if (folderMap.value[id]) {
            const old = folderMap.value[id];
            folderMap.value[id] = {
                ...old,
                name: partial.title ?? old.name,
                logo: partial.logo ?? old.logo
            };
            return;
        }
        for (const key of Object.keys(folderDocumentMap.value)) {
            const list = folderDocumentMap.value[key] || [];
            const idx = list.findIndex((d) => d.id === id);
            if (idx >= 0) {
                const updated = {
                    ...list[idx],
                    title: partial.title ?? list[idx].title,
                    logo: partial.logo ?? list[idx].logo
                };
                const copy = [...list];
                copy[idx] = updated;
                folderDocumentMap.value[key] = copy;
                break;
            }
        }
    }

    const getFlatNotes = () => {
        const folders = Object.values(folderMap.value).map((f) => ({
            id: f.id,
            domainId: f.domainId,
            type: NodeType.FOLDER,
            title: f.name,
            logo: f.logo || "📂",
            parentId: f.parentId ?? null,
        }));
        const docs = Object.entries(folderDocumentMap.value).flatMap(([folderId, list]) =>
            (list || []).map((d) => ({
                id: d.id,
                domainId: folderMap.value[folderId]?.domainId,
                type: NodeType.DOCUMENT,
                title: d.title,
                logo: d.logo || "📝",
                parentId: folderId,
            }))
        );
        return [...folders, ...docs];
    }

    const findNode = (id) => {
        const f = folderMap.value[id];
        if (f) {
            return {
                id: f.id,
                domainId: f.domainId,
                type: NodeType.FOLDER,
                title: f.name,
                logo: f.logo || "📂",
                parentId: f.parentId ?? null,
            };
        }
        for (const key of Object.keys(folderDocumentMap.value)) {
            const list = folderDocumentMap.value[key] || [];
            const doc = list.find((d) => d.id === id);
            if (doc) {
                const domainId = folderMap.value[key]?.domainId;
                return {
                    id: doc.id,
                    domainId,
                    type: NodeType.DOCUMENT,
                    title: doc.title,
                    logo: doc.logo || "📝",
                    parentId: key,
                };
            }
        }
        return null;
    }

    const getPathToNode = (id) => {
        const path = [];
        let curr = findNode(id);
        while (curr) {
            path.unshift(curr);
            if (!curr.parentId) break;
            curr = findNode(curr.parentId);
        }
        return path;
    }

    return { init, getDomainTree, addNode, deleteNode, updateNode, getFlatNotes, findNode, getPathToNode };
});
