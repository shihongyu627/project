
// 表单通用操作方法
var $form = {
    // 提交通用方法， 特殊方法需要自行编写

    /**
     * 初始化数据
     * @param {string} _this 组件本身
     * @param {string} edata 附加值
     * @param {function} callback 回调函数
     */
    initData (_this, edata={}, callback = null , loading = true) {
        if(loading){
            $utils.loading.cardshow()    // 加载数据进度
        }
        let q = {}
        // q.mname = _this.mname   // 模块名称
        q.kv = _this.kv
        if(edata){
            Object.assign(q, edata)   // 表名 + 主键 + 附加值
        }
        $utils.api.load(_this.url&&_this.url.get || (_this.mname+'Get'), q).then((res)=>{
            $utils.loading.cardhide()
            if (res.data) {
                // 回调数据
                if(callback){
                    return callback(res.data)
                }
                if (_this.formItem){
                    _this.formItem = res.data
                }
                if (_this.forms){
                    _this.forms = res.data
                }
            }
        }).catch((e) => {
            console.log(e)
            $utils.loading.cardhide()
            $utils.toast.error('数据异常');
        })
    },

    /**
     * 提交表单
     * @param {string} _this 组件本身
     * @param {string} urlname 提交成功后的跳转链接
     * @param {function} callback 回调函数
     */
    handleSubmit (_this, edata={}, callback = null) {
        _this.sloading = true;    // 提交进度
        let q = {}
        // q.mname = _this.mname   // 模块名称
        q.kv = _this.kv         // 主键
        Object.assign(q, _this.formItem || _this.forms || {})   // 表名 + 主键 + 表单值
        if(edata){
          Object.assign(q, edata)   // + 附加值
        }
        let ajaxtype = '' // 请求链接
        // 新增
        if (_this.action == 'add') {
            ajaxtype = _this.url&&_this.url.add || (_this.mname+'Add')   // 表 添加
        }
        // 更新
        if (_this.action == 'edit') {
            ajaxtype = _this.url&&_this.url.edit || (_this.mname+'Edit')  // 表 编辑
        }
        $utils.api.load(ajaxtype, q, 'post').then((res)=>{
          _this.sloading = false;
            if(res.status){
                let ssc = (_this.formItem&&_this.formItem.title) ||  (_this.formItem&&_this.formItem.name) || (_this.forms&&_this.forms.title) ||  (_this.forms&&_this.forms.name) || '';
                if(ssc){
                    $utils.toast.success('保存成功','《' + ssc + '》保存成功');
                }else{
                    $utils.toast.success('保存成功');
                }
                // 回调数据
                if(callback){
                    return callback(res.data)
                }
                // 返回
                $utils.url.go(-1)
            }
        }).catch((e) => {
            console.log(e)
            _this.sloading = false;
            $utils.toast.error('保存异常');
        })
    }
}

window.$form = $form
export default $form;
