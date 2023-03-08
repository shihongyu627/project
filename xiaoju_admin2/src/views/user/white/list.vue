<script>
import baseList from "@/views/components/base/baseList.vue";
export default {
  extends: baseList,
  components: {},
  data() {
    return {
      menu_name: "",
      table: {
        mname: "userWhite",
        key: "id",
        url: {},
        output: false,
      },
      menus: [
        { label: "运营人员", name: "operator_list", auth: "/admin/operator/lists" },
        { label: "白名单", name: "user_white_list", auth: "/admin/userwhite/lists" },
        { label: "黑名单", name: "user_black_list", auth: "/admin/userblack/lists" },
      ],
      actions: [{ label: "新增", icon: "md-add", onClick: this.toAdd, auth: "/admin/userwhite/add" }],
      tactions: [
        { label: '导出数据', type: 'success', onClick: this.exportData.bind(this, '白名单人员数据', 0), auth: '/admin/userwhite/lists' },
        { label: '导出全部数据', type: 'error', onClick: this.exportData.bind(this, '白名单人员数据', 1), auth: '/admin/userwhite/lists' },
      ],
      query: {},
      filters: [
        { label: "手机号", name: "use_mobile", value: "", type: "input" },
        { label: "名称", name: "title", value: "", type: "input" },
      ],
      tableCols: [
        {
          type: 'selection',
          width: 60,
        },
        { title: "ID", key: "id", width: 80, align: "center" },
        { title: "名称", key: "title", minWidth: 120 },
        { title: "使用手机号", key: "use_mobile", minWidth: 150 },
        {
          title: "是否全部可用",
          minWidth: 130,
          align: "center",
          render: (h, params) => {
            const row = params.row;
            const text = row.is_all == 1 ? "是" : "";
            return <div>{text}</div>;
          },
        },
        { title: "可用商家", key: "shop_names", minWidth: 150 },
        { title: "可用区域", key: "store_names", minWidth: 150 },
        { title: "创建时间", align: "center", key: "create_time", width: 170 },
        { title: "状态", align: "center", key: "status", width: 80, switch: true,fixed: 'right', disabled: false },
        { title: "操作", align: "center", minWidth: 150, key: "handle", fixed: 'right', handle: ["edit", "delete"] },
      ],
    };
  },
  created() {},
  methods: {},
};
</script>
