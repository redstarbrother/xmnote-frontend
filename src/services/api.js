import request from './request';

// 用户相关接口
export const getUserInfo = () => {
    return request({
        url: '/user/info',
        method: 'get',
    });
};

export const login = (data) => {
    return request({
        url: '/user/login',
        method: 'post',
        data,
    });
};

// 其他接口
export const fetchItems = (params) => {
    return request({
        url: '/items',
        method: 'get',
        params,
    });
};
