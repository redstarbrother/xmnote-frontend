import request from './request';

// 获取文档列表
export const getDirInfo = (params) => {
    return request({
        url: '/folder/getDirInfo',
        method: 'get',
        params: {
            ...params
        }
    });
};

// 创建目录
export const createFolder = (params) => {
    return request({
        url: '/folder/createFolder',
        method: 'post',
        params: {
            ...params
        }
    });
};

// 更新目录
export const updateFolder = (params) => {
    return request({
        url: '/folder/updateFolder',
        method: 'post',
        params: {
            ...params
        }
    });
};

// 创建文档
export const createDocument = (params) => {
    return request({
        url: '/doc/createDocument',
        method: 'post',
        params: {
            ...params
        }
    });
};

// 更新文档
export const updateDoc = (params) => {
    return request({
        url: '/doc/updateDoc',
        method: 'post',
        params: {
            ...params
        }
    });
};

// 删除文档
export const deleteDocument = (params) => {
    return request({
        url: '/doc/deleteDocument',
        method: 'post',
        params: {
            ...params
        }
    });
};

// 获取文档
export const getDocument = (params) => {
    return request({
        url: '/doc/getDocument',
        method: 'get',
        params: {
            ...params
        }
    });
};
