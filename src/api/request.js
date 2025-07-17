import axios from 'axios';
import router from '@/router';

console.log("import.meta.env.VITE_API_BASE_URL: " + import.meta.env.VITE_API_BASE_URL)
// 创建 axios 实例
const request = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json'
    }
});

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
                    console.error('请求参数错误:', res.message);
                    break;
                case 401:
                    localStorage.removeItem('token');
                    console.error('未授权，请重新登录:', res.message);
                    router.push('/login');
                    break;
                case 403:
                    console.error('没有权限访问该资源:', res.message);
                    break;
                case 404:
                    console.error('请求的资源不存在:', res.message);
                    break;
                case 500:
                    console.error('服务器错误:', res.message);
                    break;
                default:
                    console.error(res.message || '未知错误');
            }
            return Promise.reject(res); // 直接返回原始响应对象，保留完整错误信息
        }
    },
    error => {
        // 处理 HTTP 层面的错误
        if (error.response) {
            const errorMsg = error.response.data?.message || '请求失败';
            switch (error.response.status) {
                case 401:
                    localStorage.removeItem('token');
                    router.push('/login');
                    console.error('未授权，请重新登录:', errorMsg);
                    break;
                case 403:
                    console.error('没有权限访问该资源:', errorMsg);
                    break;
                case 404:
                    console.error('请求的资源不存在:', errorMsg);
                    break;
                case 500:
                    console.error('服务器错误:', errorMsg);
                    break;
                default:
                    console.error('发生错误:', errorMsg);
            }
            // 确保错误对象包含服务器返回的错误信息
            if (error.response.data) {
                error.message = error.response.data.message || errorMsg;
            }
        }
        return Promise.reject(error);
    }
);

export default request;