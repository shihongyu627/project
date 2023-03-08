<script>
import baseList from "@/views/components/base/baseList.vue";
export default {
  extends: baseList,
  components: {},
  data() {
    return {
      table: {
        mname: "shopStoreFee",
        key: "id",
        url: {},
        output: false,
        order: "product_id desc, fee_type desc, create_time desc",
      },
      menus: [],
      actions: [
        {
          label: "新增",
          icon: "md-add",
          onClick: this.toAdd,
          auth: "/admin/shopstorefee/add",
        },
      ],
      query: {},
      filters: [],
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
          title: "车辆类型",
          minWidth: 120,
          key: "product_name",
        },
        {
          title: "计费规则",
          minWidth: 130,
          key: "fee_type_name",
        },
        {
          title: "时间范围",
          minWidth: 150,
          key: "type_value",
          align: "center",
          render: (h, params) => {
            const row = params.row;
            let rowArr = [];
            let rowArrs = [];
            if (row.fee_type == 2) {
              rowArr = row.type_value.split(",");
              rowArr.map((item, index) => {
                if (rowArr[index] == 1) {
                  rowArr[index] = "星期一";
                }
                if (rowArr[index] == 2) {
                  rowArr[index] = "星期二";
                }
                if (rowArr[index] == 3) {
                  rowArr[index] = "星期三";
                }
                if (rowArr[index] == 4) {
                  rowArr[index] = "星期四";
                }
                if (rowArr[index] == 5) {
                  rowArr[index] = "星期五";
                }
                if (rowArr[index] == 6) {
                  rowArr[index] = "星期六";
                }
                if (rowArr[index] == 7) {
                  rowArr[index] = "星期日";
                }
              });
              rowArr = rowArr.join(",");
            }
            if (row.fee_type == 4) {
              rowArr = row.type_value;
            }
            return h("div", [
              h(
                "div",
                {
                  style: {
                    margin: "0",
                    color: "#19be6b",
                  },
                },
                rowArr
              ),
            ]);
          },
        },
        {
          title: "预存款",
          minWidth: 100,
          key: "fee_recharge",
        },
        {
          title: "容错时长",
          minWidth: 100,
          align: "center",
          key: "min_free",
        },
        {
          title: "起步时长",
          minWidth: 100,
          align: "center",
          key: "min_base",
        },
        {
          title: "起步价",
          minWidth: 130,
          align: "center",
          key: "fee_base",
        },
        {
          title: "阶梯时长",
          minWidth: 120,
          align: "center",
          key: "min_next",
        },
        {
          title: "阶梯价",
          minWidth: 110,
          align: "center",
          key: "fee_next_min",
        },
        {
          title: "非定点还车调度费",
          minWidth: 120,
          align: "center",
          key: "fee_dispatch",
        },
        {
          title: "超区调度费",
          minWidth: 120,
          align: "center",
          key: "fee_dispatch_outrun",
        },
        { title: "创建时间", align: "center", key: "create_time", width: 170 },
        {
          title: "操作",
          align: "center",
          width: 150,
          key: "handle",
          handle: ["edit", "delete"],
          auth: {
            del: "/admin/shopstorefee/del",
            edit: "/admin/shopstorefee/edit",
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
        name: "shop_store_fee_add",
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
