import axios from 'axios';
import { store } from '../app/store';

const baseUrl = 'https://belieforever.cn/';

axios.defaults.baseURL = baseUrl;
axios.defaults.withCredentials = true;


axios.interceptors.request.use(
    (config) => {
        const token = store.getState().token.token;
        config.headers['Authorization'] = `Bearer ${token}`;
        return config;
    },
    err => Promise.reject(err)
);

axios.interceptors.response.use(
    (res) => {
        const { status } = res
        if (status === 200) {
            return res.data
        }
        return Promise.reject('')
    },
    err => {
        const { status, data } = err.response;
        status === 401 && (window.location.href = "/login");
        return Promise.reject(data);
    }
);

export default axios;