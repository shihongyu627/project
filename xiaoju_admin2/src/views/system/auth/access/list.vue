<script>
import baseList from '@/views/components/base/baseList.vue'
import { Poptip, Button } from 'view-design'
import Clipboard from 'clipboard'
import SysLogList from '../../log/uplog/list.vue'
export default {
  extends: baseList,
  components: {},
  data() {
    return {
      table: {
        mname: 'authAccess',
        key: 'suid',
        url: {},
        output: false,
      },
      menus: [
        { label: '用户权限', name: 'auth_access_list', auth: '/admin/authaccess/lists' },
        { label: '角色权限', name: 'auth_group_list', auth: '/admin/authgroup/lists' },
        { label: '账户类型', name: 'auth_type_list', auth: '/admin/authtype/lists' },
      ],
      actions: [{ label: '新增', icon: 'md-add', onClick: this.toAdd, auth: '/admin/authaccess/add' }],
      tactions: [
        { label: '导出数据', type: 'success', onClick: this.exportData.bind(this, '账户数据', 0), auth: '/admin/authaccess/lists' },
        { label: '导出全部数据', type: 'error', onClick: this.exportData.bind(this, '账户数据', 1), auth: '/admin/authaccess/lists' },
      ],
      query: {},
      filters: [
        { label: '姓名', name: 'name', value: '', type: 'input' },
        { label: '手机号', name: 'user_mobile', value: '', type: 'input' },
        {
          label: '工作性质',
          name: 'work_type',
          value: '',
          type: 'select',
          dropList: [
            { value: 1, name: '内部全职' },
            { value: 2, name: '外部全职' },
            { value: 3, name: '合作商家' },
            { value: 4, name: '临时兼职' },
          ],
        },
        {
          label: '账户类型',
          name: 'type',
          value: '',
          type: 'select',
          dropList: [],
        },
      ],
      tableCols: [
        {
          type: 'selection',
          width: 60,
        },
        {
          title: 'SUID',
          key: 'suid',
          width: 80,
        },
        {
          title: '姓名',
          key: '',
          width: 120,
          render: (h, params) => {
            const row = params.row
            let text = row.name
            return h('span', {}, text)
          },
        },
        {
          title: '手机号',
          key: 'user_mobile',
          width: 140,
          copy: true,
        },
        // {
        //   title: '头像',
        //   key: '',
        //   width: 80,
        //   render: (h, params) => {
        //     const row = params.row
        //     let src = $utils.image.load(row.user.head)
        //     return h('Avatar', {
        //       props: {
        //         src: src,
        //       },
        //     })
        //   },
        // },
        {
          title: '账户类型',
          key: '',
          align: 'center',
          width: 100,
          render: (h, params) => {
            const row = params.row
            let text = row.type_name
            return h('span', {}, text)
          },
        },
        {
          title: '工作性质',
          key: '',
          align: 'center',
          width: 100,
          render: (h, params) => {
            const row = params.row
            let text = row.work_type_name
            return h('span', {}, text)
          },
        },
        {
          title: '权限组',
          align: 'center',
          key: 'group_names',
          minWidth: 150,
        },
        {
          title: '产品业务',
          align: 'center',
          key: 'product_names',
          minWidth: 150,
        },
        {
          title: '商家权限',
          align: 'center',
          key: 'shop_names',
          minWidth: 200,
        },
        {
          title: '区域权限',
          align: 'center',
          key: 'store_names',
          minWidth: 200,
        },
        {
          title: '订单信息',
          key: '',
          minWidth: 150,
          align: 'center',
          render: (h, params) => {
            const row = params.row
            let text = row.is_all_order ? '平台订单数据' : '普通订单数据'
            return h('span', {}, text)
          },
        },
        {
          title: '运营开关锁距离检测',
          key: '',
          align: 'center',
          minWidth: 165,
          render: (h, params) => {
            const row = params.row
            let is = row.open_check_distance
            return <span>{is ? is + 'm' : '-'}</span>
          },
        },
        {
          title: '状态',
          align: 'center',
          key: 'status',
          width: 80,
          // fixed: 'right',
          switch: true,
          disabled: false,
        },
        {
          title: '更新时间',
          key: 'update_time',
          width: 170,
        },
        {
          title: '创建时间',
          key: 'create_time',
          width: 170,
        },
        {
          title: '登录账号',
          minWidth: 120,
          align: 'center',
          render: (h, params) => {
            const row = params.row
            const text = row.username
            const copyId = 'table_cp_user'
            return (
              <div style={{ margin: '2px 0', 'font-size': '13px', 'text-align': 'left' }}>
                <div
                  style={{ cursor: 'pointer', margin: '0', color: '#19be6b' }}
                  data-clipboard-text={text}
                  class={copyId}
                  onClick={() => {
                    let clipboard = new Clipboard('.' + copyId)
                    this.$Message.info('已复制 ' + text)
                  }}
                >
                  {text}
                </div>
              </div>
            )
          },
        },
        {
          title: '登录密码',
          minWidth: 120,
          align: 'center',
          render: (h, params) => {
            const row = params.row
            const text = `${row.opassword || ''}`
            const copyId = 'table_cp_pw'
            return (
              <div style={{ margin: '2px 0', 'font-size': '13px', 'text-align': 'left' }}>
                <div
                  style={{ cursor: 'pointer', margin: '0', color: '#f20' }}
                  data-clipboard-text={text}
                  class={copyId}
                  onClick={() => {
                    let clipboard = new Clipboard('.' + copyId)
                    this.$Message.info('已复制 ' + text)
                  }}
                >
                  {text}
                </div>
              </div>
            )
          },
        },
        {
          title: '操作',
          align: 'center',
          width: 230,
          key: 'handle',
          fixed: 'right',
          handle: [
            (vm, h, currentRow, param) => {
              return (
                <Button type="success" size="small" onClick={this.logRecord.bind(this, currentRow)} style={{ margin: '4px 5px' }}>
                  操作日志
                </Button>
              )
            },
            'edit',
            'delete',
          ],
        },
      ],
    }
  },
  async created() {
    await this.loadFiltersFieldDrop('auth_type', 'type')
  },
  methods: {
    toAdd() {
      $utils.url.push({ name: 'auth_access_add', query: { action: 'add' } })
    },
    handleEdit(row) {
      $utils.url.push({ name: 'auth_access_edit', query: { action: 'edit', kv: row.suid } })
    },
    handleDel(row) {},
    logRecord(row) {
      console.log('logRecord', row)
      this.$Modal.info({
        title: '操作日志',
        width: '900px',
        render: (h) => {
          return <SysLogList style={{ margin: '0', color: '#19be6b' }} table_name={'auth_access'} table_key={row.suid}></SysLogList>
        },
      })
    },
  },
}
</script>
