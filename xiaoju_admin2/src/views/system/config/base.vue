<template>
  <div>
    <Menu mode="horizontal" :active-name="menuName" @on-select="selectMent">
      <MenuItem name="base">
        基本配置
      </MenuItem>
      <MenuItem name="share">
        推广配置
      </MenuItem>
      <MenuItem name="withdraw">
        提现配置
      </MenuItem>
      <!-- <MenuItem name="bankaccount" >
            收款账户
        </MenuItem> -->
      <MenuItem name="kefu">
        客服配置
      </MenuItem>
      <MenuItem name="order">
        订单配置
      </MenuItem>
    </Menu>
    <Row style="margin-top:20px;">
      <Col span="12">
        <Form ref="form" :model="formItems" :rules="formRules" :label-width="120">
          <form-header name="配置参数" label="配置信息"></form-header>
          <div v-for="(v, k) in formItems" :key="k">
            <template v-if="v.status === 1">
              <template v-if="v.type === 'number'">
                <FormItem :label="v.label || v.name" :rules="v.rules" :disabled="v.disabled">
                  <InputNumber :min="v.min" :max="v.max" size="default" v-model="v.value" :placeholder="v.desc"></InputNumber>
                  <row v-if="v.desc">{{ v.desc }}</row>
                </FormItem>
              </template>
              <template v-else-if="v.type === 'string'">
                <FormItem :label="v.label || v.name" :rules="v.rules" :disabled="v.disabled">
                  <Input v-model="v.value" :placeholder="v.desc" />
                  <row v-if="v.desc">{{ v.desc }}</row>
                </FormItem>
              </template>
              <template v-else-if="v.type === 'text'">
                <FormItem :label="v.label || v.name" :disabled="v.disabled">
                  <Input v-model="v.value" :placeholder="v.desc" />
                  <row v-if="v.desc">{{ v.desc }}</row>
                </FormItem>
              </template>
              <template v-else-if="v.type === 'select'">
                <FormItem :label="v.label || v.name" :rules="v.rules" :disabled="v.disabled">
                  <Select v-model="v.value" style="width:200px">
                    <Option :value="s.value" v-for="(s, sk) in v.select" :key="sk">{{ s.name }}</Option>
                  </Select>
                  <row v-if="v.desc">{{ v.desc }}</row>
                </FormItem>
              </template>
              <template v-else-if="v.type === 'radio'">
                <FormItem :label="v.label || v.name" :rules="v.rules" :disabled="v.disabled">
                  <RadioGroup v-model="v.value">
                    <Option :label="s.value" v-for="(s, sk) in v.select" :key="sk">{{ s.name }}</Option>
                  </RadioGroup>
                  <row v-if="v.desc">{{ v.desc }}</row>
                </FormItem>
              </template>
              <template v-else-if="v.type === 'check'">
                <FormItem :label="v.label || v.name" :rules="v.rules" :disabled="v.disabled">
                  <CheckGroup v-model="v.value">
                    <Option :label="s.value" v-for="(s, sk) in v.select" :key="sk">{{ s.name }}</Option>
                  </CheckGroup>
                  <row v-if="v.desc">{{ v.desc }}</row>
                </FormItem>
              </template>
              <template v-else-if="v.type === 'image'">
                <FormItem :label="v.label || v.name" :rules="v.rules" :disabled="v.disabled">
                  <uploadFile v-model="v.value" type="image"></uploadFile>
                  <row v-if="v.desc">{{ v.desc }}</row>
                </FormItem>
              </template>
              <template v-else-if="v.type === 'document'">
                <FormItem :label="v.label || v.name" :rules="v.rules" :disabled="v.disabled">
                  <uploadFile v-model="v.value" type="document"></uploadFile>
                  <row v-if="v.desc">{{ v.desc }}</row>
                  <row v-if="v.value">{{ v.value }}</row>
                </FormItem>
              </template>
              <template v-else-if="v.type === 'file'">
                <FormItem :label="v.label || v.name" :rules="v.rules" :disabled="v.disabled">
                  <uploadFile v-model="v.value" type="file"></uploadFile>
                  <row v-if="v.desc">{{ v.desc }}</row>
                </FormItem>
              </template>
              <template v-else-if="v.type === 'switch'">
                <FormItem :label="v.label || v.name" :rules="v.rules" :disabled="v.disabled">
                  <i-switch v-model="v.value" :trueValue="'1'" :falseValue="'0'"></i-switch>
                  <row v-if="v.desc">{{ v.desc }}</row>
                </FormItem>
              </template>
              <template v-else-if="v.type === 'textarea'">
                <FormItem :label="v.label || v.name" :rules="v.rules" :disabled="v.disabled">
                  <formUeditor v-model="v.value"></formUeditor>
                  <row v-if="v.desc">{{ v.desc }}</row>
                </FormItem>
              </template>
              <template v-else>
                <FormItem :label="v.name">
                  <Input v-model="v.value" :placeholder="v.desc" />
                  <row v-if="v.desc">{{ v.desc }}</row>
                </FormItem>
              </template>
            </template>
          </div>
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
      index: 1,
      menuName: 'base',
      sloading: false,
      tname: 'config',
      group: 'base',
      formItems: [],
      formRules: [],
    }
  },
  watch: {
    formItems() {
      this.$forceUpdate()
    },
  },
  created() {
    let query = this.$route.query
    if (query.group) {
      this.group = query.group
    }
    this.initData()
  },
  methods: {
    selectMent(name) {
      console.log(name)
      this.group = name
      this.initData()
    },
    initData() {
      $utils.loading.cardshow() // 加载数据进度
      let q = {}
      q.group = this.group
      $utils.api
        .load('configGroup', q, 'get')
        .then((res) => {
          $utils.loading.cardhide()
          if (res.data) {
            this.formItems = res.data
          }
        })
        .catch(() => {
          $utils.loading.cardhide()
          $utils.toast.error('数据异常')
        })
    },
    handleSubmit() {
      // 格式化forms
      let forms = []
      for (const key in this.formItems) {
        if (this.formItems.hasOwnProperty(key)) {
          const item = this.formItems[key]
          let tt = {}
          tt.id = item.id
          tt.value = item.value
          forms.push(tt)
        }
      }
      // 标题
      this.sloading = true // 提交进度
      let q = {}
      q.group = this.group
      q.forms = forms
      $utils.api
        .load('configUpdate', q, 'post')
        .then((res) => {
          this.sloading = false
          if (res.status) {
            $utils.toast.success('保存成功', '《' + '配置参数' + '》更新成功')
          }
        })
        .catch(() => {
          this.sloading = false
          $utils.toast.error('保存异常')
        })
    },
  },
}
</script>
<<style lang="less" scoped></style>
