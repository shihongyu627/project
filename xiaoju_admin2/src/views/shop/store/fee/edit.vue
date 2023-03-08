<template>
  <div>
    <Row>
      <Col span="12">
        <Form ref="form" :model="formItem" :rules="formRules" :label-width="120">
          <form-header name="计费规则" label="收费的基本信息"></form-header>
          <FormItem label="车辆类型" prop="product_id">
            <Select v-model="formItem.product_id" style="width:200px" :disabled="action=='edit'?true:false">
              <Option :value="v.value" v-for="(v, k) in productDropList" :key="k">{{v.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="计费类型" prop="fee_type">
            <Select v-model="formItem.fee_type" @on-select="selectFeeType" style="width:200px">
              <Option :value="1">基本规则</Option>
              <Option :value="2">星期计费</Option>
              <Option :value="3">法定假日计费</Option>
              <Option :value="4">特定日期计费</Option>
            </Select>
          </FormItem>
          <FormItem label="" prop="type_value" v-if="formItem.fee_type == 2">
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
          <FormItem label="" prop="type_value" v-if="formItem.fee_type == 4">
            <DatePicker v-model="formItem.type_value" type="date" multiple placeholder="选择日期" @on-clear="DataClear" @on-change="DataChange" style="width: 300px"></DatePicker>
          </FormItem>
          <FormItem label="预充值(元)" prop="fee_recharge">
            <Input v-model="formItem.fee_recharge" placeholder="请输入预充值(元)" style="width:200px"></Input>
            <row>骑行的预充值费用</row>
          </FormItem>
          <FormItem label="容错时长(分)" prop="min_free">
            <Input v-model="formItem.min_free" placeholder="请输入容错时长(分)" style="width:200px"></Input>
            <row>设置免费容错时长，即用户多少时间内免费骑行，一般不＞5分钟</row>
          </FormItem>
          <FormItem label="起步时长(分)" prop="min_base">
            <Input v-model="formItem.min_base" placeholder="请输入起步时长(分)" style="width:200px"></Input>
            <row>设置起步计费时长；例如：每30分钟为一计费单位或每60分钟为一计费单位</row>
          </FormItem>
          <FormItem label="起步价(元)" prop="fee_base">
            <Input v-model="formItem.fee_base" placeholder="请输入起步价(元)" style="width:200px"></Input>
            <row>设置起步计费，例如：每30分钟20元</row>
          </FormItem>
          <FormItem label="阶梯时长(分)" prop="min_next">
            <Input v-model="formItem.min_next" placeholder="请输入阶梯时长(分)" style="width:200px"></Input>
            <row>设置超出起步时长外的阶梯计费时长；例如每30分钟内20元，每超出30分钟按10分钟计费</row>
          </FormItem>
          <FormItem label="阶梯价(元)" prop="fee_next_min">
            <Input v-model="formItem.fee_next_min" placeholder="请输入阶梯价(元)" style="width:200px"></Input>
            <row>设置超出起步价外的阶梯计费；例如每30分钟内20元，每超出10分钟按5元计费</row>
          </FormItem>
          <FormItem label="非定点还车调度费(元)" prop="fee_dispatch">
            <Input v-model="formItem.fee_dispatch" placeholder="请输入非定点还车调度费(元)" style="width:200px"></Input>
            <row>未在指定停车点还车，收取的调度费</row>
          </FormItem>
          <FormItem label="超区调度费(元)" prop="fee_dispatch_outrun">
            <Input v-model="formItem.fee_dispatch_outrun" placeholder="请输入超区调度费(元)" style="width:200px"></Input>
            <row>未在指定服务区内还车，收取的调度费</row>
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
import baseEdit from "@/views/components/base/baseEdit.vue";
export default {
  extends: baseEdit,
  components: {},
  data() {
    return {
      index: 1,
      sloading: false,
      mname: "shopStoreFee",
      kv: "",
      action: "add",
      productDropList: [],
      formItem: {
        product_id: "",
        fee_type: "",
        fee_recharge: "",
        min_base: "",
        min_next: "",
        fee_base: "",
        fee_next_min: "",
        fee_dispatch: "",
        remark: "",
      },
      formRules: {
        product_id: [{ required: true, message: "车辆类型", trigger: "blur", type: "number" }],
        fee_type: [{ required: true, message: "计费类型", trigger: "blur", type: "number" }],
      },
    };
  },
  async created() {
    await this.loadProductDropList();
    let query = this.$route.query;
    this.action = query.action;
    this.formItem.store_id = query.store_id;
    if (query.action === "add") {
      // 添加初始化
    } else if (query.action === "edit") {
      this.kv = query.kv;
      this.initData();
    } else {
      $utils.toast.error("请求方式异常");
    }
  },
  methods: {
    initData() {
      $form.initData(this, "", (val) => {
        if (val.fee_type == 2) {
          let type_valueArr = val.type_value.split(",");
          let type_value = [];
          type_valueArr.map((item) => {
            type_value.push(Number(item));
          });
          val.type_values = type_value;
        }
        this.formItem = val;
      });
    },
    async loadProductDropList(param = {}) {
      // 通过pk查询字典数据
      let q = param;
      let res = await $utils.api.load('productDropList', q);
      if (res && res.data) {
        let ll = res.data;
        let dropList = [];
        for (let index = 0; index < ll.length; index++) {
          const element = ll[index];
          let xx = {};
          xx.value = element.value;
          xx.name = element.name;
          dropList.push(xx);
        }
        this.productDropList = dropList
      }
    },
    selectFeeType() {
      this.formItem.type_value = "";
      console.log(123);
    },
    CheckboxChange(val) {
      this.formItem.type_value = val.sort().join(",");
      console.log(val.sort());
    },
    DataChange() {
      console.log(this.formItem.type_value);
      let arr = [];
      this.formItem.type_value.map((item) => {
        const d = new Date(item);
        const resDate = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
        console.log(resDate);
        arr.push(resDate);
      });
      this.formItem.type_value = arr
        .sort(function(a, b) {
          return b < a ? 1 : -1;
        })
        .join(",");
    },
    DataClear() {
      this.formItem.type_value = "";
    },
    handleSubmit() {
      delete this.formItem.type_values;
      if (this.formItem.fee_type == 2) {
        if (!this.formItem.type_value) {
          this.$Notice.open({
            title: "请选择星期",
          });
          return;
        }
      }
      if (this.formItem.fee_type == 4) {
        if (this.formItem.type_value[0] == false || this.formItem.type_value.length == 0) {
          this.$Notice.open({
            title: "请选择日期",
          });
          return;
        }
      }
      console.log(this.formItem.type_value, "xxx");
      this.$refs.form.validate((valid) => {
        if (valid) {
          $form.handleSubmit(this);
        }
      });
    },
  },
};
</script>
<style lang="less" scoped></style>
