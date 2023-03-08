<template>
  <div>
    <Row :gutter="25" style="margin-top:8px">
      <Col span="24">
        <simple></simple>
      </Col>
    </Row>
    <Row :gutter="25" style="margin-top:8px">
      <Col span="24">
        <trend></trend>
      </Col>
    </Row>
    <!-- <Row :gutter="25" style="margin-top:8px">
      <Col :md="24" :lg="12">
        <trend></trend>
      </Col>
      <Col :md="24" :lg="12">
        <system></system>
      </Col>
    </Row>
    <Row :gutter="25" style="margin-top:8px">
      <Col :md="24" :lg="12">
        <trend></trend>
      </Col>
      <Col :md="24" :lg="12">
        <device></device>
      </Col>
    </Row> -->
    <Row :gutter="25" style="margin-top:8px">
      <Col span="24">
        <region></region>
      </Col>
    </Row>
  </div>
</template>
<script>
import trend from './data/trend' // 趋势
import system from './data/system' // 操作系统
import device from './data/device' // 车辆
import region from './data/region' // 地域
import simple from './simple.vue' // 概览
export default {
  components: {
    trend,
    system,
    device,
    region,
    simple,
  },
  data() {
    return {
      index: 1,
    }
  },
  created() {},
  methods: {},
}
</script>
<style lang="less" scoped></style>
