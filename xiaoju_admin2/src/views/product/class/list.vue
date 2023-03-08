<script>
import baseList from "@/views/components/base/baseList.vue";
import { Button } from "view-design";
export default {
  extends: baseList,
  components: {},
  data() {
    return {
      menu_name: "",
      currentRow: null,
      table: {
        mname: "productClass",
        key: "class_id",
        url: {},
        output: false,
        stripe: false,
        rowClassName: () => {},
        order: "sort asc",
      },
      menus: [
        { label: "车辆列表", name: "device_list", auth: "/admin/device/lists" },
        { label: "产品列表", name: "product_list", auth: "/admin/product/lists" },
        // { label: "产品分类", name: "product_class_list", auth: "/admin/productclass/lists" },
        { label: '操作记录', name: 'msg_list', auth: '/admin/msg/lists' },
      ],
      actions: [{ label: "新增", icon: "md-add", onClick: this.toAdd, auth: "/admin/productclass/add" }],
      query: {
        pid: 0,
      },
      filters: [{ label: "标题", name: "name", value: "", type: "input" }],
      tableCols: [
        {
          title: "ID",
          key: "class_id",
          width: 80,
          align: "center",
          render: (h, params) => {
            const row = params.row;
            if (row.pid === 0) {
              text = row.class_id;
            } else {
              return "";
            }
            return h(
              "span",
              {
                style: {
                  "font-size": "14px",
                },
              },
              text
            );
          },
        },
        {
          title: "标题",
          key: "name",
          minWidth: 160,
          render: (h, params) => {
            const row = params.row;
            if (row.pid === 0) {
              text = row.name;
            } else {
              text = " ---- " + row.name;
            }
            return h(
              "span",
              {
                style: {
                  "font-size": "14px",
                },
              },
              text
            );
          },
        },
        {
          title: "父级",
          key: "pid",
          minWidth: 120,
          render: (h, params) => {
            const row = params.row;
            let text = row.pid_name || "";
            if (row.pid === 0) {
              text = "主分类";
            }
            return h(
              "span",
              {
                style: {
                  "font-size": "14px",
                },
              },
              text
            );
          },
        },
        { title: "图标", key: "icon", minWidth: 120, align: "center", viewimage: true },
        { title: "显示", align: "center", key: "status", minWidth: 80, switch: true, disabled: false },
        { title: "排序", align: "center", sortable: "custom", key: "sort", width: 100, editable: true },
        { title: "创建时间", align: "center", key: "create_time", width: 180 },
        {
          title: "操作",
          align: "center",
          minWidth: 190,
          key: "handle",
          handle: [
            (vm, h, currentRow, param) => {
              this.currentRow = currentRow;
              let directives = [{ name: "auth", value: "/admin/productclass/spec" }];
              return currentRow.pid !== 0 ? (
                <Button {...{ directives }} size="small" onClick={this.toSpec.bind(currentRow)} type="warning" style={{ margin: "4px 5px" }}>
                  规格
                </Button>
              ) : (
                <span style={{ width: "44px", margin: "4px 5px", display: "inline-block" }}></span>
              );
              // h('Button', {
              //     props: {
              //         size: 'small',
              //         type: 'warning',
              //     },
              //     // 自定义指令
              //     directives: [
              //         {
              //             name: 'auth',
              //             value: '/admin/productclass/spec'
              //         }
              //     ],
              //     style: {
              //         margin: '4px 5px'
              //     },
              //     on: {
              //         'click': () => {
              //             this.toSpec(currentRow)
              //         }
              //     }
              // }, '规格'):
              // h('span', {
              //     style: {
              //         width: '44px',
              //         margin: '4px 5px',
              //         display: 'inline-block'
              //     },
              // }, '')
            },
            "edit",
            "delete",
          ],
        },
      ],
    };
  },
  created() {},
  methods: {
    rowClassName(row, index) {
      if (row.pid === 0) {
        return "demo-table-info-row";
      }
      return "";
    },
    toSpec(row) {
      let title = row.pid_name + " - " + row.name;
      let class_id = row.class_id;
      let pid = row.pid;
      $utils.url.push({ name: "product_class_spec", query: { class_id: class_id, pid: pid, title: title } });
    },
  },
};
</script>
<style>
.ivu-table .demo-table-info-row td {
  background-color: #f8f8f9;
}
</style>
