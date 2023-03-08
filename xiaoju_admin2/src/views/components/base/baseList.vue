<template>
  <div>
    <!-- 标题 -->
    <h3 v-if="title">{{ title }}</h3>
    <!-- TAB目录 -->
    <Row :gutter="8" style="margin:0px 0 0 0;width:100%" v-if="menus && menus.length > 0">
      <Menu mode="horizontal" :active-name="menu_name" @on-select="selectMenu" style="width:100%">
        <div v-for="(v, k) in menus" :key="k">
          <MenuItem :name="v.name" v-auth="v.auth" @click="v.onClick">
            {{ v.label }}
          </MenuItem>
        </div>
      </Menu>
    </Row>
    <!-- 操作 -->
    <Row :gutter="8" style="margin:20px 0 0 0;width:100%" v-if="actions && actions.length > 0">
      <div v-for="(v, k) in actions" :key="k" style="margin-right:10px;display:inline-flex;">
        <!-- <Col span="3" :xxl="3" :xl="4" :lg="6" :md="8" :sm="12" :xs="12" v-auth="v.auth"> -->
        <Button :size="v.size || 'default'" :type="v.type || 'primary'" v-auth="v.auth" :icon="v.icon || ''" @click="v.onClick">{{ v.label }}</Button>
        <!-- </Col> -->
      </div>
    </Row>
    <!-- 筛选 -->
    <Row :gutter="8" style="margin:20px 0 0 0;width:100%;" v-if="filters && filters.length > 0">
      <Form ref="formQuery" :model="query" style="display: flex;flex-direction: row-reverse;flex-wrap: wrap; width:100%;">
        <Col span="3" :xxl="3" :xl="4" :lg="6" :md="8" :sm="12" :xs="24" style="margin:0px 0 10px 0;">
          <Button icon="ios-search" type="success" @click="search" style="width:48.5%">搜索</Button>
          <Button icon="ios-close-circle" type="default" @click="clearFilter" style="width:48.5%">重置</Button>
        </Col>
        <template v-for="(v, k) in filters">
          <Col :key="k" span="3" :xxl="3" :xl="4" :lg="6" :md="8" :sm="12" :xs="24" v-if="v.type === 'string' || v.type === 'text' || v.type === 'input'" style="margin:0px 0 10px 0;float:right">
            <Input :key="k" :placeholder="v.label" clearable v-model="query[v.name]"></Input>
          </Col>
          <Col :key="k" span="3" :xxl="3" :xl="4" :lg="6" :md="8" :sm="12" :xs="24" v-else-if="v.type === 'select'" style="margin:0px 0 10px 0;float:right">
            <i-select
              :key="k"
              v-model="query[v.name]"
              clearable
              style="width:100%"
              :multiple="v.multiple ? true : false"
              :disabled="v.disabled ? true : false"
              :placeholder="'请选择' + v.label"
              @on-change="v.onChange"
            >
              <Option :value="s.value" v-for="(s, sk) in v.dropList || []" :key="sk">{{ s.name }}</Option>
            </i-select>
          </Col>
          <Col :key="k" span="3" :xxl="3" :xl="4" :lg="6" :md="8" :sm="12" :xs="24" v-else-if="v.type === 'datetimerange'" style="margin:0px 0 10px 0;float:right">
            <DatePicker
              :key="k"
              type="datetimerange"
              style="width: 100%"
              format="yyyy-MM-dd HH:mm:ss"
              :placeholder="'请选择' + v.label + '范围'"
              @on-change="
                (val) => {
                  timeDateChange(val, v.name)
                }
              "
            ></DatePicker>
          </Col>
          <Col :key="k" v-else-if="v.type === 'distpicker'" style="margin:0px 0 10px 0;float:right">
            <FormAddress
              @on-change="
                (val) => {
                  onAddressChange(val, v.name)
                }
              "
              :value="distpickerValue"
              style="width: 100%"
            ></FormAddress>
          </Col>
        </template>
      </Form>
    </Row>
    <!-- 表格 -->
    <Row :gutter="8" style="margin:20px 0 0 0; width:100%;">
      <edit-table
        ref="tablelist"
        :query="query"
        :table="table"
        :order="table.order || ''"
        :rowClassName="table.rowClassName"
        :output="table.output"
        :border="table.border"
        :stripe="table.stripe"
        :header="table.header"
        :footer="table.footer"
        :columns-list="tableCols"
        :handleSpan="handleSpan"
        @on-select="handleSelect"
        @on-edit="handleEdit"
        @on-info="handleInfo"
        @on-del="handleDel"
      >
        <div slot="header">
          <tableHeader></tableHeader>
        </div>
        <div slot="action" v-if="tactions && tactions.length > 0">
          <div v-for="(v, k) in tactions" :key="k" style="margin-right:10px;display:inline-flex;">
            <Button :size="v.size || 'default'" :type="v.type || 'primary'" v-auth="v.auth" :icon="v.icon || ''" :disabled="v.disabled" @click="v.onClick">{{ v.label }}</Button>
          </div>
        </div>
        <div slot="footer">
          <tableFooter></tableFooter>
        </div>
      </edit-table>
    </Row>
    <!-- 审核弹框 -->
    <Modal v-model="pass.model" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="md-information-circled"></Icon>
        <span>审核</span>
      </p>
      <div>
        <Input placeholder="请输入审核意见" type="textarea" :autosize="{ minRows: 5 }" v-model="pass.content"></Input>
      </div>
      <div slot="footer">
        <Button size="large" :type="pass.status == 1 ? 'success' : 'error'" long @click="handlePass" :loading="pass.sloading">{{ pass.status == 1 ? '通过' : '拒绝' }}</Button>
      </div>
    </Modal>
    <!-- 侧栏详情 -->
    <Drawer title="详情" :closable="true" width="640" v-model="drawerBox">
      <component :is="drawerName" :kv="drawerKv"></component>
    </Drawer>
  </div>
