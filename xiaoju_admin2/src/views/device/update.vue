<template>
  <div>
    <Row>
      <form-header :name="'固件升级'" :label="'车辆的固件升级信息'"></form-header>
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
    <Row>
      <Col :xs="24" :sm="24" :md="18" :lg="14">
        <Form ref="form" :model="forms" :label-width="120">
          <form-body :forms="forms" :items="items"></form-body>
        </Form>
      </Col>
    </Row>
    <Row style="height: 30px"></Row>
    <Row>
      <br />
      <Col :xs="24" :sm="24" :md="18" :lg="14">
        <Form :label-width="120">
          <FormItem>
            <Poptip confirm title="请检查数据, 再确认提交" @on-ok="handleSubmit">
              <button-sub :loading="sloading"></button-sub>
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
export default {
  extends: baseEdit,
  components: {},
  data() {
    return {
      sloading: false,
      action: 'add',
      title: '车辆升级',
      mname: 'device',
      items: [
        { label: '升级固件', name: 'update_url', value: '', type: 'file', rules: [{ required: true, trigger: 'blur' }] },
        { label: '固件校验码', name: 'update_crc', value: '', type: 'string', placeholder: '小安中控需要升级文件crc校验码，其他中控忽略', rules: [{ required: false, trigger: 'blur' }] },
      ],
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
      let q = {}
      q.device_ids = (this.rightList || []).join(',')
      q.update_url = this.forms.update_url
      q.update_crc = this.forms.update_crc
      if (!q.update_url) {
        $utils.toast.error('请上传升级固件')
        return
      }
      $utils.api.load('updateDevice', q, 'post', { toast: true })
    },
    swapChange(targetKeys, direction, moveKeys) {
      console.log('swapChange', targetKeys, direction, moveKeys)
      this.rightList = targetKeys
    },
  },
}
</script>
