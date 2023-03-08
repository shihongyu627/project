<script>
import baseList from '@/views/components/base/baseList.vue'
export default {
  extends: baseList,
  components: {},
  data() {
    return {
      table: {
        mname: 'authType',
        key: 'type_id',
        url: {},
        output: false,
        stripe: false,
        rowClassName: () => {},
        order: 'sort asc',
      },
      menus: [
        { label: '用户权限', name: 'auth_access_list', auth: '/admin/authaccess/lists' },
        { label: '角色权限', name: 'auth_group_list', auth: '/admin/authgroup/lists' },
        { label: '账户类型', name: 'auth_type_list', auth: '/admin/authtype/lists' },
      ],
      actions: [{ label: '新增', icon: 'md-add', onClick: this.toAdd, auth: '/admin/authtype/add' }],
      query: {
        pid: 0,
      },
      filters: [{ label: '标题', name: 'name', value: '', type: 'input' }],
      tableCols: [
        { title: 'ID', key: 'type_id', width: 80, align: 'center' },
        {
          title: '类型标题',
          key: 'name',
          minWidth: 160,
          render: (h, params) => {
            const row = params.row
            if (row.pid === 0) {
              text = <div>{row.name}</div>
            } else {
              if (row.pid_level) {
                if (row.pid_level == 1) {
                  text = <div style="margin-left: 10px">{'∟' + row.name}</div>
                }
                if (row.pid_level == 2) {
                  text = <div style="margin-left: 25px">{'∟' + row.name}</div>
                }
                if (row.pid_level == 3) {
                  text = <div style="margin-left: 40px">{'∟' + row.name}</div>
                }
              } else {
                text = <div style="margin-left: 10px">{row.name}</div>
              }
            }
            return text
          },
        },
        // {title: '父级', key: 'pid', minWidth: 100,
        //     render: (h, params) => {
        //         const row = params.row;
        //         let text = row.pid_name || ''
        //         if(row.pid === 0) {
        //             text = '主类型'
        //         }
        //         return h('span', {
        //             style: {
        //                 'font-size': '14px'
        //             }
        //         }, text);
        //     }
        // },
        { title: '图标', key: 'icon', minWidth: 100, align: 'center', viewimage: true },
        // {title: '图示', key: 'image', minWidth: 100, align: 'center', viewimage: true },
        { title: '显示', align: 'center', key: 'status', minWidth: 80, switch: true, disabled: false },
        { title: '排序', align: 'center', sortable: 'custom', key: 'sort', width: 90, editable: true },
        { title: '创建时间', align: 'center', key: 'create_time', width: 170 },
        {
          title: '操作',
          align: 'center',
          minWidth: 150,
          key: 'handle',
          handle: ['edit', 'delete'],
          auth: {
            edit: '/admin/authtype/edit',
            delete: '/admin/authtype/del',
          },
        },
      ],
    }
  },
  created() {},
  methods: {
    rowClassName(row, index) {
      if (row.pid === 0) {
        return 'demo-table-info-row'
      }
      return ''
    },
  },
}
</script>
<style>
.ivu-table .demo-table-info-row td {
  background-color: #f8f8f9;
}
</style>
