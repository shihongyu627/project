<template>
  <div style="width:100%">
    <Table
      :ref="ref"
      id="datatable"
      size="default"
      :loading="loading"
      :row-class-name="rowClassName"
      :stripe="stripe"
      :border="border"
      :width="width"
      :height="height"
      :columns="columnsList"
      :span-method="handleSpan"
      :data="thisTableData"
      @on-row-click="clickRow"
      @on-select="selectRowOne"
      @on-selection-change="selectRow"
      @on-sort-change="changeSort"
    >
      <slot name="header" slot="header" v-if="header"></slot>
      <slot name="footer" slot="footer" v-if="footer"></slot>
      <slot name="loading" slot="loading">
        <Spin fix class="loading-spin-col">
          <Icon type="ios-loading" size="18" class="loading-spin-icon-load"></Icon>
          <div>加载中</div>
        </Spin>
      </slot>
    </Table>
    <Row :gutter="8" :style="'margin:20px 0 0 0;overflow: hidden; width:100%; padding-bottom:5px;display:' + (getWindowWidth() > 480 ? 'flex' : 'block') + ';align-items:center'">
      <Col style="flex:1">
        <slot name="action">
          <Button type="success" v-if="output" @click="exportData(4)" icon="ios-cloud-download-outline">导出全部数据</Button>
        </slot>
      </Col>
      <Col style="flex:2.5;just-content:flex-end;">
        <slot name="page">
          <Page
            :total="page.total"
            :current="page.page"
            :page-size="page.psize"
            :page-size-opts="[10, 20, 30, 50, 100, 200, 500, 1000, 2000]"
            show-total
            :show-elevator="getWindowWidth() > 480 ? true : false"
            :show-sizer="getWindowWidth() > 480 ? true : false"
            @on-change="changePage"
            @on-page-size-change="changePagesize"
          ></Page>
        </slot>
      </Col>
    </Row>
    <Modal title="图片预览" v-model="imgVisible">
      <img :src="loadimg(imgUrl)" style="width: 100%" />
    </Modal>
    <Modal title="多图预览" v-model="imgVisibles">
      <div style="height:620px;overflow-y: auto;;">
        <div style="text-align:center;">
          <img :src="loadimg(v)" v-for="(v, k) in imgUrls" :key="k" style="width:420px;" />
        </div>
      </div>
    </Modal>
    <playVideo :title="playTitle" :vu="playVu" v-model="playVisible"></playVideo>
  </div>
</template>

<script>
import Clipboard from 'clipboard'
const copyText = (vm, h, currentRow, param) => {
  const key = param.column.key
  const txt = currentRow[param.column.key]
  return h(
    'a',
    {
      attrs: {
        'data-clipboard-text': txt,
      },
      class: ['table_cp_' + key],
      style: {
        color: '#495060',
      },
      on: {
        click: () => {
          var clipboard = new Clipboard('.table_cp_' + key)
          vm.$Message.info('已复制 ' + txt)
        },
      },
    },
    txt
  )
}
const switchButton = (vm, h, currentRow, param) => {
  let directives = param.column.auth ? [{ name: 'auth', value: param.column.auth }] : []
  return h(
    'i-switch',
    {
      // 自定义指令
      directives: directives,
      props: {
        size: 'small',
        value: currentRow[param.column.key] == 1 ? true : false,
        disabled: param.column.disabled ? true : false,
      },
      style: {
        margin: '4px 5px',
      },
      on: {
        'on-change': (vv) => {
          vm.handleSwitch(currentRow, param.index, param.column.key, vv, param)
        },
      },
    },
    '开关'
  )
}
const badgeTag = (vm, h, currentRow, param) => {
  return h('Badge', {
    props: {
      size: 'small',
      value: currentRow[param.column.key],
      color: param.column.color ? param.column.color : '',
    },
    style: {
      margin: '4px 5px',
    },
  })
}
const editButton = (vm, h, currentRow, index, auth) => {
  return h(
    'div',
    {
      // 自定义指令
      directives: [
        {
          name: 'auth',
          value: auth,
        },
      ],
      style: {
        display: 'inline-block',
      },
    },
    [
      h(
        'Button',
        {
          props: {
            size: 'small',
            type: currentRow.editting ? 'success' : 'primary',
          },
          // 自定义指令
          directives: [
            {
              name: 'auth',
              value: auth,
            },
          ],
          style: {
            margin: '4px 5px',
          },
          on: {
            click: () => {
              vm.handleEdit(currentRow, index)
            },
          },
        },
        '编辑'
      ),
    ]
  )
}
const deleteButton = (vm, h, currentRow, index, auth) => {
  return h(
    'Poptip',
    {
      props: {
        confirm: true,
        title: '确定要删除这条数据吗?',
        transfer: true,
      },
      // 自定义指令
      directives: [
        {
          name: 'auth',
          value: auth,
        },
      ],
      on: {
        'on-ok': () => {
          vm.handleDel(currentRow, index)
        },
      },
    },
    [
      h(
        'div',
        {
          // 自定义指令
          directives: [
            {
              name: 'auth',
              value: auth,
            },
          ],
          style: {
            display: 'inline-block',
          },
        },
        [
          h(
            'Button',
            {
              props: {
                size: 'small',
                type: 'error',
                placement: 'top',
              },
              // 自定义指令
              directives: [
                {
                  name: 'auth',
                  value: auth,
                },
              ],
              style: {
                margin: '4px 5px',
              },
            },
            '删除'
          ),
        ]
      ),
    ]
  )
}

