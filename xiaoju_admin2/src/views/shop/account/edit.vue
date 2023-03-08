<script>
import baseEdit from '@/views/components/base/baseEdit.vue'
export default {
    extends: baseEdit,
    components: {
    },
    data () {
        return {
            mname: 'shopAccount',
            items: [
                {label: '账号信息', desc: '登录账号基本信息', type: 'header'},
                {label: '手机号', name: 'user_mobile', value: '', type: 'input', rules: [{ required: false, trigger: 'blur' }]},
                {label: '登录密码', name: 'password', value: '', type: 'password', desc: '更新账户时，如不需要修改密码，请留空'},
                {label: '备注', name: 'remark', value: '',  type: 'textarea', },
            ],
            forms: {},
        }
    },
    created () {
    },
    methods: {
    }
}
</script>
