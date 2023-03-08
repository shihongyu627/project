<script>
import baseEdit from '@/views/components/base/baseEdit.vue'
export default {
  extends: baseEdit,
  components: {},
  data() {
    return {
      mname: 'shopStoreArea',
      items: [
        { label: '区域信息', desc: '区域的基本信息', type: 'header' },
        {label: '类型', name: 'type', value: '', type: 'select',  dropList:[
                    {value: 1, name: '骑行区域'},
                    {value: 2, name: '停车区域'},
                    // {value: 3, name: '禁停区域'},
                ], rules: [{ required: true, trigger: 'blur', type: 'number' }]},
        { label: '名称', name: 'name', value: '', type: 'input', rules: [{ required: true, trigger: 'blur' }] },
        { label: '区域', name: 'points', value: '', type: 'maparea', rules: [{ required: true, trigger: 'blur' }] },
        { label: '排序', name: 'sort', value: 50, type: 'number', rules: [{ required: true, trigger: 'blur', type: 'number' }] },
        { label: '备注', name: 'remark', value: '', type: 'textarea' },
      ],
      forms: {},
    }
  },
  created() {
    let query = this.$route.query;
    this.action = query.action;
    this.forms.store_id = query.store_id;
    if (query.action === "add") {
      // 添加初始化
    } else if (query.action === "edit") {
      this.kv = query.kv;
      this.initData();
    } else {
      $utils.toast.error("请求方式异常");
    }
  },
  methods: {},
}
</script>
