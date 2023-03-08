<script>
import baseList from '@/views/components/base/baseList.vue'
import { Poptip, Button } from 'view-design'
import SysLogList from '../../log/uplog/list.vue'
export default {
  extends: baseList,
  components: {},
  data() {
    return {
      table: {
        mname: 'authGroup',
        key: 'id',
        url: {},
      },
      menus: [
        { label: '用户权限', name: 'auth_access_list', auth: '/admin/authaccess/lists' },
        { label: '角色权限', name: 'auth_group_list', auth: '/admin/authgroup/lists' },
        { label: '账户类型', name: 'auth_type_list', auth: '/admin/authtype/lists' },
      ],
      actions: [{ label: '新增', icon: 'md-add', onClick: this.toAdd, auth: '/admin/authgroup/add' }],
      tactions: [],
      query: {},
      filters: [{ label: '权限组名', name: 'name', value: '', type: 'input' }],
      tableCols: [
        {
          title: 'ID',
          key: 'id',
          width: 80,
          align: 'center',
        },
        {
          title: '名称',
          key: 'name',
          minWidth: 100,
        },
        {
          title: '管理权限',
          key: '',
          align: 'center',
          minWidth: 120,
          render: (h, params) => {
            const row = params.row
            let is = row.rules
            return <span>{is ? '✓' : '-'}</span>
          },
        },
        {
          title: '运营权限',
          key: '',
          align: 'center',
          minWidth: 120,
          render: (h, params) => {
            const row = params.row
            let is = row.rules_devops
            return <span>{is ? '✓' : '-'}</span>
          },
        },
        {
          title: '运营开锁限制',
          key: '',
          align: 'center',
          minWidth: 120,
          render: (h, params) => {
            const row = params.row
            let is = row.openlock_max_count
            return <span>{is ? is : '-'}</span>
          },
        },
        {
          title: '状态',
          align: 'center',
          key: 'status',
          width: 100,
          switch: true,
          disabled: false,
        },
        {
          title: '更新时间',
          key: 'update_time',
          width: 170,
        },
        {
          title: '操作',
          align: 'center',
          width: 230,
          key: 'handle',
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
  methods: {
    toAdd() {
      $utils.url.push({ name: 'auth_group_add', query: { action: 'add' } })
    },
    handleEdit(row) {
      $utils.url.push({ name: 'auth_group_edit', query: { action: 'edit', kv: row.id } })
    },
    handleDel(row) {},
    logRecord(row) {
      console.log('logRecord', row)
      this.$Modal.info({
        title: '操作日志',
        width: '900px',
        render: (h) => {
          return <SysLogList style={{ margin: '0', color: '#19be6b' }} table_name={'auth_group'} table_key={row.id}></SysLogList>
        },
      })
    },
  },
}
</script>
