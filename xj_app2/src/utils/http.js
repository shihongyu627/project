import Taro from "@tarojs/taro"

export default class http {
    static get(url, params, config) {
        return new Promise((resolve, reject) => {
            Taro.request({
                url: url,
                data: params,
                method: "GET",
                success: function(res) {
                    resolve(res.data)
                },
                fail: function(res) {
                    reject(res)
                },
                header: {
                    'content-type': 'application/json',
                    'Authorization': Taro.getStorage('userInfo')
                },
                ...config
            })
        })
    }
    static post(url, params, config) {
        return new Promise((resolve, reject) => {
            Taro.request({
                url: url,
                data: params,
                method: "POST",
                success: function(res) {
                    resolve(res.data)
                },
                fail: function(res) {
                    reject(res)
                },
                header: {
                    'content-type': 'application/json',
                    'Authorization': Taro.getStorage('userInfo')
                },
                ...config
            })
        })
    }

}
