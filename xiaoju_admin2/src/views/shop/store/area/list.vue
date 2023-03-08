<script>
import baseList from "@/views/components/base/baseList.vue";
export default {
  extends: baseList,
  components: {},
  data() {
    return {
      table: {
        mname: "shopStoreArea",
        key: "id",
        url: {},
        output: false,
        order: " status desc, type asc, sort asc, create_time desc",
      },
      menus: [],
      actions: [
        {
          label: "新增围栏区域",
          icon: "md-add",
          onClick: this.toAdd,
          auth: "/admin/shopstorearea/add",
        },
      ],
      query: {},
      filters: [
         { label: '区域名', name: 'name', value: '', type: 'input' },
         {label: '类型', name: 'type', value: 1, type: 'select', dropList:[
                    {value: '1', name: '骑行区域'},
                    {value: '2', name: '停车区域'},
                ]},
      ],
      tableCols: [
        {
          title: "商家名称",
          minWidth: 120,
          key: "shop_name",
        },
        {
          title: "区域名称",
          minWidth: 120,
          key: "store_name",
        },
        {
          title: "类型",
          minWidth: 120,
          key: "type_name",
        },
        {
          title: "名称",
          minWidth: 130,
          key: "name",
        },
        {title: '状态', align: 'center', key: 'status', width: 80, switch: true, disabled: false},
        {title: '排序', align: 'center', key: 'sort', width: 90, editable: true},
        { title: "创建时间", align: "center", key: "create_time", width: 170 },
        {
          title: "操作",
          align: "center",
          width: 150,
          key: "handle",
          handle: ["edit", "delete"],
          auth: {
            del: "/admin/shopstorearea/del",
            edit: "/admin/shopstorearea/edit",
          },
        },
      ],
    };
  },
  created() {
    let query = this.$route.query;
    this.title = query.title;
    // 设置查询参数
    this.query.store_id = query.store_id;
  },
  methods: {
    toAdd() {
      $utils.url.push({
        name: "shop_store_area_add",
        query: {
          action: "add",
          title: this.title,
          store_id: this.query.store_id,
        },
      });
    },
  },
};
</script>
