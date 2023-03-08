/*
 * @Author: your name
 * @Date: 2021-04-20 14:43:52
 * @LastEditTime: 2021-04-27 18:55:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /gitee-ai-platform/src/utils/request.js
 */
import axios from 'axios'
import { Message } from 'element-ui'
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
if(process.env.VUE_APP_BASE_API == "http://47.94.5.239/eiotapi"){
  axios.defaults.headers['Token'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MzMxNDI1MTksInVzZXJpZCI6MSwiaWF0IjoxNjMxMzQyNTE5LCJsb2dpbl91c2VyX2tleSI6ImJkNmIxNDdkLTZiZDMtNDNlZi05ZGQwLWJiODBiNDAyNjY4NCJ9.IM9cfSx6XPgwYwSG8ihipLp5XcdzwHRimpeeKvC8y5E'
}else{
  axios.defaults.headers['Token'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MzI3MTcyNzksInVzZXJpZCI6MSwiaWF0IjoxNjMwOTE3Mjc5LCJsb2dpbl91c2VyX2tleSI6IjMxNzg0MzhjLTdkMjgtNDQwYy1hMmM5LWI3OWNmOGE5Y2E4MiJ9.f1PxjekFtNuPgsUZsi88Bct0q0JYvwPcnbjIOWOU1Nc'
}
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})
service.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 20000) {
      return res
    } else {
      return Promise.reject(new Error(res.message || 'Error'))
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
