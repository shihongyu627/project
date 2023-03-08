<template>
  <div style="">
    <Card class="sum-card-box" :padding="0" style="border: 0px solid #efefef;">
      <div class="item1">
        {{ title }}
        <!-- <Tooltip :content="info" class="tip" placement="top">
                <Icon type="ios-information-circle-outline" size="16"></Icon>
            </Tooltip> -->
      </div>
      <div class="item2">
        {{ value }}
      </div>
      <div class="item3">
        <slot name="content">
          <div :style="{ width: '100%', height: '100%' }" :id="uuid"></div>
        </slot>
      </div>
      <div class="item4">
        <span>{{ label }}</span
        ><span>{{ label1 }}</span>
      </div>
    </Card>
  </div>
</template>
<script>
export default {
  name: 'baseSum',
  data() {
    return {
      id: null,
      chart: null,
    }
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    info: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    label1: {
      type: String,
      default: '',
    },
  },
  computed: {
    uuid() {
      if (!this.id) {
        this.id = 'chart_sum_id' + Math.ceil(Math.random() * 1000)
      }
      return this.id
    },
  },
  mounted() {},
  methods: {},
}
</script>
<style lang="less" scoped>
.sum-card-box {
  float: left;
  width: 100%;
  height: 126px;
  margin-top: 10px;
  margin-bottom: 10px;
  box-sizing: border-box;
  background-color: #f9f9f9;
  transition: 0.2s all ease;
  position: relative;
  padding: 20px 24px 8px;
  .item1 {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
    line-height: 22px;
    height: 22px;
    .tip {
      float: right;
    }
  }
  .item2 {
    overflow: hidden;
    // text-overflow: ellipsis;
    // word-break: break-all;
    // white-space: nowrap;
    color: rgba(0, 0, 0, 0.85);
    margin-top: 4px;
    margin-bottom: 0;
    font-size: 24px;
    line-height: 38px;
    height: 38px;
  }
  .item3 {
    height: 0px;
    margin-bottom: 2px;
    width: 100%;
  }
  .item4 {
    border-top: 1px solid #e8e8e8;
    padding-top: 5px;
    margin-top: 8px;
    font-size: 14px;
    line-height: 22px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    span:last-child {
      margin-left: 8px;
      color: rgba(0, 0, 0, 0.85);
    }
  }
}
</style>
