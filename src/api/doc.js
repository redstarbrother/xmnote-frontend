import request from './request';

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
export const updateDocument = (data) => {
    return request({
        url: '/doc/updateDocument',
        method: 'post',
        data: data
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
