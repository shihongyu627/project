<template>
  <div>
    <Row>
      <Col :xs="24" :sm="24" :md="18" :lg="14">
        <Form ref="form" :model="forms" :label-width="120">
          <form-body :forms="forms" :items="items"></form-body>
        </Form>
      </Col>
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
      title: '车辆投放',
      mname: 'device',
      items: [
        { label: '投放信息', desc: '车辆的投放信息', type: 'header' },
        { label: '投放商家', name: 'shop_id', value: '', type: 'select', dropList: [], onChange: this.shopChange.bind(this), rules: [{ required: true, trigger: 'blur', type: 'number' }] },
        { label: '投放区域', name: 'store_id', value: '', type: 'select', dropList: [], onChange: this.storeChange.bind(this), rules: [{ required: true, trigger: 'blur', type: 'number' }] },
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
    await this.loadItemsFieldDrop('shop', 'shop_id')
  },
  mounted() {},
  methods: {
    // 商家选择改变-设置区域下拉列表
    async shopChange(val) {
      console.log(val)
      // 清空区域下拉
      this.forms['store_id'] = null
      this.items[this.indexOfName('store_id')]['value'] = null
      this.items[this.indexOfName('store_id')]['dropList'] = []
      if (val) {
        await this.loadItemsFieldDrop('shop_store', 'store_id', { shop_id: val })
      }
    },
    // 区域下拉列表
    async storeChange(val) {
      console.log(val)
      if (val) {
        this.loadData()
      }
    },
    async loadData() {
      let ll = await this.loadDevice()
      this.leftList = ll
      if (this.forms.store_id) {
        let rr = await this.loadDevice(this.forms.store_id)
        let xxrr = []
        for (let index = 0; index < rr.length; index++) {
          const element = rr[index]
          xxrr.push(element.key)
        }
        this.rightList = xxrr
      }
    },
    // 获取车辆列表
    async loadDevice(store_id = '') {
      let q = {}
      let query = {}
      query.status = 1
      query.store_id = store_id
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
      q.store_id = this.forms.store_id
      if (!q.store_id) {
        $utils.toast.error('请选择投放区域')
        return
      }
      if (!q.device_ids) {
        $utils.toast.error('请选择投放车辆')
        return
      }
      $utils.api.load('swapDevice', q, 'post', { toast: true })
    },
    swapChange(targetKeys, direction, moveKeys) {
      console.log('swapChange', targetKeys, direction, moveKeys)
      this.rightList = targetKeys
    },
  },
}
</script>
