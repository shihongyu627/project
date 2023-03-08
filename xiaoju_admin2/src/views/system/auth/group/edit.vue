<template>
  <div>
    <Row>
      <Col span="12">
        <Form ref="form" :model="formItem" :rules="formRules" :label-width="120">
          <form-header name="基本信息" label="权限组基本信息"></form-header>
          <FormItem label="名称" prop="title">
            <Input v-model="formItem.name" placeholder="请输入名称"></Input>
          </FormItem>
          <FormItem label="状态">
            <i-switch v-model="formItem.status" :trueValue="1" :falseValue="0"> </i-switch>
          </FormItem>
          <FormItem label="备注">
            <Input v-model="formItem.remarks" type="textarea" :autosize="{ minRows: 3 }" placeholder="请输入备注[可空]"></Input>
          </FormItem>
          <form-header name="权限规则" label="选择合理的权限"></form-header>
          <FormItem label="勾选管理权限">
            <Tree ref="ruleTree" :data="ruletree" children-key="children" show-checkbox style="margin-top:-8px;"></Tree>
          </FormItem>
          <form-header name="运营权限" label="选择合理的运营权限"></form-header>
          <FormItem label="勾选运营权限">
            <Tree ref="ruleTree_devops" :data="ruletree_devops" children-key="children" show-checkbox style="margin-top:-8px;"></Tree>
          </FormItem>
          <FormItem label="同时开锁数量" prop="openlock_max_count">
            <InputNumber v-model="formItem.openlock_max_count" placeholder="请输入限制数量" :min="0"></InputNumber>
            <p>如果有开关锁权限，则会根据同时开锁数量进行开锁限制，0表示不限制</p>
          </FormItem>
          <button-box>
            <button-sub @click="handleSubmit" :loading="sloading"></button-sub>
            <button-back></button-back>
          </button-box>
        </Form>
      </Col>
    </Row>
  </div>
</template>
<script>
import _ from 'underscore'
export default {
  components: {},
  data() {
    return {
      index: 1,
      sloading: false,
      action: 'add',
      mname: 'authGroup',
      url: {},
      kv: '',
      formItem: {
        status: 1,
        rules: '',
        rules_devops: '',
        openlock_max_count: 0,
      },
      formRules: {
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
      },
      ruletree: [],
      ruletree_devops: [],
    }
  },
  async created() {
    let query = this.$route.query
    this.action = query.action
    if (query.action === 'add') {
      // 添加初始化
      let ll1 = await this.getRules(1) // 获取管理权限树
      let ll2 = await this.getRules(2) // 获取运营权限树
      this.setTreeRule(ll1, [])
      this.setTreeRuleDevops(ll2, [])
    } else if (query.action === 'edit') {
      this.kv = query.kv
      this.initData()
    } else {
      return $utils.toast.error('请求方式异常')
    }
  },
  methods: {
    async initData() {
      $form.initData(this, null, async (res) => {
        this.formItem = res
        const rules = _.map((res.rules||'').split(','), function(num) {
          return num * 1
        })
        const rules_devops = _.map((res.rules_devops||'').split(','), function(num) {
          return num * 1
        })
        let ll1 = await this.getRules(1) // 获取管理权限树
        let ll2 = await this.getRules(2) // 获取管理权限树
        this.setTreeRule(ll1, rules)
        this.setTreeRuleDevops(ll2, rules_devops)
      })
    },
    handleSubmit() {
      // 管理权限
      const rr = this.$refs.ruleTree.getCheckedNodes()
      let rules = ''
      for (let i = 0; i < rr.length; i++) {
        const item = rr[i]
        rules += item.id + ','
      }
      this.formItem.rules = rules

      // 运营权限
      const rr_devops = this.$refs.ruleTree_devops.getCheckedNodes()
      let rules_devops = ''
      for (let i = 0; i < rr_devops.length; i++) {
        const item = rr_devops[i]
        rules_devops += item.id + ','
      }
      this.formItem.rules_devops = rules_devops
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.formItem.title = this.formItem.name
          $form.handleSubmit(this)
        }
      })
    },
    async getRules(pid, rules) {
      // 通过pid查询权限规则树
      let q = {}
      q.pid = pid
      let res = await $utils.api.load('authRuleDropTree', q)
      if (res) {
        if (res.data) {
          return res.data
        }
      }
    },
    setTreeRule(tree, rules) {
      this._doRules(tree, rules)
      this.ruletree = tree
    },
    setTreeRuleDevops(tree, rules) {
      this._doRules(tree, rules)
      this.ruletree_devops = tree
    },
    _doRules(arr, rules) {
      for (let i = 0; i < arr.length; i++) {
        const item = arr[i]
        arr[i]['title'] = arr[i]['name']
        // 判断子节点
        if (item.children && item.children.length > 0) {
          this._doRules(item.children, rules)
        }
        // 判断自身选中
        if (item.id && _.indexOf(rules, item.id) >= 0) {
          arr[i]['checked'] = true
          console.log(item.id, 1)
        }
      }
    },
  },
}
</script>
<style lang="less" scoped></style>
