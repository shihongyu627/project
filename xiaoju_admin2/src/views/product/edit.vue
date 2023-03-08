<script>
import baseEdit from '@/views/components/base/baseEdit.vue'
export default {
    extends: baseEdit,
    components: {
    },
    data () {
        return {
            mname: 'product',
            items: [
                {label: '产品信息', desc: '表单的基本信息', type: 'header'},
                {label: '产品分类', name: 'class_id', value: '', type: 'select', disabled:false, dropList:[], rules: [{ required: true, trigger: 'blur', type: 'number' }]},
                {label: '产品类型', name: 'type', value: '', type: 'select', dropList:[
                    {value: 1, name: '单车常规款'},
                    {value: 3, name: '单车智能款'},
                    {value: 2, name: '电动车智能款'},
                ], rules: [{ required: true, trigger: 'blur', type: 'number' }]},
                {label: '产品名称', name: 'name', value: '', type: 'input', rules: [{ required: true, trigger: 'blur' }]},
                {label: '产品图片', name: 'image', value: '',  type: 'image',  desc: '建议图片宽高尺寸720*720像素及以上',  rules: [{ required: true, trigger: 'blur' }]},
                {label: '品牌', name: 'brand', value: '', type: 'input', rules: [{ required: false, trigger: 'blur' }]},
                {label: '厂家联系人', name: 'linkman_name', value: '', type: 'input', rules: [{ required: false, trigger: 'blur' }]},
                {label: '厂家联系方式', name: 'linkman_mobile', value: '', type: 'input', rules: [{ required: false, trigger: 'blur' }]},
                {label: '简介', name: 'profile', value: '',  type: 'textarea', },
                {label: '备注', name: 'remark', value: '',  type: 'textarea', },
            ],
            forms: {},
        }
    },
    created () {
        this.loadItemsFieldDrop('product_class', 'class_id')
    },
    methods: {
    }
}
</script>
