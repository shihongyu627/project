// 存储
var storage = {
    // 存储初始化
    init: function() {
        this.clear()
    },
    // 清空
    clear: function() {
        $utils.data.clear('storage')
    },
    // 获取
    get: function(key) {
        return $utils.data.get('storage', key)
    },
    // 设置
    set: function(key, val) {
        return $utils.data.set('storage', key, val)
    },
    // 获取/设置
    getset: function(key, val) {
        if (!val) {
            val = $utils.data.get('storage', key)
                // 不缓存
                // val = ''
            if (!val) {
                return false
            }
        } else {
            $utils.data.set('storage', key, val)
        }
        return val
    },
    // 获取/设置
    getdata: function(url, p = {}, method = 'get', config = {}, isfresh = false) {
        var q = JSON.stringify(p)
        var name = url
        if (q) {
            name = name + '_' + q
        }
        return new Promise((resolve, reject) => {
            var v = this.getset(name, null)
            if (v && !isfresh) return resolve(v)
            $utils.api.load(url, p, method, config)
                .then((result) => {
                    if (result.status) {
                        // console.log(result.data)
                        this.getset(name, result.data)
                        resolve(result.data)
                    }
                    resolve(null)
                })
        })
    }
}

export default storage