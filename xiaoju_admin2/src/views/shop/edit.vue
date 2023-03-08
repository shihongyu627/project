<script>
import baseEdit from '@/views/components/base/baseEdit.vue'
export default {
  extends: baseEdit,
  components: {},
  data() {
    return {
      mname: 'shop',
      items: [
        { label: '基本信息', desc: '表单的基本信息', type: 'header' },
        { label: '商家名称', name: 'shop_name', value: '', type: 'input', rules: [{ required: true, trigger: 'blur' }] },
        { label: '商家LOGO', name: 'shop_logo', value: '', type: 'image', desc: '建议图片宽高尺寸512*512像素及以上', rules: [{ required: true, trigger: 'blur' }] },
        {
          label: '省市区',
          name: 'shop_address_obj',
          value: {
            province: '',
            city: '',
            area: '',
          },
          type: 'addressInfo',
          onChange: this.onAddressChange,
        },
        { label: '商家联系人', name: 'linkman_name', value: '', type: 'input', rules: [{ required: false, trigger: 'blur' }] },
        { label: '商家联系方式', name: 'linkman_mobile', value: '', type: 'input', rules: [{ required: false, trigger: 'blur' }] },
        { label: '分账信息', desc: '分账的基本信息', type: 'header' },
        {
          label: '商家收入比例',
          name: 'income_scale',
          value: null,
          min: 0,
          max: 1,
          precision: 2,
          type: 'number',
          desc: '每笔订单分成百分比，总计1, 例0.30=30%',
          rules: [{ required: true, trigger: 'blur', type: 'number' }],
        },
        {
          label: '小驹收入比例',
          name: 'income_scale10',
          value: null,
          min: 0,
          max: 1,
          precision: 2,
          type: 'number',
          desc: '每笔订单分成百分比，总计1, 例0.30=30%',
          rules: [{ required: true, trigger: 'blur', type: 'number' }],
        },
        {
          label: '其他收入比例',
          name: 'income_scale3',
          value: null,
          min: 0,
          max: 1,
          precision: 2,
          type: 'number',
          desc: '每笔订单分成百分比，总计1, 例0.30=30%',
          rules: [{ required: true, trigger: 'blur', type: 'number' }],
        },
        { label: '订单收入', desc: '订单收入的信息', type: 'header' },
        { label: '包含骑行费用', name: 'is_cal_order_device_money', value: 1, type: 'switch', disabled: true, desc: '打开此配置后, 收入将包含骑行费用', trueValue: 1, falseValue: 0 },
        { label: '包含非定点还车费用', name: 'is_cal_order_dispatch_money', value: 0, type: 'switch', desc: '打开此配置后, 收入将包含非定点还车费用', trueValue: 1, falseValue: 0 },
        { label: '包含超区调度费用', name: 'is_cal_order_dispatch_outrun_money', value: 0, type: 'switch', desc: '打开此配置后, 收入将包含超区调度费用', trueValue: 1, falseValue: 0 },
        
        { label: '支付信息', desc: '独立支付配置', type: 'header' },
        { label: '商家微信支付', name: 'wechat_pay_status', value: 0, type: 'switch', desc: '请确认支付配置参数，谨慎设置支付信息', trueValue: 1, falseValue: 0 },
        { label: '微信支付mch_id', name: 'wechat_pay_mch_id', value: '', placeholder: '微信支付商户号', type: 'input', rules: [{ required: false, trigger: 'blur' }] },
        { label: '微信支付api_key', name: 'wechat_pay_api_key', value: '', placeholder: '微信支付APIKEY', type: 'input', rules: [{ required: false, trigger: 'blur' }] },
        { label: '备注', name: 'remark', value: '', type: 'textarea' },
        { label: '状态', name: 'status', value: 1, type: 'switch', trueValue: 1, falseValue: 0 },
      ],
      forms: {},
    }
  },
  created() {},
  methods: {
    initData() {
      $form.initData(this, {}, (res) => {
        if (res) {
          let shop_address_obj = {
            province: res.province_name ? res.province_name : '',
            city: res.city_name ? res.city_name : '',
            area: res.district_name ? res.district_name : '',
          }
          res.shop_address_obj = shop_address_obj
          this.forms = res
          this.$forceUpdate()
          this.$set(this.forms, 'shop_address_obj', shop_address_obj)
          console.log('initData forms', this.forms)
        }
      })
    },
    onAddressChange(val) {
      console.log('onAddressChange', val)
      this.forms.province_code = (val.province && val.province.code) || ''
      this.forms.city_code = (val.city && val.city.code) || ''
      this.forms.district_code = (val.area && val.area.code) || ''

      this.forms.province_name = (val.province && val.province.value) || ''
      this.forms.city_name = (val.city && val.city.value) || ''
      this.forms.district_name = (val.area && val.area.value) || ''
      // if(this.forms.city_code){
      //      this.forms.shop_address = this.forms.province_name + this.forms.city_name + this.forms.district_name
      // }
    },
  },
}
</script>
