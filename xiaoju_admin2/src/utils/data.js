import Lockr from 'lockr'
// 数据存储
let data = {
    // 获取
    get: function(type, key) {
        Lockr.prefix = type
        var val = Lockr.get(key)
            // console.log('data get ', type, key, val)  //获取所有数据的url
        return val
    },
    // 设置
    set: function(type, key, val) {
        Lockr.prefix = type
        Lockr.set(key, val)
        if(key != 'auths'){
            // console.log('data set ', type, key, val)
        }
        return val
    },
    // 清除
    clear: function(type) {
        // 清空含有type的键值对
        if (!type) {
            return
        }
        var sum = window.localStorage.length
        for (var i = 0; i < sum; i++) {
            var key = window.localStorage.key(i)
            if (key && key.indexOf(type) >= 0) {
                window.localStorage.removeItem(key)
                console.log('data remove ', type, key)
            }
        }
    },
    // 清除所有
    clearAll: function() {
        // 清空含有type的键值对
        this.clear('storage')
    }
}
export default data