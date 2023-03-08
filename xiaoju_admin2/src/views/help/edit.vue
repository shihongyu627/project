<script>
import baseEdit from '@/views/components/base/baseEdit.vue'
export default {
  extends: baseEdit,
  components: {},
  data() {
    return {
      mname: 'help',
      items: [
        { label: '基本信息', desc: '表单的基本信息', type: 'header' },
        { label: '分类', name: 'class_id', value: '', type: 'tree', dropList: [], rules: [{ required: false, trigger: 'blur', type: 'number' }] },
        { label: '标题', name: 'title', value: '', type: 'input', rules: [{ required: true, trigger: 'blur' }] },
        // {label: '封面图', name: 'image', value: '',  type: 'image',  rules: [{ required: false, trigger: 'blur' }]},
        { label: '简介', name: 'content', value: '', type: 'textarea' },
        { label: '详情', name: 'detail', value: '', type: 'editor' },
        { label: '置顶', name: 'is_top', value: 0, type: 'switch', trueValue: 1, falseValue: 0 },
        { label: '状态', name: 'status', value: 1, type: 'switch', trueValue: 1, falseValue: 2 },
      ],
      forms: {},
    }
  },
  created() {
    this.loadItemsFieldDrop('help_class_tree', 'class_id')
    let query = this.$route.query
    this.action = query.action
    this.forms.type = query.type || ''
    if (parseInt(query.type) != 1) {
      // 隐藏分类
      this.items[this.indexOfName('class_id')]['type'] = 'hidden'
    }
    if (query.action === 'add') {
      // 添加初始化
    } else if (query.action === 'edit') {
      this.kv = query.kv
      this.initData()
    } else {
      $utils.toast.error('请求方式异常')
    }
  },
  methods: {
    initData() {
      $form.initData(this, '', async (val) => {
        this.forms = val
        if (parseInt(val.type) != 1) {
          this.items[this.indexOfName('class_id')]['type'] = 'hidden'
        }
        this.$forceUpdate()
      })
    },
  },
}
</script>
