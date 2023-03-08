import ViewUI from 'view-design'

// 提示  viewui通知提醒
var toast = {
    // 文字
    text: function(str, desc = '', position = 'middle') {
        if(!desc){
            if(str){
                if(str.length > 18){
                    desc = str || ''
                }
            }
        }
        ViewUI.Notice.info({
            title: str,
            desc: desc
        })
        console.log(str, desc, position)
    },
    // 成功
    success: function(str = '操作成功', desc = '', position = 'middle') {
        if(!desc){
            if(str){
                if(str.length > 18){
                    desc = str || ''
                }
            }
        }
        ViewUI.Notice.success({
            title: str,
            desc: desc
        })
        console.log(str, desc, position)
    },
    // 警告
    warn: function(str = '操作异常', desc = '', position = 'middle') {
        if(!desc){
            if(str){
                if(str.length > 18){
                    desc = str || ''
                }
            }
        }
        ViewUI.Notice.warning({
            title: str,
            desc: desc
        })
        console.log(str, desc, position)
    },
    // 错误
    error: function(str = '操作错误', desc = '', position = 'middle') {
        if(!desc){
            if(str){
                if(str.length > 18){
                    desc = str || ''
                }
            }
        }
        ViewUI.Notice.error({
            title: str,
            desc: desc
        })
        console.log(str, desc, position)
    },
    // 取消
    cancel: function(str = '取消操作', desc = '', position = 'middle') {
        ViewUI.Notice.info({
            title: str,
            desc: desc
        })
        console.log(str, desc, position)
    },
    // 隐藏
    hide: function() {}
}

export default toast