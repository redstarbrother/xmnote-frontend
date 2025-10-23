import axios from 'axios';
import router from '@/router';
import { ElMessage } from 'element-plus';

console.log("import.meta.env.VITE_API_BASE_URL: " + import.meta.env.VITE_API_BASE_URL)
// 创建 axios 实例
const request = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const setBaseUrl = (baseUrl) => {
    console.log("setBaseUrl: " + baseUrl);
    request.defaults.baseURL = baseUrl;
};

// 请求拦截器
request.interceptors.request.use(
    config => {
        // 从 localStorage 获取 token
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// 响应拦截器
request.interceptors.response.use(
    response => {
        const res = response.data;
        if (res.code === 200) {
            return res;
        } else {
            console.log('响应拦截器拦截异常:', res);
            // 处理业务层面的错误
            switch (res.code) {
                case 400:
                    ElMessage.error('请求参数错误');
                    break;
                case 401:
                    localStorage.removeItem('token');
                    ElMessage.error('未授权，请重新登录');
                    router.push('/login');
                    break;
                case 403:
                    ElMessage.error('没有权限访问该资源');
                    break;
                case 404:
                    ElMessage.error('请求的资源不存在');
                    break;
                case 500:
                    ElMessage.error('服务器错误, ' + res.message);
                    break;
                default:
                    ElMessage.error(res.message || '未知错误');
            }
            return Promise.reject(res); // 直接返回原始响应对象，保留完整错误信息
        }
    },
    error => {
        // 处理 HTTP 层面的错误
        if (error.response) {
            ElMessage.error(error.response.data.message || '未知错误');
        } else {
            ElMessage.error(error.message || '未知错误');
        }
        return Promise.reject(error);
    }
);

export default request;