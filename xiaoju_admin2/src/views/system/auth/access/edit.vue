<script>
import baseEdit from '@/views/components/base/baseEdit.vue'
export default {
  extends: baseEdit,
  components: {},
  data() {
    return {
      mname: 'authAccess',
      key: 'suid',
      items: [
        { label: '基本信息', desc: '表单的基本信息', type: 'header' },
        {
          label: '账户类型',
          name: 'type',
          value: '',
          type: 'select',
          dropList: [],
          rules: [{ required: true, trigger: 'blur', type: 'number' }],
        },
        {
          label: '工作性质',
          name: 'work_type',
          value: '',
          type: 'select',
          dropList: [
            { value: 1, name: '内部全职' },
            { value: 2, name: '外部全职' },
            { value: 3, name: '合作商家' },
            { value: 4, name: '临时兼职' },
          ],
          rules: [{ required: true, trigger: 'blur', type: 'number' }],
        },
        { label: '姓名', name: 'name', value: '', type: 'input', rules: [{ required: true, trigger: 'blur' }] },
        { label: '手机号', name: 'user_mobile', value: '', type: 'input', rules: [{ required: true, trigger: 'blur' }] },
        { label: '登录密码', name: 'password', value: '', type: 'password', desc: '更新账户时，如不需要修改密码，请留空' },
        // { label: '账号头像', name: 'head', value: '', type: 'image', desc: '建议图片宽高尺寸512*512像素及以上', rules: [{ required: true, trigger: 'blur' }] },
        { label: '权限信息', desc: '权限控制信息', type: 'header' },
        { label: '角色权限', name: 'group_ids', value: '', type: 'select', multiple: true, dropList: [], rules: [{ required: true, trigger: 'blur', type: 'array' }] },
        { label: '数据可见范围', desc: '控制数据可见范围', type: 'header' },
        { label: '产品类型', name: 'product_ids', value: '', type: 'select', multiple: true, dropList: [], rules: [{ required: false, trigger: 'blur', type: 'array' }] },
        { label: '区域权限', name: 'store_ids', value: '', type: 'select_group', multiple: true, dropList: [], rules: [{ required: false, trigger: 'blur', type: 'array' }] },
        { label: '订单信息', name: 'is_all_order', value: 0, type: 'switch', trueValue: 1, falseValue: 0, desc: '是否可查看订单的全部信息' },
        { label: '运营控制范围', desc: '控制可见范围', type: 'header' },
        {
          label: '开关锁限制',
          name: 'is_open_check_distance',
          value: 0,
          type: 'switch',
          trueValue: 1,
          falseValue: 0,
          desc: '是否开启运营端开关锁限制（仅电动车有效,单车无效）',
          onChange: this.onCheckDistanceChange,
        },
        { label: '开锁距离', name: 'open_check_distance', value: '', type: 'number', min: 0, desc: '运营端开关锁人车距离（米），设置0不限制，>0则进行限制开关锁(电动车)' },
        { label: '限制时间', name: 'open_check_maxtime', value: '', type: 'number', min: 0, desc: '运营端开锁后，骑行用车限制时间（分钟），设置0不限制，>0则进行超时自动关锁(电动车)' },
        { label: '其他信息', desc: '其他信息', type: 'header' },
        { label: '备注', name: 'remark', value: '', type: 'textarea' },
        { label: '状态', name: 'status', value: 1, type: 'switch', trueValue: 1, falseValue: 0 },
      ],
      forms: {},
    }
  },
  async created() {
    let query = this.$route.query
    if (query.type) {
      this.forms.type = query.type
    }
    this.onCheckDistanceChange(false)
    await this.loadItemsFieldDrop('auth_type', 'type')
    await this.loadItemsFieldDrop('auth_group', 'group_ids')
    await this.loadItemsFieldDrop('product', 'product_ids')
    await this.shopStoreDropGroup()
  },
  methods: {
    initData() {
      $form.initData(this, {}, (res) => {
        if (res) {
          this.forms = res
          this.onCheckDistanceChange(res.is_open_check_distance)
          this.$forceUpdate()
          console.log('initData forms', this.forms)
        }
      })
    },
    onCheckDistanceChange(val) {
      if (val) {
        this.items[this.indexOfName('open_check_distance')]['type'] = 'number'
        this.items[this.indexOfName('open_check_maxtime')]['type'] = 'number'
      } else {
        this.items[this.indexOfName('open_check_distance')]['type'] = 'hidden'
        this.items[this.indexOfName('open_check_maxtime')]['type'] = 'hidden'
      }
    },
    async shopStoreDropGroup(shop_id = 0) {
      let field = 'store_ids'
      // 查询区域的分组下拉
      let q = {}
      if (shop_id) {
        q.shop_id = shop_id
      }
      let res = await $utils.api.load('storeDropGroupList', q)
      if (res) {
        if (res.data) {
          let ll = res.data
          let dropList = []
          for (let index = 0; index < ll.length; index++) {
            const element = ll[index]
            let xx = {}
            xx.value = element.value
            xx.name = element.name
            xx.children = element.children || []
            dropList.push(xx)
          }
          for (let index = 0; index < this.items.length; index++) {
            const element = this.items[index]
            if (element && element.name == field && element.type == 'select_group') {
              this.items[index]['dropList'] = (this.items[index]['dropList'] || []).concat(dropList)
            }
          }
          console.log('dropList ' + field, dropList)
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
          this.forms.group_ids = (this.forms.group_ids || []).join(',')
          this.forms.product_ids = (this.forms.product_ids || []).join(',')
          this.forms.shop_ids = (this.forms.shop_ids || []).join(',')
          this.forms.store_ids = (this.forms.store_ids || []).join(',')
          if (!this.forms.is_open_check_distance) {
            this.forms.open_check_distance = 0
            this.forms.open_check_maxtime = 0
          }
          $form.handleSubmit(this)
        }
      })
    },
  },
}
</script>
