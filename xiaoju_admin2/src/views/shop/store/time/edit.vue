<template>
  <div>
    <Row>
      <Col span="12">
        <Form ref="form" :model="formItem" :rules="formRules" :label-width="130">
          <form-header name="营运规则" label="收费的基本信息"></form-header>
          <FormItem label="车辆类型" prop="product_id">
            <Select v-model="formItem.product_id" style="width:200px" :disabled="action == 'edit' ? true : false">
              <Option :value="v.value" v-for="(v, k) in productDropList" :key="k">{{ v.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="营运类型" prop="time_type">
            <Select v-model="formItem.time_type" @on-select="selectTimeType" :disabled="true" style="width:200px">
              <Option :value="1">允许营运</Option>
              <Option :value="2">禁止运营</Option>
            </Select>
          </FormItem>
          <FormItem label="营运规则" prop="time_type">
            <Select v-model="formItem.time_type" @on-select="selectTimeType" :disabled="true" style="width:200px">
              <Option :value="1">基本规则</Option>
              <Option :value="2">星期营运</Option>
              <Option :value="3">法定假日营运</Option>
              <Option :value="4">特定日期营运</Option>
            </Select>
          </FormItem>
          <FormItem label="" prop="type_value" v-if="formItem.time_type == 2">
            <CheckboxGroup v-model="formItem.type_values" @on-change="CheckboxChange">
              <Checkbox :label="1">星期一</Checkbox>
              <Checkbox :label="2">星期二</Checkbox>
              <Checkbox :label="3">星期三</Checkbox>
              <Checkbox :label="4">星期四</Checkbox>
              <Checkbox :label="5">星期五</Checkbox>
              <Checkbox :label="6">星期六</Checkbox>
              <Checkbox :label="7">星期日</Checkbox>
            </CheckboxGroup>
          </FormItem>
          <FormItem label="" prop="type_value" v-if="formItem.time_type == 4">
            <DatePicker v-model="formItem.type_value" type="date" multiple placeholder="选择日期" @on-clear="DataClear" @on-change="DataChange" style="width: 300px"></DatePicker>
          </FormItem>
          <FormItem :label="(formItem.type==1?'允许营运':'禁止运营')+'起止时间'">
            <TimePicker
              v-model="formItem.start_time"
              type="time"
              placeholder="开始时间"
              :confirm="true"
              :steps="[1, 1, 15]"
              @on-clear="TimeClear"
              @on-change="TimeChange"
              style="width: 120px"
            ></TimePicker>
            -
            <TimePicker
              v-model="formItem.end_time"
              type="time"
              placeholder="结束时间"
              :confirm="true"
              :steps="[1, 1, 15]"
              @on-clear="TimeClear"
              @on-change="TimeChange"
              style="width: 120px"
            ></TimePicker>
          </FormItem>
          <FormItem label="备注">
            <Input v-model="formItem.remark" type="textarea" :autosize="{ minRows: 5 }" placeholder="请输入内容[可空]"></Input>
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
import baseEdit from '@/views/components/base/baseEdit.vue'
export default {
  extends: baseEdit,
  components: {},
  data() {
    return {
      index: 1,
      sloading: false,
      mname: 'shopStoreTime',
      kv: '',
      action: 'add',
      productDropList: [],
      start_end_time: '',
      formItem: {
        type: 2,
        product_id: '',
        time_type: 2,
        type_value: '',
        start_time: '',
        end_time: '',
        start_end_time: '',
        remark: '',
      },
      formRules: {
        product_id: [{ required: true, message: '车辆类型', trigger: 'blur', type: 'number' }],
        time_type: [{ required: true, message: '营运类型', trigger: 'blur', type: 'number' }],
      },
    }
  },
  async created() {
    await this.loadProductDropList()
    let query = this.$route.query
    this.action = query.action
    this.formItem.store_id = query.store_id
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
      $form.initData(this, '', (val) => {
        if (val.time_type == 2) {
          let type_valueArr = val.type_value.split(',')
          let type_value = []
          type_valueArr.map((item) => {
            type_value.push(Number(item))
          })
          val.type_values = type_value
        }
        this.formItem = val
      })
    },
    async loadProductDropList(param = {}) {
      // 通过pk查询字典数据
      let q = param
      let res = await $utils.api.load('productDropList', q)
      if (res && res.data) {
        let ll = res.data
        let dropList = []
        for (let index = 0; index < ll.length; index++) {
          const element = ll[index]
          let xx = {}
          xx.value = element.value
          xx.name = element.name
          dropList.push(xx)
        }
        this.productDropList = dropList
      }
    },
    selectTimeType() {
      this.formItem.type_value = ''
      console.log(123)
    },
    CheckboxChange(val) {
      this.formItem.type_value = val.sort().join(',')
      console.log(val.sort())
    },
    DataChange() {
      console.log(this.formItem.type_value)
      let arr = []
      this.formItem.type_value.map((item) => {
        const d = new Date(item)
        const resDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
        console.log(resDate)
        arr.push(resDate)
      })
      this.formItem.type_value = arr
        .sort(function(a, b) {
          return b < a ? 1 : -1
        })
        .join(',')
    },
    DataClear() {
      this.formItem.type_value = ''
    },
    TimeChange(v) {
      console.log('TimeChange', v)
    },
    TimeClear() {
      this.formItem.start_time = ''
      this.formItem.end_time = ''
    },
    handleSubmit() {
      if (this.formItem.time_type == 2) {
        if (!this.formItem.type_value) {
          this.$Notice.open({
            title: '请选择星期',
          })
          return
        }
      }
      if (this.formItem.time_type == 4) {
        if (this.formItem.type_value[0] == false || this.formItem.type_value.length == 0) {
          this.$Notice.open({
            title: '请选择日期',
          })
          return
        }
      }
      if (!this.formItem.start_time || !this.formItem.end_time) {
        this.$Notice.open({
          title: '请选择时间段',
        })
        return
      }
      console.log(this.formItem.type_value, 'xxx')
      this.$refs.form.validate((valid) => {
        if (valid) {
          delete this.formItem.type_values
          $form.handleSubmit(this)
        }
      })
    },
  },
}
</script>
<style lang="less" scoped></style>
