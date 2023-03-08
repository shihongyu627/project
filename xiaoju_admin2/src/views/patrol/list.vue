<script>
import baseList from '@/views/components/base/baseList.vue'
import { Tag, Button } from 'view-design'
import Vue from 'vue'
import Info from './info.vue'
export default {
  extends: baseList,
  components: {
    info: Info,
  },
  data() {
    return {
      table: {
        mname: 'patrol',
        key: 'id',
        url: {},
        output: false,
      },
      content: '',
      row: '',
      actions: [],
      query: {},
      filters: [
        {
          label: '故障部件',
          name: 'title',
          value: '',
          type: 'select',
          dropList: [
            { value: '车把手', name: '车把手' },
            { value: '刹车', name: '刹车' },
            { value: '方向盘', name: '方向盘' },
            { value: '轮胎', name: '轮胎' },
            { value: '脚踏板', name: '脚踏板' },
            { value: '链条', name: '链条' },
            { value: '电池', name: '电池' },
            { value: '车座', name: '车座' },
            { value: '车锁', name: '车锁' },
            { value: '二维码', name: '二维码' },
            { value: '按钮', name: '按钮' },
            { value: '外观', name: '外观' },
            { value: '其它', name: '其它' },
          ],
        },
        { label: '巡检内容', name: 'content', value: '', type: 'input' },
        { label: '车辆编号', name: 'device_no', value: '', type: 'input' },
      ],
      tactions: [
        { label: '导出数据', type: 'success', onClick: this.exportData.bind(this, '巡检记录', 0), auth: '/admin/patrol/lists' },
        { label: '导出全部数据', type: 'error', onClick: this.exportData.bind(this, '巡检记录', 1), auth: '/admin/patrol/lists' },
      ],
      reply_content: '',
      tableCols: [
        {
          type: 'selection',
          width: 60,
        },
        {
            title: 'ID',
            key: 'id',
            width: 80,
            align: 'center',
            // sortable: 'custom'
        },
        {
          title: '巡检部位',
          key: 'title',
          minWidth: 150,
          render: (h, params) => {
            const row = params.row
            const text = row.title || ''
            const t_arr = text.split(',') || []
            return t_arr.map((item) => <Tag color="red">{item}</Tag>)
          },
        },
        {
          title: '巡检内容',
          key: 'content',
          minWidth: 150,
          render: (h, params) => {
            const row = params.row
            const text = row.content
            return <span style={{ 'font-size': '14px' }}>{text}</span>
          },
        },
        {
          title: '巡检地点',
          minWidth: 120,
          key: 'address_info',
          render: (h, params) => {
            const row = params.row
            const text = row.address_info
            return <span style={{ 'font-size': '14px' }}>{text}</span>
          },
        },
        {
          title: '截图',
          key: 'gallery',
          minWidth: 120,
          align: 'center',
          viewimages: true,
        },
        // {
        //     title: '设备号',
        //     minWidth: 100,
        //     key: 'device',
        //     render: (h, params) => {
        //         const row = params.row;
        //         const text = row.device && row.device.imei
        //         return h('span', {
        //             style: {
        //                 'font-size': '14px'
        //             }
        //         }, text);
        //     }
        // },
        {
          title: '车辆编号',
          minWidth: 120,
          align: 'center',
          key: 'device_no',
          copy: true,
        },
        {
          title: '车辆二维码',
          key: 'qrcode_img',
          width: 120,
          align: 'center',
          viewimage: true,
        },
        {
          title: '提交者',
          key: 'user',
          align: 'center',
          width: 120,
          render: (h, params) => {
            const row = params.row
            const text = row.user && row.user.user_nick
            return <span style={{ 'font-size': '14px' }}>{text}</span>
          },
        },
        {
          title: '提交时间',
          align: 'center',
          key: 'create_time',
          width: 170,
        },
        {
          title: '操作',
          align: 'center',
          width: 150,
          key: 'handle',
          fixed: 'right',
          handle: ['info','del'],
        },
      ],
    }
  },
  created() {},
  methods: {},
}
</script>
