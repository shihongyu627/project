<script>
import baseList from '@/views/components/base/baseList.vue'
export default {
  extends: baseList,
  components: {},
  data() {
    return {
      table: {
        mname: 'shopStoreTime',
        key: 'id',
        url: {},
        output: false,
        order: 'product_id desc, time_type desc, create_time desc',
      },
      menus: [],
      actions: [
        {
          label: '新增',
          icon: 'md-add',
          onClick: this.toAdd,
          auth: '/admin/shopstoretime/add',
        },
      ],
      query: {},
      filters: [],
      tableCols: [
        {
          title: '商家名称',
          minWidth: 120,
          key: 'shop_name',
        },
        {
          title: '区域名称',
          minWidth: 120,
          key: 'store_name',
        },
        {
          title: '车辆类型',
          minWidth: 120,
          key: 'product_name',
        },
        {
          title: '类型',
          minWidth: 120,
          key: 'type_name',
        },
        {
          title: '营运规则',
          minWidth: 130,
          key: 'time_type_name',
        },
        {
          title: '时间范围',
          minWidth: 150,
          key: 'type_value',
          align: 'center',
          render: (h, params) => {
            const row = params.row
            let rowArr = []
            let rowArrs = []
            if (row.time_type == 2) {
              rowArr = row.type_value.split(',')
              rowArr.map((item, index) => {
                if (rowArr[index] == 1) {
                  rowArr[index] = '星期一'
                }
                if (rowArr[index] == 2) {
                  rowArr[index] = '星期二'
                }
                if (rowArr[index] == 3) {
                  rowArr[index] = '星期三'
                }
                if (rowArr[index] == 4) {
                  rowArr[index] = '星期四'
                }
                if (rowArr[index] == 5) {
                  rowArr[index] = '星期五'
                }
                if (rowArr[index] == 6) {
                  rowArr[index] = '星期六'
                }
                if (rowArr[index] == 7) {
                  rowArr[index] = '星期日'
                }
              })
              rowArr = rowArr.join(',')
            }
            if (row.time_type == 4) {
              rowArr = row.type_value
            }
            return h('div', [
              h(
                'div',
                {
                  style: {
                    margin: '0',
                    color: '#19be6b',
                  },
                },
                rowArr
              ),
            ])
          },
        },
        {
          title: '起止时间',
          key: 'start_time',
          minWidth: 200,
          render: (h, params) => {
            const row = params.row
            const text = row.start_time + ' - ' + row.end_time
            return <span style={{ 'font-size': '14px' }}>{text}</span>
          },
        },
        { title: '创建时间', align: 'center', key: 'create_time', width: 170 },
        {
          title: '操作',
          align: 'center',
          width: 150,
          key: 'handle',
          handle: ['edit', 'delete'],
          auth: {
            del: '/admin/shopstoretime/del',
            edit: '/admin/shopstoretime/edit',
          },
        },
      ],
    }
  },
  created() {
    let query = this.$route.query
    this.title = query.title
    // 设置查询参数
    this.query.store_id = query.store_id
  },
  methods: {
    toAdd() {
      $utils.url.push({
        name: 'shop_store_time_add',
        query: {
          action: 'add',
          title: this.title,
          store_id: this.query.store_id,
        },
      })
    },
  },
}
</script>
