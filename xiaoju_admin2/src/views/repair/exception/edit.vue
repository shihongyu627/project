<script>
import baseEdit from '@/views/components/base/baseEdit.vue'
export default {
    extends: baseEdit,
    components: {
    },
    data () {
        return {
            mname: 'repair',
            items: [
                {label: '基本信息', desc: '表单的基本信息', type: 'header'},
                {label: '异常部件', name: 'tags', value: '', type: 'input', rules: [{ required: true, trigger: 'blur' }]},
                {label: '异常内容', name: 'content', value: '',  type: 'textarea', },
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
