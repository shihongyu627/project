<script>
import baseEdit from '@/views/components/base/baseEdit.vue'
export default {
  extends: baseEdit,
  components: {},
  data() {
    return {
      mname: 'device',
      items: [
        { label: '车辆信息', desc: '车辆的基本信息', type: 'header' },
        { label: '所属产品', name: 'product_id', value: '', type: 'select', dropList: [], rules: [{ required: true, trigger: 'blur', type: 'number' }] },
        { label: '所属商家', name: 'shop_id', value: '', type: 'select', dropList: [], onChange: this.shopChange.bind(this), rules: [{ required: false, trigger: 'blur', type: 'number' }] },
        { label: '所属区域', name: 'store_id', value: '', type: 'select', dropList: [], rules: [{ required: false, trigger: 'blur', type: 'number' }] },
        {
          label: '中控类型',
          name: 'lot_name',
          value: '',
          type: 'select',
          onChange: this.lotChange.bind(this),
          dropList: [
            { value: 'lot_c', name: '深圳泰比特' },
            { value: 'lot_e', name: '武汉小安' },
            { value: 'lot_d', name: '深圳云咖' },
            { value: 'lot_a', name: '天津安中-单车' },
          ],
          rules: [{ required: true, trigger: 'blur', type: 'string' }],
        },
        { label: 'BMS状态', name: 'is_bms', value: 0, type: 'switch', trueValue: 1, falseValue: 0, desc: '开启BMS状态，则用车时候会检测该车的当前电量，非BMS车辆请关闭', },
        { label: '车辆名称', name: 'name', value: '', type: 'input', rules: [{ required: false, trigger: 'blur' }] },
        { label: '车辆图片', name: 'image', value: '', type: 'image', desc: '建议图片宽高尺寸720*720像素及以上', rules: [{ required: false, trigger: 'blur' }] },
        { label: '车辆编号', desc: '编号的基本信息', type: 'header' },
        { label: '车辆编号', name: 'device_no', value: '', type: 'input', rules: [{ required: true, trigger: 'blur' }] },
        { label: '车辆编号-结束', name: 'device_no_end', value: '', type: 'input', desc: '批量创建请输入车辆最后的编号，中间会自动创建', rules: [{ required: false, trigger: 'blur' }] },
        { label: '车辆IMEI', name: 'imei', value: '', type: 'input', desc: '电动车中控码, 单车卡号', rules: [{ required: false, trigger: 'blur' }] },
        { label: '车辆ICCID', name: 'iccid', value: '', type: 'input', desc: '电动车中控码, 单车ICCD码', rules: [{ required: false, trigger: 'blur' }] },
        { label: '备注', name: 'remark', value: '', type: 'textarea' },
      ],
      forms: {},
    }
  },
  async created() {
    await this.loadItemsFieldDrop('product', 'product_id')
    await this.loadItemsFieldDrop('shop', 'shop_id')

    if (this.action == 'edit') {
      this.items[this.indexOfName('device_no_end')]['type'] = 'hidden'
    }
  },
  watch: {
    async forms(val) {
      if (val.shop_id) {
        await this.loadItemsFieldDrop('shop_store', 'store_id', { shop_id: val.shop_id })
      }
    },
  },
  methods: {
    // 商家选择改变-设置区域下拉列表
    async shopChange(val) {
      console.log(val)
      // 清空区域下拉
      this.forms['store_id'] = ''
      this.items[this.indexOfName('store_id')]['value'] = ''
      this.items[this.indexOfName('store_id')]['dropList'] = []
      if (val) {
        await this.loadItemsFieldDrop('shop_store', 'store_id', { shop_id: val })
      }
    },
    // lot选择改变-设置is_bms状态
    async lotChange(val) {
      console.log(val)
      let is_bms = 0
      switch (val) {
        case 'lot_a':
        case 'lot_b':
        case 'lot_d':
          is_bms = 0
          break
        case 'lot_c':
          is_bms = 1
          break
        default:
          break
      }
      this.forms['is_bms'] = is_bms
      this.items[this.indexOfName('is_bms')]['value'] = is_bms
    },
  },
}
</script>
