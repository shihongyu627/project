<script>
import baseEdit from '@/views/components/base/baseEdit.vue'
export default {
    extends: baseEdit,
    components: {
    },
    data () {
        return {
            mname: 'helpClass',
            items: [
                {label: '基本信息', desc: '表单的基本信息', type: 'header'},
                {label: '父级', name: 'pid', value: 0, type: 'tree', dropList:[
                    {value: 0, name: '顶级分类'}
                    ], rules: [{ required: true, trigger: 'blur', type:'number' }]},
                {label: '名称', name: 'name', value: '', type: 'input', rules: [{ required: true, trigger: 'blur' }]},
                {label: '图标', name: 'icon', value: '',  type: 'image', desc: '建议图片宽高尺寸512*512像素及以上', rules: [{ required: false, trigger: 'blur' }]},
                // {label: '图示', name: 'image', value: '',  type: 'image',  rules: [{ required: false, trigger: 'blur' }]},
                {label: '状态', name: 'status', value: 1,  type: 'switch', trueValue:1, falseValue:2 },
            ],
            forms: {},
        }
    },
    created () {
        this.loadItemsFieldDrop('help_class_tree', 'pid')
    },
    methods: {
    }
}
</script>