const syncButton = (vm, h, currentRow, index, auth) => {
  return h(
    'Button',
    {
      props: {
        size: 'small',
        type: 'success',
      },
      // 自定义指令
      directives: [
        {
          name: auth ? 'auth' : '', // 判断是否需要权限控制
          value: auth,
        },
      ],
      style: {
        margin: '4px 5px',
      },
      on: {
        click: () => {
          vm.handleSync(currentRow, index)
        },
      },
    },
    '同步'
  )
}

const infoButton = (vm, h, currentRow, index, auth) => {
  return h(
    'Button',
    {
      props: {
        size: 'small',
        type: 'primary',
      },
      // 自定义指令
      directives: [
        {
          name: 'auth',
          value: auth,
        },
      ],
      style: {
        margin: '4px 5px',
        background: '#808695',
        'border-color': '#808695',
      },
      on: {
        click: () => {
          vm.handleInfo(currentRow, index)
        },
      },
    },
    '详情'
  )
}

// 视频播放
const playButton = (vm, h, currentRow, param) => {
  let title = currentRow[param.column.play.title]
  let vu = currentRow[param.column.play.vu]
  return h(
    'Button',
    {
      props: {
        size: 'small',
        type: 'success',
      },
      style: {
        margin: '0 5px',
      },
      on: {
        click: () => {
          vm.playTitle = title
          vm.playVu = vu
          vm.playVisible = true
        },
      },
    },
    '播放'
  )
}

// 图片 头像显示
const viewImage = (vm, h, imgUrl, isAvatar) => {
  let src = ''
  let srcs = []
  if (typeof imgUrl == 'string') {
    srcs = imgUrl.split(',')
    if (srcs) {
      src = srcs[0]
    }
  }
  if (typeof imgUrl == 'array') {
    srcs = imgUrl
    if (srcs) {
      src = srcs[0]
    }
  }
  if (!src) {
    return
  }
  src = $utils.image.load(imgUrl)
  // 头像 圆形
  if (isAvatar) {
    return h('Avatar', {
      props: {
        src: src,
      },
      style: {},
      on: {},
    })
  } else {
    return h('img', {
      domProps: {
        src: src,
      },
      style: {
        margin: '5px auto',
        width: 'auto',
        height: '60px',
      },
      on: {
        click: () => {
          vm.imgUrl = src
          vm.imgVisible = true
        },
      },
    })
  }
}

// 多图 预览
const viewImages = (vm, h, imgUrls) => {
  let src = ''
  let srcs = []
  if (typeof imgUrls == 'string') {
    srcs = imgUrls.split(',')
    if (srcs) {
      src = srcs[0]
    }
  }
  if (typeof imgUrls == 'array') {
    srcs = imgUrls
    if (srcs) {
      src = srcs[0]
    }
  }
  if (!src) {
    return
  }
  src = $utils.image.load(src)
  return h('img', {
    domProps: {
      src: src,
    },
    style: {
      margin: '5px auto',
      width: 'auto',
      height: '60px',
    },
    on: {
      click: () => {
        vm.imgUrls = []
        vm.imgVisibles = true
        vm.imgVisiblesV = 0
        vm.imgUrls = srcs
        console.log(vm.imgUrls)
      },
    },
  })
}

