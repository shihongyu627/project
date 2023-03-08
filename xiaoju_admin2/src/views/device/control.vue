<template>
  <div>
    <Row>
      <form-header :name="'设备控制'" :label="'车辆的远程控制'"></form-header>
    </Row>
    <Row>
      <Col :xs="24" :sm="24" :md="18" :lg="14">
        <Form :label-width="120">
          <FormItem label="选择设备" required>
            <Transfer :data="leftList" :target-keys="rightList" :list-style="listStyle" :operations="['撤回', '选中']" filterable @on-change="swapChange">
              <div :style="{ float: 'right', margin: '5px' }">
                <Button size="small" @click="loadData">刷新</Button>
              </div>
            </Transfer>
          </FormItem>
        </Form>
      </Col>
    </Row>
    <Row style="height: 30px"></Row>
    <Row>
      <br />
      <Col :xs="24" :sm="24" :md="18" :lg="14">
        <Form :label-width="120">
          <FormItem>
            <Poptip confirm title="请检查车辆数据, 再确认提交" @on-ok="handleSubmit">
              <button-sub label="确认" :loading="sloading"></button-sub>
            </Poptip>
            <button-back></button-back>
          </FormItem>
        </Form>
      </Col>
    </Row>
  </div>
</template>
<script>
import baseEdit from '@/views/components/base/baseEdit.vue'
import BoxControl from './boxControl.vue'
export default {
  extends: baseEdit,
  components: {
    BoxControl,
  },
  data() {
    return {
      sloading: false,
      action: 'add',
      title: '车辆控制',
      mname: 'device',
      items: [{ label: '升级固件', name: 'update_url', value: '', type: 'file', rules: [{ required: true, trigger: 'blur' }] }],
      forms: {},
      leftList: [],
      rightList: [],
      listStyle: {
        width: '250px',
        height: '300px',
      },
    }
  },
  async created() {
    let query = this.$route.query
    await this.loadData()
    if (query.device_id) {
      // 设置右边已选中参数
      this.rightList = [query.device_id]
    }
  },
  mounted() {},
  methods: {
    async loadData() {
      let ll = await this.loadDevice()
      this.leftList = ll
    },
    // 获取车辆列表
    async loadDevice() {
      let q = {}
      let query = {}
      query.status = 1
      q.query = query
      q.field = 'id,store_id,status,product_id,device_no'
      q.page = 1
      q.psize = 10000
      let res = await $utils.api.load('deviceList', q)
      let list = []
      if (res && res.data) {
        list = res.data.list || []
      }
      let ll = []
      for (let index = 0; index < list.length; index++) {
        const element = list[index]
        ll.push({ key: element.id, label: element.device_no + ' - ' + element.product_name })
      }
      return ll
    },
    // 获取车辆列表
    handleSubmit() {
      let device_ids = (this.rightList || []).join(',')
      if (!device_ids) {
        $utils.toast.error('请选择需要控制的设备')
        return
      }
      // 弹窗进行操作控制
      this.$Modal.info({
        title: '设备控制',
        okText: '关闭',
        render: (h) => {
          return <BoxControl device_ids={device_ids}></BoxControl>
        },
      })
    },
    swapChange(targetKeys, direction, moveKeys) {
      console.log('swapChange', targetKeys, direction, moveKeys)
      this.rightList = targetKeys
    },
  },
}
</script>
