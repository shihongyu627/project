<template>
  <div style="width:100%;height:200px;margin-top:0px">
    <p slot="header" style="color:#f60;text-align:center">
      <Icon type="md-information-circled"></Icon>
      <span>维修处理</span>
    </p>
    <br/>
    <div>
      <Input
        placeholder="请输入处理意见"
        type="textarea"
        :rows="5"
        v-model="text"
        @on-change='onChangeContent'
      ></Input>
    </div>
    <div style="margin-top:20px;">
      <Select @on-change="onchangeSelect" v-model="model3" style="width:100px">
        <Option
          v-for="item in cityList"
          :value="item.value"
          :key="item.value"
          >{{ item.label }}</Option
        >
      </Select>
    </div>
  </div>
</template>
<script>
export default {
  name: "deal",
  props: {
    content: {
      type: String,
      value: "",
    },
    e_lnglat: {
      type: String,
      value: "",
    },
    device_id: {
      type: String,
      value: "",
    },
    amap_trid: {
      type: String,
      value: "",
    },
  },
  data() {
    return {
      cityList: [
        {
          value: 1,
          label: "处理中",
        },
        {
          value: 2,
          label: "待检测",
        },
        {
          value: 3,
          label: "待维修",
        },
        {
          value: 10,
          label: "处理完成",
        },
      ],
      model3: "",
      text: "",
    };
  },
  created() {},
  mounted() {},
  methods: {
    onchangeSelect() {
      console.log(this.model3);
      // 使用$emit 将子组件获取的id值传给父组件
      this.$emit("getAction", this.model3);
    },
    onChangeContent() {
      console.log(this.text);
      this.$emit("getcontent", this.text);
    }
  },
};
</script>
<style lang="less">
// .modelMap {
//   position: relative;
// }
// #containers {
//   margin: 0 auto;
// }
</style>
