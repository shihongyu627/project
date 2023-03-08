<script>
import baseEdit from '@/views/components/base/baseEdit.vue'
export default {
    extends: baseEdit,
    components: {
    },
    data () {
        return {
            mname: 'feedback',
            items: [
                {label: '基本信息', desc: '表单的基本信息', type: 'header'},
                {label: '标题', name: 'title', value: '', type: 'input', rules: [{ required: true, trigger: 'blur' }]},
                {label: '反馈内容', name: 'content', value: '',  type: 'textarea', },
                {label: '反馈截图', name: 'gallery', value: '',  type: 'image',  rules: [{ required: true, trigger: 'blur' }]},
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
