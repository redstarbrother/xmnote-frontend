import request from './request';

// 创建文档
export const createDocument = (params) => {
    return request({
        url: '/doc/createDocument',
        method: 'post',
        // params: {
        //     ...params
        // }
        data: params
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
export const deleteDocument = (data) => {
    return request({
        url: '/doc/deleteDocument',
        method: 'post',
        data: data
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

// 获取上传图片的直传链接
export const getUploadUrl = (params) => {
    return request({
        url: '/doc/getUploadUrl',
        method: 'get',
        params: params
    });
};
