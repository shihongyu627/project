<script>
import baseEdit from '@/views/components/base/baseEdit.vue'
export default {
  extends: baseEdit,
  components: {},
  data() {
    return {
      mname: 'shopStoreTag',
      items: [
        { label: '基本信息', desc: '表单的基本信息', type: 'header' },
        { label: '标记类型', name: 'type', value: '', type: 'select', dropList: [{ value: 1, name: '排除车辆' }], rules: [{ required: true, trigger: 'blur', type: 'number' }] },
        { label: '关联商家', name: 'shop_id', value: '', type: 'select', dropList: [], onChange: this.shopChange.bind(this), rules: [{ required: true, trigger: 'blur', type: 'number' }] },
        { label: '关联区域', name: 'store_id', value: '', type: 'select', dropList: [], onChange: this.storeChange.bind(this), rules: [{ required: true, trigger: 'blur', type: 'number' }] },
        { label: '车辆编号', name: 'device_id', value: '', type: 'select', dropList: [], rules: [{ required: true, trigger: 'blur', type: 'number' }] },
        { label: '开始时间', name: 'start_time', type: 'datetime', rules: [{ required: true, trigger: 'blur', type: 'string' }] },
        { label: '结束时间', name: 'end_time', type: 'datetime', rules: [{ required: true, trigger: 'blur', type: 'string' }] },
        // { label: '状态', name: 'status', value: 1, type: 'switch', trueValue: 1, falseValue: 0 },
        { label: '备注', name: 'remark', type: 'textarea' },
      ],
      forms: {},
    }
  },
  async created() {
    await this.loadItemsFieldDrop('shop', 'shop_id')
  },
  methods: {
    initData() {
      $form.initData(this, '', async (val) => {
        this.forms = val
        this.items[this.indexOfName('type')]['disabled'] = true
        this.items[this.indexOfName('shop_id')]['disabled'] = true
        this.items[this.indexOfName('store_id')]['disabled'] = true
        this.items[this.indexOfName('device_id')]['disabled'] = true
        await this.shopChange(val.shop_id, true)
        await this.storeChange(val.store_id, true)
        this.$forceUpdate();
      })
    },
    // 商家选择改变-设置区域下拉列表
    async shopChange(val = '', is_edit = false) {
      // 清空区域下拉
      this.items[this.indexOfName('store_id')]['value'] = null
      this.items[this.indexOfName('store_id')]['dropList'] = []
      if (val) {
        await this.loadItemsFieldDrop('shop_store', 'store_id', { shop_id: val })
        if (!is_edit) {
          this.forms.store_id = ''
          this.forms.device_id = ''
        }
      }
    },
    async storeChange(val = '', is_edit = false) {
      // 清空区域下拉
      this.items[this.indexOfName('device_id')]['value'] = null
      this.items[this.indexOfName('device_id')]['dropList'] = []
      if (val) {
        await this.loadItemsFieldDrop('device', 'device_id', { store_id: val })
        if (!is_edit) {
          this.forms.device_id = ''
        }
      }
    },
    handleSubmit() {
      if (!this.action) {
        return true
      }
      this.$refs.form.validate((valid) => {
        console.log('handleSubmit forms', valid, this.forms)
        if (valid) {
          $form.handleSubmit(this)
        }
      })
    },
  },
}
</script>
