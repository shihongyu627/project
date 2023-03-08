<template>
  <div>
    <Row>
      <Col span="12">
        <Form ref="form" :model="forms" :rules="formRules" :label-width="120">
          <form-header name="基本信息" :label="stitle ? stitle : '权限规则基本信息'"></form-header>
          <FormItem label="父级ID" prop="pid" v-if="pid ? false : true">
            <Cascader :data="rule_arr" v-model="pids" change-on-select @on-change="this.pidChange"></Cascader>
          </FormItem>
          <FormItem label="规则名称" prop="name">
            <Input v-model="forms.name" placeholder="唯一规则名称" style="width:200px" :disabled="action === 'edit' ? true : false"></Input>
          </FormItem>
          <FormItem :label="!forms.is_fast ? '单一路由' : '快捷路由'" prop="is_fast" v-if="pid ? false : true">
            <i-switch v-model="forms.is_fast" :true-value="1" :false-value="0"></i-switch>
          </FormItem>
          <FormItem label="路由" prop="url" v-if="!forms.is_fast">
            <Input v-model="forms.url" placeholder="请输入完整路由,结尾不能留/"></Input>
          </FormItem>
          <FormItem label="模块" prop="module" v-if="forms.is_fast">
            <Input v-model="forms.module" placeholder="请输入模块,结尾不能留/"></Input>
          </FormItem>
          <FormItem label="" v-if="forms.is_fast">
            <CheckboxGroup v-model="forms.methods">
              <Checkbox :label="'add'">新增</Checkbox>
              <Checkbox :label="'edit'">编辑</Checkbox>
              <Checkbox :label="'del'">删除</Checkbox>
              <Checkbox :label="'get'">查询</Checkbox>
              <Checkbox :label="'lists'">列表</Checkbox>
              <Checkbox :label="'pass'">审核</Checkbox>
              <Checkbox :label="'sync'">同步</Checkbox>
              <Checkbox :label="'import'">导入</Checkbox>
              <Checkbox :label="'export'">导出</Checkbox>
              <!-- 切换状态等 -->
              <Checkbox :label="'switch'">切换状态</Checkbox>
              <!-- 修改字段值 -->
              <Checkbox :label="'field'">修改字段</Checkbox>
            </CheckboxGroup>
          </FormItem>
          <FormItem label="限制" prop="condition">
            <Input v-model="forms.condition" placeholder="请输入限制规则[可空]"></Input>
          </FormItem>
          <FormItem label="排序" prop="sort">
            <InputNumber v-model="forms.sort" placeholder="小值靠前"></InputNumber>
          </FormItem>
          <FormItem label="状态">
            <i-switch v-model="forms.status" :trueValue="1" :falseValue="0"> </i-switch>
          </FormItem>
          <FormItem label="备注">
            <Input v-model="forms.remarks" type="textarea" :autosize="{ minRows: 5 }" placeholder="请输入备注[可空]"></Input>
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
export default {
  components: {},
  data() {
    return {
      sloading: false,
      action: 'add',
      mname: 'authRule',
      url: {},
      kv: '',
      rule_arr: [],
      pid: '',
      pids: [],
      forms: {
        pid: null,
        is_fast: 0, // 快捷路由用于快速设置权限规则
        methods: [], // 快捷路由方法集合
        group: 'admin', // 模块分组，默认admin
        module: '',
        sort: 50,
        status: 1,
      },
    }
  },
  computed: {
    formRules() {
      let formRules = {
        pid: [{ required: true, message: '请先选择父级ID', trigger: 'blur', type: 'number' }],
        name: [{ required: true, message: '规则名称不能为空', trigger: 'blur' }],
        url: [{ required: this.forms.is_fast ? false : true, message: '路由不能为空', trigger: 'blur' }],
        module: [{ required: this.forms.is_fast ? true : false, message: '模块不能为空', trigger: 'blur' }],
        methods: [{ required: this.forms.is_fast ? true : false, message: '快捷路由不能为空', trigger: 'blur' }],
      }
      return formRules
    },
  },
  created() {
    let query = this.$route.query
    this.loadPidTree()
    this.action = query.action
    if (query.action === 'add') {
      // 添加初始化
      this.forms.pid = query.pid || ''
      this.pid = query.pid || ''
      this.stitle = query.stitle || ''
    } else if (query.action === 'edit') {
      this.kv = query.kv
      this.initData()
    } else {
      $utils.toast.error('请求方式异常')
    }
  },
  methods: {
    initData() {
      $form.initData(this)
    },
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        console.log('handleSubmit', valid, this.forms)
        if (valid) {
          this.forms.tag = this.forms.url
          this.forms.title = this.forms.name
          $form.handleSubmit(this)
        }
      })
    },
    pidChange(val) {
      console.log('pidChange', val)
      // 获取最后一个id
      this.forms.pid = val[val.length - 1]
    },
    loadPidTree() {
      let q = {}
      q.pid = 0
      $utils.api.load('authRuleDropTree', q).then((res) => {
        let ll = res.data || []
        let x = []
        for (let i = 0; i < ll.length; i++) {
          const v = ll[i]
          let c = {}
          c.value = v.id
          c.label = v.name
          c.children = []
          if (v.children) {
            let xx = []
            for (let ii = 0; ii < v.children.length; ii++) {
              const vv = v.children[ii]
              let cc = {}
              cc.value = vv.id
              cc.label = vv.name
              cc.children = []
              if (vv.children) {
                let xxx = []
                for (let iii = 0; iii < vv.children.length; iii++) {
                  const vvv = vv.children[iii]
                  let ccc = {}
                  ccc.value = vvv.id
                  ccc.label = vvv.name
                  ccc.children = []
                  if (vvv.children) {
                    let xxxx = []
                    for (let iiii = 0; iiii < vvv.children.length; iiii++) {
                      const vvvv = vvv.children[iiii]
                      let cccc = {}
                      cccc.value = vvvv.id
                      cccc.label = vvvv.name
                      cccc.children = []
                      xxxx.push(cccc)
                    }
                    ccc.children = xxxx
                  }
                  xxx.push(ccc)
                }
                cc.children = xxx
              }
              xx.push(cc)
            }
            c.children = xx
          }
          x.push(c)
        }
        this.rule_arr = x || []
      })
    },
  },
}
</script>
<<style lang="less" scoped></style>
