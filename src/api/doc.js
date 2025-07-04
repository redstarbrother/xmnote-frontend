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

// 获取用户详情
export const getUserInfoById = (userId) => {
    return request({
        url: '/user/getUserInfoById',
        method: 'get',
        params: {
            userId
        }
    });
};

export const getUserInfoByOpenId = (openId) => {
    return request({
        url: '/user/getUserInfoByOpenId',
        method: 'get',
        params: {
            openId
        }
    });
};

// 更新用户信息
export const updateUser = (userForm) => {
    return request({
        url: '/user/updateUser',
        method: 'post',
        data: userForm
    });
};

// 删除用户
export const deleteUser = (userId) => {
    return request({
        url: '/user/deleteUser',
        method: 'post',
        params: {
            userId
        }
    });
};

// 获取用户设置
export const getUserSettings = () => {
    return request({
        url: '/user/settings',
        method: 'get'
    });
};

// 更新用户设置
export const updateUserSettings = (settings) => {
    return request({
        url: '/user/settings',
        method: 'put',
        data: settings
    });
};

// 上传头像
export const uploadAvatar = (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return request({
        url: '/user/avatar',
        method: 'post',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

// 添加角色
export const addRole = (formData) => {
    return request({
        url: '/user/addRole',
        method: 'post',
        data: formData,
    });
};