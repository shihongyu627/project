<script>
import baseEdit from '@/views/components/base/baseEdit.vue'
export default {
    extends: baseEdit,
    components: {
    },
    data () {
        return {
            mname: 'productClass',
            items: [
                {label: '基本信息', desc: '表单的基本信息', type: 'header'},
                {label: '父级', name: 'pid', value: 0, type: 'tree', dropList:[
                    ], rules: [{ required: true, trigger: 'blur', type:'number' }]},
                {label: '名称', name: 'name', value: '', type: 'input', rules: [{ required: true, trigger: 'blur' }]},
                {label: '图标', name: 'image', value: '',  type: 'image',  rules: [{ required: false, trigger: 'blur' }]},
                {label: '状态', name: 'status', value: 1,  type: 'switch', trueValue:1, falseValue:2 },
            ],
            forms: {},
        }
    },
    created () {
        this.loadItemsFieldDrop('product_class', 'pid')
    },
    methods: {
        loadItemsFieldDrop (type, field) {
            // 通过pk查询字典数据
            let q = {}
            q.pid = 0
            let apiname = ''
            if(type == 'product_class') {
                apiname = 'productClassDropTree'
            }
            $utils.api.load(apiname, q).then((res) => {
                if(res && res.data){
                    let ll = res.data
                    let dropList = []
                    dropList.push({value:0, name:'顶级分类'})
                    for (let index = 0; index < ll.length; index++) {
                        const element = ll[index];
                        let xx = {}
                        xx.value = element.class_id
                        xx.name = element.name
                        xx.pid = element.pid
                        xx.children = element.children || []
                        dropList.push(xx)
                    }
                    for (let index = 0; index < this.items.length; index++) {
                        const element = this.items[index];
                        if(element && element.name == field && element.type == 'tree') {
                            this.items[index]['dropList'] = dropList
                        }
                    }
                    console.log('dropList ' + field, dropList)
                }
            })
        },
    }
}
</script>
