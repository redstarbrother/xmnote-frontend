import request from './request';

// 获取文档树
export const getDomainTree = () => {
    return request({
        url: '/folder/getDomainTree',
        method: 'get'
    });
};

// 创建目录
export const createFolder = (data) => {
    return request({
        url: '/folder/createFolder',
        method: 'post',
        data: data
    });
};

// 更新目录
export const updateFolder = (data) => {
    return request({
        url: '/folder/updateFolder',
        method: 'post',
        data: data
    });
};

// 删除目录
export const deleteFolder = (data) => {
    return request({
        url: '/folder/deleteFolder',
        method: 'post',
        data: data
    });
};