// 用户显示
const viewUser = (vm, h, user = {}) => {
  let uid = user.uid
  let uname = user.user_nick
  let src = user.user_head ? $utils.image.load(user.user_head) : ''
  // 去掉头像显示
  user.user_head = null
  // 头像 圆形
  return h(
    'div',
    {
      style: {
        height: '34px',
        lineHeight: '34px',
        overflow: 'hidden',
      },
    },
    [
      user.user_head &&
        h('Avatar', {
          props: {
            src: src,
          },
          attrs: {
            title: 'UID: ' + uid,
          },
          style: {},
        }),
      h(
        'span',
        {
          attrs: {
            title: uname,
          },
          style: {
            marginLeft: '5px',
            width: 'auto',
            height: '34px',
            overflow: 'hidden',
          },
        },
        uname
      ),
    ]
  )
}

// 行内编辑
const incellEditBtn = (vm, h, param) => {
  if (vm.hoverShow) {
    return h(
      'div',
      {
        class: {
          'show-edit-btn': vm.hoverShow,
        },
      },
      [
        h('Button', {
          props: {
            type: 'text',
            icon: 'md-create',
            ghost: true,
          },
          on: {
            click: (event) => {
              vm.thisTableData[param.index].edittingCell[param.column.key] = true
            },
          },
        }),
      ]
    )
  } else {
    return h('Button', {
      props: {
        type: 'text',
        icon: 'md-create',
        ghost: true,
      },
      on: {
        click: (event) => {
          vm.thisTableData[param.index].edittingCell[param.column.key] = true
        },
      },
    })
  }
}
const saveIncellEditBtn = (vm, h, currentRow, param) => {
  return h('Button', {
    props: {
      type: 'text',
      icon: 'md-checkmark',
      // ghost: true
    },
    on: {
      click: (event) => {
        vm.thisTableData[param.index].edittingCell[param.column.key] = false
        if (!vm.edittingStore[param.index] || !vm.edittingStore[param.index][param.column.key]) {
          return
        }
        let oldvalue = vm.thisTableData[param.index][param.column.key]
        let newvalue = vm.edittingStore[param.index][param.column.key]
        if (oldvalue == newvalue) {
          return
        }
        vm.handleField(currentRow, param.index, param.column.key, newvalue)
      },
    },
  })
}
const cellInput = (vm, h, currentRow, param) => {
  return h('Input', {
    props: {
      type: 'text',
      value: currentRow[param.column.key],
    },
    on: {
      'on-change'(event) {
        if (!vm.edittingStore[param.index]) {
          vm.edittingStore[param.index] = {}
        }
        vm.edittingStore[param.index][param.column.key] = event.target.value
      },
    },
  })
}

