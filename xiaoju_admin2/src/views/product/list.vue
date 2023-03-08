<script>
import baseList from "@/views/components/base/baseList.vue";
import { Button } from "view-design";
export default {
  extends: baseList,
  components: {},
  data() {
    return {
      table: {
        mname: "product",
        key: "product_id",
        url: {},
        output: false,
      },
      menus: [
        { label: "车辆列表", name: "device_list", auth: "/admin/device/lists" },
        { label: "产品列表", name: "product_list", auth: "/admin/product/lists" },
        // { label: "产品分类", name: "product_class_list", auth: "/admin/productclass/lists" },
        { label: '操作记录', name: 'msg_list', auth: '/admin/msg/lists' },
      ],
      currentRow:null,
      actions: [{ label: "新增", icon: "md-add", onClick: this.toAdd, auth: "/admin/product/add" }],
      query: {},
      filters: [{ label: "产品名称", name: "name", value: "", type: "input" }],
      tableCols: [
        // {
        //     title: 'ID',
        //     key: 'shop_id',
        //     width: 80,
        //     align: 'center',
        //     sortable: 'custom'
        // },
        {
          title: "产品名称",
          minWidth: 100,
          key: "name",
        },
        {
          title: "产品图片",
          key: "image",
          width: 120,
          align: "center",
          viewimage: true,
        },
        {
          title: "产品分类",
          key: "class_id",
          minWidth: 100,
          align: "center",
          render: (h, params) => {
            const row = params.row;
            const text = row.class_name;
            return <span style={{ "font-size": "14px" }}>{text}</span>;
          },
        },
        {
          title: "产品类型",
          key: "type",
          minWidth: 100,
          align: "center",
          render: (h, params) => {
            const row = params.row;
            const text = row.type_name;
            return <span style={{ "font-size": "14px" }}>{text}</span>;
          },
        },
        {
          title: "品牌",
          minWidth: 140,
          align: "center",
          key: "brand",
        },
        {
          title: "单车数",
          minWidth: 100,
          align: "center",
          key: "device_count",
        },
        {
          title: "联系人",
          minWidth: 180,
          align: "center",
          render: (h, params) => {
            const row = params.row;
            const l1 = `联系人: ${row.linkman_name || ""}`;
            const l2 = `联系电话: ${row.linkman_mobile || ""}`;
            return (
              <div style={{ margin: "2px 0", "font-size": "13px", "text-align": "left" }}>
                <div style={{ margin: "0", color: "#19be6b" }}>{l1}</div>
                <div style={{ margin: "0", color: "#ff9900" }}>{l2}</div>
              </div>
            );
          },
        },
        {
            title: '状态',
            align: 'center',
            key: 'status',
            width: 80,
            switch: true,
            disabled: true
        },
        {
          title: "创建时间",
          align: "center",
          key: "create_time",
          width: 170,
        },
        {
          title: "操作",
          align: "center",
          minWidth: 200,
          key: "handle",
          fixed: 'right',
          handle: [
            (vm, h, currentRow, param) => {
              let directives = [{ name: "auth", value: "/admin/device/lists" }];
              this.currentRow=currentRow
              return (
                <Button {...{ directives }} size="small" onClick={()=>this.toDevice(currentRow)} type="warning" style={{ margin: "4px 5px" }}>
                  车辆
                </Button>
              );
            },
            "edit",
            // "delete",
          ],
        },
      ],
    };
  },
  created() {},
  methods: {
    toDevice(row) {
      let product_id = row.product_id;
      $utils.url.push({ name: "device_list", query: { product_id: row.product_id } });
    },
  },
};
</script>
