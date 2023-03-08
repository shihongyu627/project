<template>
  <div>
    <Row>
      <Form ref="form" :model="forms" :rules="formRules" :label-width="80">
        <form-body :forms="forms" :items="items" ></form-body>
        <button-box style="position: absolute;bottom: -75px;">
          <button-sub @click="handleSubmit" :loading="sloading"></button-sub>
          <Poptip confirm title="确定要删除这条数据吗?" @on-ok="handleDel">
            <Button type="error">删除</Button>
          </Poptip>
        </button-box>
      </Form>
    </Row>
  </div>
</template>
<script>
export default {
  name: 'editBox',
  components: {},
  data() {
    return {
      sloading: false,
      action: 'edit',
      mname: 'authRule',
      url: {},
      kv: '',
      query: {},
      items: [
        { label: '基本信息', desc: '权限规则基本信息', type: 'header' },
        { label: '父级ID', name: 'pid', value: '', type: 'tree', dropList: [], rules: [{ required: true, trigger: 'blur', type: 'number' }] },
        { label: '名称', name: 'name', value: '', placeholder: '唯一规则名称', type: 'input', rules: [{ required: true, trigger: 'blur' }] },
        { label: '路由', name: 'url', value: '', placeholder: '请输入路由', type: 'input', rules: [{ required: true, trigger: 'blur' }] },
        { label: '限制', name: 'condition', value: '', placeholder: '请输入限制规则[可空]', type: 'input', rules: [{ required: false, trigger: 'blur' }] },
        { label: '排序', name: 'sort', value: 50, placeholder: '小值靠前', type: 'number', rules: [{ required: true, trigger: 'blur', type: 'number' }] },
        { label: '状态', name: 'status', value: 1, type: 'switch', trueValue: 1, falseValue: 0 },
        { label: '备注', name: 'remark', value: '', type: 'textarea' },
      ],
      forms: {
        status: 1,
        sort: 50,
        is_fast: 0,
        group: 'admin',
      },
      formRules: {
        name: [{ required: true, message: '规则名称不能为空', trigger: 'blur' }],
        url: [{ required: true, message: '路由不能为空', trigger: 'blur' }],
      },
    }
  },
  props: {
    id: {
      type: Number,
      default: '',
    },
  },
  created() {
    this.kv = this.id
    this.loadItemsFieldDrop('auth_rule_tree', 'pid', { pid: 0 })
    this.initData()
  },
  methods: {
    initData() {
      $form.initData(this, {}, null, false)
    },
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.forms.tag = this.forms.url
          this.forms.title = this.forms.name
          $form.handleSubmit(this, {}, () => {
            this.$emit('submit', true)
          })
        }
      })
    },
    handleDel() {
      let q = {}
      q.kv = this.kv
      $utils.api.load('authRuleDel', q).then((res) => {
        this.$emit('submit', true)
      })
    },
    loadItemsFieldDrop(type, field, param = {}) {
      // 通过pk查询字典数据
      let q = param
      let apiname = ''
      if (type == 'auth_rule_tree') {
        apiname = 'authRuleDropTree'
      }
      if (!apiname) {
        return
      }
      $utils.api.load(apiname, q).then((res) => {
        if (res && res.data) {
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
            if (element && element.name == field && (element.type == 'select' || element.type == 'tree')) {
              this.items[index]['dropList'] = (this.items[index]['dropList'] || []).concat(dropList)
            }
          }
          console.log('dropList ' + field, dropList)
        }
      })
    },
  },
}
</script>
<style lang="less" scoped></style>
