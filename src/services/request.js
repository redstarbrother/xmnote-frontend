import axios from 'axios';

const defaultBaseUrl = 'localhost:8080'

// 创建 axios 实例
const service = axios.create({
    baseURL: process.env.BASE_URL || defaultBaseUrl, // 基础路径
    timeout: 10000, // 请求超时时间（毫秒）
    headers: {
        'Content-Type': 'application/json', // 默认请求头
    },
});

// 请求拦截器
service.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // 从本地存储中获取 token
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`; // 携带 token
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器
service.interceptors.response.use(
    (response) => {
        const res = response.data;
        if (res.code !== 200) {
            // 自定义错误处理
            console.error(res.message || 'Error');
            return Promise.reject(new Error(res.message || 'Error'));
        }
        return res; // 返回实际数据
    },
    (error) => {
        console.error(error.message || 'Network Error');
        return Promise.reject(error);
    }
);

// 导出封装的 axios 实例
export default service;
