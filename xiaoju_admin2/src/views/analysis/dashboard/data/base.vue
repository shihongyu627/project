<template>
  <Card class="data-card-box">
    <p slot="title">{{ title }}</p>
    <p slot="filter"></p>
    <div :style="{ width: '100%', height: height }" :id="uuid"></div>
  </Card>
</template>

<script>
export default {
  name: 'dataBase',
  data() {
    return {
      id: null,
      chart: null,
    }
  },
  props: {
    title: {
      type: String,
      default: '统计图表',
    },
    height: {
      type: String,
      default: '240px',
    },
  },
  computed: {
    uuid() {
      if (!this.id) {
        this.id = 'chart_data_id' + Math.ceil(Math.random() * 1000)
      }
      return this.id
    },
  },
  created() {},
  methods: {},
}
</script>
<style lang="less" scoped>
.data-card-box {
  border-radius: 0px;
  background: #f9f9f9;
  border: 0px solid #efefef;
  margin-top: 20px;
  margin-bottom: 10px;
  .ivu-card-head {
    border-bottom: 1px solid #e8e8e8;
  }
}
</style>
