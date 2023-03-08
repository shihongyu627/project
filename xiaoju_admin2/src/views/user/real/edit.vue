<script>
import baseEdit from '@/views/components/base/baseEdit.vue'
export default {
    extends: baseEdit,
    components: {
    },
    data () {
        return {
            mname: 'userReal',
            items: [
                {label: '基本信息', desc: '表单的基本信息', type: 'header'},
                {label: '关联用户', name: 'uid', value: '', type: 'uid', disabled:false, query: {user_type:1}, rules: [{ required: true, trigger: 'blur', type: 'number' }]},
                {label: '真实姓名', name: 'realname', value: '', type: 'input', rules: [{ required: true, trigger: 'blur' }]},
                {label: '旺旺号', name: 'taobao_wangwang', value: '', type: 'input', rules: [{ required: true, trigger: 'blur' }]},
                {label: '身份证号', name: 'idcard', value: '', type: 'input', rules: [{ required: true, trigger: 'blur' }]},
                {label: '手持身份证', name: 'idcardimg3', value: '',  type: 'image',  rules: [{ required: true, trigger: 'blur' }]},
                {label: '凭证图集', name: 'gallery', value: '',  type: 'image',  rules: [{ required: true, trigger: 'blur' }]},
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
