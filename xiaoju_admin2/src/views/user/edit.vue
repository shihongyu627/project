<script>
import baseEdit from '@/views/components/base/baseEdit.vue'
export default {
    extends: baseEdit,
    components: {
    },
    data () {
        return {
            mname: 'user',
            items: [
                {label: '账号信息', desc: '登录账号基本信息', type: 'header'},
                // {label: '用户名', name: 'username', value: '',  type: 'input', },
                // {label: '用户类型', name: 'user_type', value: 1, type: 'select', dropList:[
                //     {value: 1, name: '普通用户'},
                //     {value: 5, name: '车辆运营员'},
                // ], rules: [{ required: false, trigger: 'blur', type: 'number' }]},
                {label: '手机号', name: 'user_mobile', value: '', type: 'input', rules: [{ required: true, trigger: 'blur' }]},
                {label: '登录密码', name: 'password', value: '', type: 'password', desc: '更新账户时，如不需要修改密码，请留空'},
                {label: '昵称', name: 'user_nick', value: '',  type: 'input', },
                {label: '头像', name: 'user_head', value: '',  type: 'avatar', desc: '建议图片宽高尺寸512*512像素及以上', rules: [{ required: false, trigger: 'blur' }]},
                {label: '性别', name: 'user_gender', value: '', type: 'select',  dropList:[
                    {value: 1, name: '男'},
                    {value: 2, name: '女'},
                    {value: 0, name: '未知'},
                ], rules: [{ required: false, trigger: 'blur', type: 'number' }]},
                {label: '邮箱', name: 'user_email', value: '',  type: 'input', },
                {label: '备注', name: 'remark', value: '',  type: 'textarea', },
            ],
            forms: {},
        }
    },
    created () {
    },
    methods: {
        handleSubmit() {
          this.$refs.form.validate((valid) => {
            console.log("handleSubmit forms", valid, this.forms);
            if (valid) {
                this.forms.title = this.forms.user_nick
                $form.handleSubmit(this);
            }
          });
        },
    }
}
</script>

