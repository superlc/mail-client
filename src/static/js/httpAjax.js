import axios from 'axios'
import { createBrowserHistory } from 'history'
import Toast from '../../components/comp.toast/index'
import { BaseUrl } from '../../config/envConfig'
import cookie from 'react-cookies';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = BaseUrl;
axios.interceptors.request.use(
  (config) => {
    config.url !== 'login' && !cookie.load('session') && (window.location.href = "/login");
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  (response) => {
    const { status } = response
    if (status === 200) {
      return response.data
    }
    return Promise.reject('')
  },
  (error) => {
    const { status, data } = error.response
    status === 401 && (window.location.href = "/login");
    return Promise.reject(data)
  }
)

const httpAjax = function (params) {
  return axios(params)
}

export default httpAjax
