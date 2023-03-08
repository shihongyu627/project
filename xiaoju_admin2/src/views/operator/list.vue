<script>
import baseList from '@/views/components/base/baseList.vue'
import { Button } from 'view-design'
import Clipboard from 'clipboard'
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
        { label: '运营人员', name: 'operator_list', auth: '/admin/operator/lists' },
        { label: '白名单', name: 'user_white_list', auth: '/admin/userwhite/lists' },
        { label: '黑名单', name: 'user_black_list', auth: '/admin/userblack/lists' },
      ],
      actions: [{ label: '新增', icon: 'md-add', onClick: this.toAdd, auth: '/admin/operator/add' }],
      tactions: [
        { label: '导出数据', type: 'success', onClick: this.exportData.bind(this, '运营人员数据', 0), auth: '/admin/operator/lists' },
        { label: '导出全部数据', type: 'error', onClick: this.exportData.bind(this, '运营人员数据', 1), auth: '/admin/operator/lists' },
      ],
      query: {
        type_type: 5,
      },
      filters: [
        { label: '姓名', name: 'name', value: '', type: 'input' },
        { label: '手机号', name: 'user_mobile', value: '', type: 'input' },
      ],
      tableCols: [
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
          key: '',
          width: 140,
          render: (h, params) => {
            const row = params.row
            let text = row.user_mobile
            return h('span', {}, text)
          },
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
          title: '操作',
          align: 'center',
          width: 150,
          key: 'handle',
          fixed: 'right',
          handle: ['edit', 'delete'],
          auth: {
            del: '/admin/operator/del',
            edit: '/admin/operator/edit',
          },
        },
      ],
    }
  },
  created() {},
  methods: {
    search() {
      this.$refs.tablelist.init()
    },
    toAdd() {
      $utils.url.push({ name: 'auth_access_add', query: { action: 'add', type: 5 } })
    },
    handleEdit(row) {
      $utils.url.push({ name: 'auth_access_edit', query: { action: 'edit', kv: row.suid } })
    },
    handleDel(row) {},
  },
}
</script>
