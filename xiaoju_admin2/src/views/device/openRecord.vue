<script>
import dayjs from "dayjs";
import baseList from "@/views/components/base/baseList.vue";
import { Poptip, Button } from "view-design";
import RideRrack from "./rideRrack";
import RefundRecord from './refund'
export default {
  extends: baseList,
  components: { RideRrack,RefundRecord },
  data() {
    return {
      menu_name: "",
      table: {
        mname: "deviceOpenRecord",
        key: "id",
        url: {},
        output: false,
        order: "id desc",
      },
      menus: [
        {
          label: "开锁记录",
          name: "device_open_record_list",
          auth: "/admin/deviceopenrecord/lists",
        },
      ],
      actions: [],
      tactions: [
        {
          label: "导出数据",
          type: "success",
          onClick: this.exportData.bind(this, "车辆开关锁记录数据", 0),
          auth: "/admin/deviceopenrecord/lists",
        },
        {
          label: "导出全部数据",
          type: "error",
          onClick: this.exportData.bind(this, "车辆开关锁记录数据", 1),
          auth: "/admin/deviceopenrecord/lists",
        },
      ],
      query: {
        is_del: 0,
      },
      filters: [
        { label: "手机号", name: "user_mobile", value: "", type: "input" },
        { label: "车辆编号", name: "device_no", value: "", type: "input" },
        {
          label: "区域",
          name: "store_id",
          value: "",
          type: "select",
          dropList: [],
        },
        {
          label: "商家",
          name: "shop_id",
          value: "",
          type: "select",
          dropList: [],
          onChange: this.shopChange.bind(this),
        },
        {
          label: "车辆类型",
          name: "device_type",
          value: "",
          type: "select",
          dropList: [
            { value: 1, name: "单车常规款" },
            { value: 3, name: "单车智能款" },
            { value: 2, name: "电动车智能款" },
          ],
          noshow: "shop",
        },
        {
          label: "产品类型",
          name: "product_id",
          value: "",
          type: "select",
          dropList: [],
        },
        {
          label: "开锁状态",
          name: "lock_status",
          value: "",
          type: "select",
          dropList: [
            { value: 1, name: "已开锁" },
            { value: 2, name: "已关锁" },
            { value: 3, name: "临时锁车" },
          ],
          noshow: "shop",
        },
        {
          label: "开锁时间",
          name: "open_time",
          value: "",
          type: "datetimerange",
        },
      ],
      tableCols: [
        {
          type: "selection",
          width: 60,
        },
        { title: "ID", key: "id", width: 80, align: "center" },
        { title: "车辆编号", key: "device_no", width: 100, copy: true },
        { title: "车辆类型", key: "device_type_name", width: 110 },
        { title: "车辆型号", key: "product_name", minWidth: 120 },
        { title: "运营区域", key: "store_name", minWidth: 150 },
        { title: "开锁人姓名", key: "s_user_nick", minWidth: 120 },
        { title: "扫码手机号", key: "user_mobile", width: 140, copy: true },
        { title: "开锁时间", align: "left", key: "open_time", width: 170 },
        { title: "关锁时间", align: "left", key: "close_time", width: 170 },
        {
          title: "骑行轨迹",
          minWidth: 250,
          align: "center",
          render: (h, params) => {
            const row = params.row;
            const l1 = `开锁经纬度: ${row.open_lnglat || ""}`;
            const l2 = `开锁地址: ${row.open_address || ""}`;
            const l3 = `关锁经纬度: ${row.close_lnglat || ""}`;
            const l4 = `关锁地址: ${row.close_address || ""}`;
            return (
              <div
                onClick={() => this.toMap(row)}
                style={{
                  cursor: "pointer",
                  margin: "4px 0",
                  "font-size": "12px",
                  "text-align": "left",
                }}
              >
                <div style={{ margin: "0", color: "#19be6b" }}>{l1}</div>
                <div style={{ margin: "0", color: "#ff9900" }}>{l2}</div>
                <div style={{ margin: "0", color: "#ff2200" }}>{l3}</div>
                <div style={{ margin: "0", color: "#324563" }}>{l4}</div>
              </div>
            );
          },
        },
        // { title: '开锁地址', align: 'left', key: 'open_address', width: 170 },
        // { title: '关锁地址', align: 'left', key: 'close_address', width: 170 },
        { title: "关锁人姓名", key: "close_s_user_nick", minWidth: 120 },
        {
          title: "关锁手机号",
          key: "close_user_mobile",
          width: 140,
          copy: true,
        },
        // { title: "临时锁车类型", align: "left", key: "pause_type", width: 120 },
        // { title: "临时锁车时间", align: "left", key: "pause_time", width: 170 },
        // {
        //   title: "临时锁车地址",
        //   align: "left",
        //   key: "pause_address",
        //   width: 170,
        // },
        { title: "备注", align: "left", key: "remark", minWidth: 170 },
        { title: "状态", align: "left", key: "lock_status_name", fixed: "right", width: 130,
          render: (h, params) => {
            const row = params.row
            let color = ''
            let status = ''
            let text = row.lock_status_name
            if (row.lock_status == 1) {
              color = 'success'
              status = 'success'
            }
            if (row.lock_status == 2) {
              color = 'default'
              status = 'default'
            }
            if (row.status == 3) {
              color = 'warning'
              status = 'warning'
            }
            return h(
              'Tag',
              {
                props: {
                  type: 'dot',
                  text: text,
                  color: color,
                  status: status,
                },
              },
              text
            )
          },
        },
        { title: "创建时间", align: "center", key: "create_time", width: 170 },
        {
          title: "操作",
          align: "center",
          width: 150,
          key: "handle",
          fixed: "right",
          handle: [
          (vm, h, currentRow, param) => {
              // let directives = [{ name: 'auth', value: '/admin/device/edit' }]
              return (
                <Button type="success" size="small" onClick={() => this.lookRecord(currentRow)}  style={{ margin: '4px 5px' }}>
                  详情
                </Button>
              )
            },
            "delete",
          ],
          auth: {
            del: "/admin/deviceopenrecord/del",
          },
        },
      ],
    };
  },
  async created() {
    let query = this.$route.query;
    await this.loadFiltersFieldDrop("product", "product_id");
    await this.loadFiltersFieldDrop("shop", "shop_id");
    if (query.product_id) {
      // 设置查询参数
      this.product_id = query.product_id;
      this.query.product_id = query.product_id;
    }
    if (query.shop_id) {
      // 设置查询参数
      this.shop_id = query.shop_id;
      this.query.shop_id = query.shop_id;
    }
    if (query.store_id) {
      // 设置查询参数
      this.store_id = query.store_id;
      this.query.store_id = query.store_id;
    }
    console.log("query", this.query);
  },
  methods: {
    lookRecord(row) {
      console.log(row)
      // $utils.url.push({ name: 'order_refund', query: { order_id: row.order_id } })
      let vvvv = ''
      let aaaa = ''
      this.$Modal.info({
        title: '开锁记录',
        width: '900px',
        render: (h) => {
          return <RefundRecord style={{ margin: '0', color: '#19be6b' }} open_id={row.id}></RefundRecord>
        },
      })
    },
    toMap(row) {
      // 弹窗处理
      this.$Modal.info({
        title: "骑行轨迹",
        width: 720,
        render: (h) => {
          return (
            <RideRrack
              s_lnglat={row.open_lnglat}
              e_lnglat={row.close_lnglat}
              device_id={row.device_id}
              order_id={row.order_id}
              store_id={row.store_id}
              amap_trid={row.amap_trid}
              style={{ margin: "0", color: "#19be6b" }}
            ></RideRrack>
          );
        },
      });
    },
    // 商家选择改变-设置区域下拉列表
    shopChange(val) {
      console.log(val);
      this.loadFiltersFieldDrop("shop_store", "store_id", { shop_id: val });
    },
  },
};
</script>