</template>
<script>
import baseView from './baseView.vue'
import FormAddress from '../common/form/formAddress'

export default {
  extends: baseView,
  components: {
    tableHeader: null,
    tableFooter: null,
    FormAddress,
  },
  data() {
    return {
      title: '',
      table: {
        mname: '',
        key: '',
        url: {},
        output: false,
        border: true,
        stripe: true,
        header: false,
        footer: false,
        rowClassName: () => {},
        order: '',
        router: {
          add: '',
          edit: '',
        },
      },
      drawerBox: false, // 侧栏详情
      drawerName: 'info', // 动态渲染的组件
      drawerKv: '', // 详情主键
      pass: {
        model: false,
        sloading: false,
        kv: null,
        status: 0,
        content: '',
        modelMap: false,
      },
      distpickerValue: '',
      selected: '',
      router: { add: '', edit: '' },
      actions: [],
      tactions: [],
      menu_name: '',
      menus: [],
      query: {},
      filters: [],
      tableCols: [],
    }
  },
  watch: {
    query() {
      this.$forceUpdate()
    },
    filters() {
      this.$forceUpdate()
    },
  },
  created() {
    let route = this.$route
    console.log('route', route)
    if (route) {
      this.menu_name = route.name
    }
    // 表格行样式
    this.table.rowClassName = (row, index) => {
      return this.rowClassName(row, index)
    }
  },
  mounted() {
    this.search()
  },
  methods: {
    search() {
      console.log('list search')
      // 取消多选框，否则有残留数据
      this.selected = ''
      this.$refs.tablelist.page.page = 1
      this.$refs.tablelist.init()
    },
    // onAddressChange(val, field) {
    //   console.log(val, 'xxxxxx')
    //   let province = val.province || {}
    //   let city = val.city || {}
    //   let area = val.area || {}
    //   console.log(val.province)
    //   this.query[field] = {
    //     field: field,
    //     province_code: province.code,
    //     city_code: city.code,
    //     area_code: area.code,
    //   }
    //   console.log('timeDateChange fieldobj', this.query[field])
    // },
    onAddressChange(val) {
      console.log('onAddressChange', val)
      this.query.province_code = val.province.code || ''
      this.query.city_code = val.city.code || ''
      this.query.district_code = val.area.code || ''
    },
    clearFilter() {
      // window.location.reload(true);
      // this.$refs.formQuery.resetFields();
      for (let index = 0; index < this.filters.length; index++) {
        const element = this.filters[index]
        if (element) {
          this.query[element.name] = ''
          this.query.province_code = ''
          this.query.city_code = ''
          this.query.district_code = ''
        }
      }
      // 重置地址选择器
      this.distpickerValue = {
        province: '省',
        city: '市',
        area: '区',
      }
      this.$refs.tablelist.page.page = 1
      this.$refs.tablelist.init()
    },
    exportData(filename = '', is_all = 0) {
      // 调用table导出
      const ids = this.selected
      console.log('exportData ids', ids)
      console.log('exportData is_all', is_all)
      this.$refs.tablelist.exportData(4, ids, filename, is_all)
    },
    selectMenu(name) {
      console.log('selectMenu ', name)
      if (this.menu_name !== name) {
        $utils.url.push({ name: name })
      }
    },
    loadFiltersFieldDrop(type, field, param = {}) {
      // 通过pk查询字典数据
      let q = param
      let apiname = ''
      if (type == 'shop') {
        apiname = 'shopDropList'
      }
      if (type == 'shop_store') {
        apiname = 'shopStoreDropList'
      }
      if (type == 'product') {
        apiname = 'productDropList'
      }
      if (type == 'product_class') {
        apiname = 'productClassDropList'
      }
      if (type == 'help_class') {
        apiname = 'helpClassDropList'
      }
      if (type == 'auth_type') {
        apiname = 'authTypeDropList'
      }
      if (!apiname) {
        return
      }
      $utils.api.load(apiname, q).then((res) => {
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
          for (let index = 0; index < this.filters.length; index++) {
            const element = this.filters[index]
            if (element && element.name == field && element.type == 'select') {
              this.filters[index]['dropList'] = dropList
            }
          }
          console.log('dropList ' + field, dropList)
        }
      })
    },
    // 通过name查询filters下标
    indexOfName(name = '', filters = []) {
      if (!name) {
        return -1
      }
      if (!filters) {
        filters = this.filters || []
      }
      for (let index = 0; index < this.filters.length; index++) {
        const element = this.filters[index]
        if (element && element.name == name) {
          return index
        }
      }
      return -1
    },
    timeDateChange(val, field) {
      console.log('timeDateChange', val, field)
      // this.query.starttime = val[0]
      // this.query.endtime = val[1]
      this.query[field] = {
        field: field,
        starttime: val[0],
        endtime: val[1],
      }
      console.log('timeDateChange fieldobj', this.query[field])
    },
    // 合并行列
    handleSpan({ row, column, rowIndex, columnIndex }) {
      // console.log('handleSpan', row, column, rowIndex, columnIndex)
    },
    rowClassName(row, index) {
      // console.log(row, index)
      return ''
    },
    toAdd(e, name = '') {
      let url = this.table.router.add || this.toLine(this.table.mname) + '_add'
      if (name && name !== '' && name !== undefined) {
        url = name
      }
      console.log('toAdd', url, name, e)
      $utils.url.push({ name: url, query: { action: 'add' } })
    },
    handleEdit(row) {
      let kv = row[this.table.key]
      let url = this.table.router.edit || this.toLine(this.table.mname) + '_edit'
      console.log('handleEdit', row)
      $utils.url.push({ name: url, query: { action: 'edit', kv: kv } })
    },
    handleSelect(selected, row) {
      console.log('handleSelect', selected, row)
      let ids_arr = []
      for (let index = 0; index < selected.length; index++) {
        const element = selected[index]
        ids_arr.push(element[this.table.key])
      }
      this.selected = ids_arr.join(',')
      console.log('selected', this.selected, ids_arr)
    },
    handleDel(row) {},
    handleInfo(row) {
      let kv = row[this.table.key]
      // 打开详情
      this.drawerBox = true
      this.drawerKv = kv
      // this.drawerIndex = 0
      // let kv = row[this.table.key]
      // let url = this.table.router.info || this.toLine(this.table.mname) + "_info"
      // console.log('handleInfo', row)
      // $utils.url.push({name: url, query: {kv: kv} })
    },
    handlePass() {
      let q = {}
      q.kv = this.pass.kv
      q.status = this.pass.status
      q.pass_content = this.pass.content
      if (q.kv == '' || q.status == '' || q.pass_content == '') {
        return $utils.toast.error('请求数据错误')
      }
      this.$set(this.pass, 'sloading', true)
      $utils.api
        .load(this.table.url.pass || this.table.mname + 'Pass', q)
        .then((res) => {
          $utils.toast.text(res.message)
          if (res.status) {
            this.$set(this.pass, 'model', false)
            this.$set(this.pass, 'sloading', false)
            this.search()
          }
        })
        .catch((e) => {
          console.log(e)
          this.$set(this.pass, 'sloading', false)
          $utils.toast.error('数据异常')
        })
    },
  },
}
</script>
<style lang="less">
.modelMap {
  position: relative;
}
#container {
  margin: 0 auto;
}
</style>
