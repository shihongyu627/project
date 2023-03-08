<script>
import baseList from '@/views/components/base/baseList.vue'
export default {
  extends: baseList,
  components: {},
  data() {
    return {
      table: {
        mname: 'help',
        key: 'id',
        url: {},
        output: false,
        order: 'is_top desc, status desc, sort asc, create_time desc',
      },
      recharge_money: 0,
      recharge_content: '',
      menus: [
        { label: '帮助列表', name: 'help_list', auth: '/admin/help/lists' },
        { label: '帮助分类', name: 'help_class_list', auth: '/admin/helpclass/lists' },
        { label: '关于内容', name: 'help_about', auth: '/admin/help/lists' },
        { label: '文章内容', name: 'help_article', auth: '/admin/help/lists' },
      ],
      actions: [],
      query: {
        type: 9,
      },
      filters: [{ label: '文章标题', name: 'title', value: '', type: 'input' }],
      tableCols: [
        { title: 'ID', key: 'id', width: 80, align: 'center' },
        { title: '标题', key: 'title', minWidth: 150 },
        { title: 'KEY值', key: 'key', minWidth: 170 },
        { title: '简介', key: 'content', minWidth: 140 },
        { title: '显示', align: 'center', key: 'status', width: 80, switch: true, disabled: true },
        { title: '排序', align: 'center', key: 'sort', width: 90, editable: false },
        { title: '创建时间', align: 'center', key: 'create_time', width: 170 },
        {
          title: '操作',
          align: 'center',
          minWidth: 130,
          key: 'handle',
          fixed: 'right',
          handle: ['edit'],
          auth: {
            edit: '/admin/help/edit',
          },
        },
      ],
    }
  },
  created() {},
  methods: {},
}
</script>
