<script>
import baseEdit from '@/views/components/base/baseEdit.vue'
export default {
  extends: baseEdit,
  components: {},
  data() {
    return {
      mname: 'shopStore',
      items: [
        { label: '商家信息', desc: '表单的基本信息', type: 'header' },
        { label: '所属商家', name: 'shop_id', value: '', type: 'select', dropList: [], rules: [{ required: false, trigger: 'blur', type: 'number' }] },
        { label: '区域名称', name: 'store_name', value: '', type: 'input', rules: [{ required: true, trigger: 'blur' }] },
        { label: '区域图片', name: 'store_logo', value: '', type: 'image', desc: '建议图片宽高尺寸750*420像素及以上', rules: [{ required: true, trigger: 'blur' }] },
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
        { label: '区域地址', name: 'store_address', value: '', type: 'input', rules: [{ required: true, trigger: 'blur' }] },
        { label: '外部链接', name: 'linkurl_out', value: '', placeholder: '景区特别说明链接', type: 'input', rules: [{ required: false, trigger: 'blur' }] },
        { label: '备注', name: 'remark', value: '', type: 'textarea' },
        { label: '订单配置', desc: '订单的基本信息', type: 'header' },
        { label: '是否可超区用车', name: 'check_out_order', value: 0, type: 'switch', desc: '打开此配置后, 该区域的车辆将可以超区进行下单用车', trueValue: 1, falseValue: 0 },
      ],
      forms: {},
    }
  },
  created() {
    this.loadItemsFieldDrop('shop', 'shop_id')
  },
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
