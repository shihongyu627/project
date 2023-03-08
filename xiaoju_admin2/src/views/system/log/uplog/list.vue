<script>
import baseList from '@/views/components/base/baseList.vue'
import Vue from 'vue'
import { Poptip, Button } from 'view-design'

export default {
  extends: baseList,
  components: {},
  props: {
    table_name: {
      type: String,
      default: '',
    },
    table_key: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      table: {
        mname: 'sysUpLog',
        key: 'id',
        url: {},
        output: false,
        order: 'create_time desc',
      },
      menus: [],
      actions: [],
      query: {},
      tableCols: [
        {
          title: '操作时间',
          width: 170,
          align: 'center',
          minWidth: 120,
          key: 'create_time',
        },
        {
          title: '操作名称',
          width: 120,
          key: 'action_name',
          align: 'center',
        },
        {
          title: '操作用户',
          width: 110,
          key: 's_name',
          align: 'center',
        },
        // {
        //   title: '原始数据',
        //   minWidth: 180,
        //   align: 'left',
        //   key: 'from_text',
        // },
        {
          title: '更新数据',
          align: 'left',
          minWidth: 180,
          key: 'to_text',
        },
      ],
    }
  },
  created() {
    if (this.table_name && this.table_key) {
      // 设置查询参数
      this.query.table_name = this.table_name
      this.query.table_key = this.table_key
    }
  },
  mounted() {},
  methods: {},
}
</script>
