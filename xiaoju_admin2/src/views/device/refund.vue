<script>
import baseList from '@/views/components/base/baseList.vue'

export default {
  extends: baseList,
  components: {},
  props: {
    open_id: {
      type: String,
      value: '',
    },
  },
  data() {
    return {
      table: {
        mname: 'OpenRefund',
        key: 'open_id',
        url: {},
        output: false,
        order: 'create_time asc',
      },
      menus: [],
      actions: [],
      query: {},
      tableCols: [
        {
          title: '序号',
          minWidth: 100,
          key: 'id',
          align: 'center',
          copy: true,
        },
        {
          title: '操作动作',
          minWidth: 80,
          key: 'scene_name',
          align: 'center',
          copy: true,
        },
        {
          title: '操作时间',
          width: 180,
          align: 'center',
          key: 'time',
        },
        {
          title: '操作人姓名',
          align: 'center',
          key: 's_user_nick',
          width: 120,
        },
        {
          title: '操作人手机号',
          align: 'center',
          width: 140,
          key: 'user_mobile',
        },
        {
          title: '触发场景',
          minWidth: 250,
          align: 'center',
          minWidth: 120,
          key: 'action_type_name',
        },
      ],
    }
  },
  created() {
    let query = this.$route && this.$route.query
    if ((query && query.open_id) || this.open_id) {
      // 设置查询参数
      this.query.open_id = (query && query.open_id) || this.open_id
    }
  },
  mounted() {},
  methods: {},
}
</script>
