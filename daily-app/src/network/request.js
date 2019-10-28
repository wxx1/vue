///将第三方包封装，降低后期维护代价
import axios from 'axios'

/**
 * 
 * @param {具体请求配置信息} config 
 */
export function apiRequest(config){
    const api = axios.create({
        baseURL:'http://127.0.0.1:3000',
        timeout:5000
    })
    return api(config)
}

/**
 * 封装图片请求
 */
export function imgResquest(config){
    const img = axios.create({
        baseURL:'http://127.0.0.1:3001',
        timeout:10000
    })
    return img(config)
}