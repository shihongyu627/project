<script>
import baseEdit from '@/views/components/base/baseEdit.vue'
export default {
    extends: baseEdit,
    components: {
    },
    data () {
        return {
            mname: 'shorturl',
            items: [
                {label: '基本信息', desc: '表单的基本信息', type: 'header'},
                {label: 'CODE', name: 'code', value: '', type: 'input', disabled: true},
                {label: '原链接', name: 'source_url', value: '', type: 'input', rules: [{ required: true, trigger: 'blur' }]},
                {label: '类型', name: 'type', value: 'home_banner', type: 'select', dropList:[
                    {value: 'default', name: '默认'},
                    {value: 'form', name: '表单'},
                    {value: 'goods', name: '商品'},
                    {value: 'article', name: '文章'},
                ], rules: [{ required: true, trigger: 'blur' }]},
                {label: '内容', name: 'content', value: '',  type: 'textarea', },
                {label: '备注', name: 'remark', value: '',  type: 'textarea', },
                {label: '状态', name: 'status', value: 1,  type: 'switch', trueValue:1, falseValue:2 },
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