import playVideo from './playVideo.vue'
import XLSX from 'xlsx'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
  name: 'editTable',
  components: {
    playVideo,
    swiper,
    swiperSlide,
  },
  props: {
    ref: {
      type: String,
      default: 'table',
    },
    columnsList: Array,
    value: Array,
    url: String,
    query: {
      type: Object,
      default: () => {},
    },
    table: Object,
    order: {
      type: String,
      default: 'create_time desc',
    },
    filename: {
      type: String,
      default: '导出数据集',
    },
    savepage: {
      // 保存页码
      type: null,
      default: true,
    },
    output: {
      // 导出按钮
      type: Boolean,
      default: false,
    },
    border: {
      // 导出按钮
      type: Boolean,
      default: true,
    },
    stripe: {
      // 导出按钮
      type: Boolean,
      default: true,
    },
    header: {
      // 导出按钮
      type: Boolean,
      default: false,
    },
    footer: {
      // 导出按钮
      type: Boolean,
      default: false,
    },
    rowClassName: {
      // 行样式
      type: null,
      default: () => {},
    },
    handleSpan: {
      // 合并行列
      type: null,
      default: () => {},
    },
  },
  data() {
    return {
      loading: false,
      width: 'auto',
      columns: [],
      thisTableData: [],
      edittingStore: [],
      hoverShow: true,
      imgUrl: '',
      imgVisible: false,
      imgUrls: [],
      imgVisibles: false,
      imgVisiblesV: 0,
      playTitle: '',
      playVu: '',
      playVisible: false,
      page: {
        p: 1,
        psize: 10,
        total: 10,
      },
      swiperOption: {
        pagination: {
          el: '.swiper-pagination',
        },
      },
    }
  },
  computed: {
    height() {
      // 获取右边box-body高度
      let iheight = window.innerHeight
      let height = iheight - 380 - 0
      console.log('table height', height)
      if (iheight < 500) {
        return 'auto'
      }
      return height
    },
  },
  watch: {
    columnsList() {
      this.init()
    },
    value(data) {
      this.init()
    },
  },
  async created() {
    await this.initItems()
  },
  mounted() {},
  methods: {
    async init() {
      await this.initItems()
      await this.ajaxData()
    },
    async initItems() {
      let vm = this
      // 可编辑的单元格
      let editableCell = this.columnsList.filter((item) => {
        if (item.editable) {
          if (item.editable === true) {
            return item
          }
        }
      })
      this.columnsList.forEach((item) => {
        // 开关
        if (item.switch) {
          item.render = (h, param) => {
            let currentRow = this.thisTableData[param.index]
            return h('div', [switchButton(this, h, currentRow, param)])
          }
        }
        // 徽标
        if (item.badge) {
          item.render = (h, param) => {
            let currentRow = this.thisTableData[param.index]
            return h('div', [badgeTag(this, h, currentRow, param)])
          }
        }
        // 时间
        if (item.time) {
          item.render = (h, param) => {
            let currentRow = this.thisTableData[param.index]
            if (currentRow[item.key]) {
              let time = $utils.time.format(currentRow[item.key], item.time !== true ? item.time : '')
              return h('div', [time])
            }
          }
        }
        // 文本复制
        if (item.copy) {
          item.render = (h, param) => {
            let currentRow = this.thisTableData[param.index]
            return h('div', [copyText(this, h, currentRow, param)])
          }
        }
        // 文字链接
        if (item.url) {
          item.render = (h, param) => {
            let currentRow = this.thisTableData[param.index]
            let text = currentRow[item.url.text] ? currentRow[item.url.text] : item.url.text
            let url = currentRow[item.url.url] ? currentRow[item.url.url] : item.url.url
            return h(
              'a',
              {
                attrs: {
                  target: '_blank',
                  href: url,
                },
              },
              text
            )
          }
        }
        // 播放视频
        if (item.play) {
          item.render = (h, param) => {
            let currentRow = this.thisTableData[param.index]
            return h('div', [playButton(this, h, currentRow, param)])
          }
        }
        // 预览图片 / 头像
        if (item.viewimage) {
          item.render = (h, param) => {
            let currentRow = this.thisTableData[param.index]
            let imgUrl = currentRow[param.column.key]
            let isAvatar = param.column.isAvatar || false
            return h('div', [viewImage(this, h, imgUrl, isAvatar)])
          }
        }
        // 预览多图片
        if (item.viewimages) {
          item.render = (h, param) => {
            let currentRow = this.thisTableData[param.index]
            let imgUrls = currentRow[param.column.key]
            return h('div', [viewImages(this, h, imgUrls)])
          }
        }
        // 预览用户
        if (item.user) {
          item.render = (h, param) => {
            let currentRow = this.thisTableData[param.index]
            let user = currentRow[param.column.user] || {}
            return h('div', [viewUser(this, h, user)])
          }
        }
        // 编辑单元格-修改字段
        if (item.editable) {
          item.render = (h, param) => {
            let ccc = this.thisTableData[param.index]
            if (!ccc.edittingCell) {
              let edittingCell = {}
              editableCell.forEach((it) => {
                edittingCell[it.key] = false
              })
              this.$set(this.thisTableData[param.index], 'edittingCell', edittingCell)
            }
            let currentRow = this.thisTableData[param.index]
            return h(
              'Row',
              {
                props: {
                  type: 'flex',
                  align: 'middle',
                  justify: 'center',
                },
              },
              [
                h(
                  'Col',
                  {
                    props: {
                      span: '4',
                    },
                  },
                  [h('span', '')]
                ),
                h(
                  'Col',
                  {
                    props: {
                      span: '16',
                    },
                  },
                  [
                    !currentRow.edittingCell[param.column.key] ? h('span', currentRow[item.key]) : cellInput(this, h, currentRow, param),
                    // !true ? h('span', currentRow[item.key]) : cellInput(this, h, currentRow, param, item)
                  ]
                ),
                h(
                  'Col',
                  {
                    props: {
                      span: '4',
                    },
                  },
                  [currentRow.edittingCell[param.column.key] ? saveIncellEditBtn(this, h, currentRow, param) : incellEditBtn(this, h, param)]
                ),
              ]
            )
          }
        }
        // 操作
        console.log('handle info  xxxxxxxxxxxxxx')
        if (item.handle) {
          item.render = (h, param) => {
            let currentRow = this.thisTableData[param.index]
            let ll = []
            item.handle.forEach((v) => {
              if (v == 'edit') {
                // 编辑权限
                let auth = ''
                if (item.auth && item.auth.edit) {
                  auth = item.auth.edit
                }
                ll.push(editButton(this, h, currentRow, param.index, auth))
              }
              if (v == 'delete' || v == 'del') {
                // 删除权限
                let auth = ''
                if (item.auth && item.auth.delete) {
                  auth = item.auth.delete
                }
                if (item.auth && item.auth.del) {
                  auth = item.auth.del
                }
                ll.push(deleteButton(this, h, currentRow, param.index, auth))
              }
              if (v == 'info') {
                // 详情权限
                let auth = ''
                if (item.auth && item.auth.info) {
                  auth = item.auth.info
                }
                ll.push(infoButton(this, h, currentRow, param.index, auth))
              }
              if (v == 'sync') {
                // 同步权限
                let auth = ''
                if (item.auth && item.auth.sync) {
                  auth = item.auth.sync
                }
                ll.push(syncButton(this, h, currentRow, param.index, auth))
              }
              if (v == 'play') {
                ll.push(playButton(this, h, currentRow, param))
              }
              // 添加自定义按钮
              if (typeof v == 'function') {
                ll.push(v(this, h, currentRow, param))
              }
            })
            return h('div', ll)
          }
        }
      })
    },
    async ajaxData() {
      let q = {}
      q.mname = this.table.mname
      if (this.savepage) {
        q.page = (this.$store && this.$store.store && this.$store.state.app && this.$store.state.app.tablePage[this.table.mname + (this.savepage === true ? '' : this.savepage)]) || this.page.page // 页码 = 表名 + 保存值
      } else {
        q.page = this.page.page
      }
      q.psize = this.page.psize
      q.order = this.order
      q.query = this.query

      this.loading = true
      let res = await $utils.api.load(this.table.url.list || this.table.mname + 'List', q, 'get')
      this.loading = false
      if (res && res.code == 1) {
        this.thisTableData = res.data.list || []
        this.page = res.data.page
      }
    },
    changeSort(v) {
      this.order = `${v.key} ${v.order}`
      if (v.order == 'normal') {
        this.order = ''
      }
      // 刷新数据
      this.ajaxData()
      console.log('column sort ', v)
    },
    changePage(p) {
      // 记录表格当前页面，返回时调用
      this.$store.commit('setTablePage', { name: this.table.mname, page: p })
      this.page.page = p
      // 刷新数据
      this.ajaxData()
      console.log('page ', this.table.mname, p)
    },
    changePagesize(psize) {
      // 刷新数据 页码置1
      this.$store.commit('setTablePage', { name: this.table.mname, page: 1 })
      this.page.page = 1
      this.page.psize = psize
      this.ajaxData()
      console.log('page size ', this.table.mname, psize)
    },
    clickRow(row, index) {
      this.$emit('on-click', row, index)
      console.log('click ', row, index)
    },
    selectRowOne(selection, row) {
      // this.$emit('on-select', selection, row)
      // console.log('select ', selection, row)
    },
    selectRow(selection) {
      this.$emit('on-select', selection)
      // console.log('select ', selection, row)
    },
    loadimg(url, type = 'image') {
      console.log(url)
      return $utils.image.load(url, type)
    },
    getWindowWidth() {
      return window.innerWidth
    },
    handleEdit(row, index) {
      this.$emit('on-edit', row)
      console.log('edit ', row, index) //编辑
    },
    handleInfo(row, index) {
      this.$emit('on-info', row)
      console.log('info ', row, index) //编辑
    },
    handleSwitch(row, index, field, value, param = {}) {
      let true_v = param.switch_true || 1
      let false_v = param.switch_false || 0
      let q = {}
      q.kv = row[this.table.key]
      q.f = field
      q.fv = value ? true_v : false_v
      console.log(q)
      $utils.api.load(param.column.switch_url || this.table.url.switch || this.table.mname + 'Switch', q).then((res) => {
        if (res && res.status) {
          console.log(this.thisTableData[index][field])
          this.thisTableData[index][field] = res.data
          console.log('setswitch ', row, index, field)
        }
      })
    },
    handleField(row, index, field, value) {
      let q = {}
      q.kv = row[this.table.key]
      q.f = field
      q.fv = value
      $utils.api.load(this.table.url.field || this.table.mname + 'Field', q).then((res) => {
        if (res && res.status) {
          this.thisTableData[index][field] = res.data
          console.log('setfield ', row, index, field)
        }
      })
    },
    handleDel(row, index) {
      let q = {}
      console.log(row)
      q.kv = row[this.table.key]
      $utils.api.load(this.table.url.del || this.table.mname + 'Del', q).then((res) => {
        if (res && res.status) {
          this.thisTableData.splice(index, 1)
          $utils.toast.text(res.message)
          this.$emit('on-del', row)
          this.page.total-- //后加上去的
          console.log('delete ', row, index)
        }
      })
    },
    handleSync(row, index) {
      let q = {}
      console.log(row)
      q.kv = row[this.table.key]
      $utils.api.load(this.table.url.sync || this.table.mname + 'Sync', q).then((res) => {
        if (res && res.status) {
          $utils.toast.text(res.message)
          this.$emit('on-sync', row)
          console.log('sync ', row, index)
        }
      })
    },
    exportData(type, ids = '', filename = '', is_all = 0) {
      if (true) {
        let q = {}
        q.order = this.order
        q.query = this.query
        q.ids = ids
        q.is_all = is_all
        if (is_all === 1) {
          if ((this.page && this.page.total) > 10000) {
            $utils.toast.text('数据超过10000条，请通过日期筛选再导出')
            return
          }
        } else {
          if (!ids) {
            $utils.toast.text('请先选择需要导出的数据')
            return
          }
        }
        $utils.toast.text('数据正在导出，请稍后')
        $utils.api.load(this.table.url.export || this.table.mname + 'Export', q, 'post', {loading:true,loadingtext:'导出中，请等待···'}, 'blob').then((res) => {
          if (res) {
            const url = window.URL.createObjectURL(new Blob([res]))
            let link = document.createElement('a')
            let fname = (filename || this.filename || '导出数据') + '_' + $utils.time.format(Date.parse(new Date()) / 1000, 'YYYYMMDDHHmmss')
            let fileName = fname + '.xls'
            link.href = url
            link.download = fileName
            link.target = '_blank'
            link.click()
            //释放内存
            window.URL.revokeObjectURL(link.href)
          } else {
            $utils.toast.error('下载出错')
          }
        }).catch(err=>{
          $utils.loading.hide()
        })
      } else {
        let time = $utils.time.now()
        let name = (filename || this.filename || '导出数据') + '_' + time
        if (type === 1) {
          this.$refs[this.ref].exportCsv({
            // 导出原始数据
            filename: name,
            original: true,
          })
        } else if (type === 2) {
          this.$refs[this.ref].exportCsv({
            // 导出排序和过滤后数据
            filename: name,
            original: false,
          })
        } else if (type === 3) {
          this.$refs[this.ref].exportCsv({
            // 导出自定义数据
            filename: name,
            // columns: this.columns8.filter((col, index) => index < 4),
            // data: this.data7.filter((data, index) => index < 4)
          })
        } else if (type === 4) {
          // 第三方xlsx导出excel
          var elt = document.getElementById('datatable')
          var wb = XLSX.utils.table_to_book(elt, { sheet: 'Sheet JS', raw: true })
          let dl = null,
            fn = null,
            ext = null
          return dl ? XLSX.write(wb, { bookType: type, bookSST: true, type: 'base64' }) : XLSX.writeFile(wb, fn || name + '.' + (ext || 'xlsx'))
        }
      }
    },
  },
}
</script>
<style lang="less">
.show-edit-btn {
  display: none;
  margin-left: -10px;
}
.ivu-table-cell:hover .show-edit-btn {
  display: inline-block;
}
.ivu-table-wrapper {
  border-color: #efefef;
}
.ivu-table:after,
.ivu-table:before {
  background-color: #efefef;
}
</style>
<style lang="less" scoped>
.loading-spin-icon-load {
  animation: ani-loading-spin 1s linear infinite;
}
@keyframes ani-loading-spin {
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.loading-spin-col {
  // height: 100px;
  width: 100px;
  text-align: center;
  position: relative;
  // border: 1px solid #eee;
}
</style>
