<script>
import baseInfo from '@/views/components/base/baseInfo.vue'
export default {
  extends: baseInfo,
  components: {},
  data() {
    return {
      mname: 'patrol',
      items: [
        { label: '巡检数据', desc: '巡检的基本信息', type: 'header' },
        { label: '车辆编号', name: 'device_no', value: '', type: 'label' },
        { label: '巡检部位', name: 'title', value: '', type: 'label' },
        { label: '巡检内容', name: 'content', value: '', type: 'label' },
        { label: '巡检地点', name: 'address_info', value: '', type: 'label' },
        { label: '截图', name: 'gallery', value: '', type: 'gallery' },
        // { label: '提交者', name: 'user_nick', value: '', type: 'label' },
        { label: '提交时间', name: 'create_time', value: '', type: 'label' },
      ],
      info: {},
    }
  },
  created() {},
  methods: {
    initData(kv) {
      // 加载详情数据
      console.log('initData info', this.info)
      $form.initData(
        this,
        {},
        (res) => {
          if (res) {
            // 图集
            res.gallery = res.gallery.split(',')
            let info = res || {}
            // 格式化
            let dropList = []
            if (info.record_list && info.record_list.length > 0) {
              for (let index = 0; index < info.record_list.length; index++) {
                const element = info.record_list[index]
                let xx = {}
                xx.label = element['user_nick'] || ''
                xx.slabel = element['action_name'] || ''
                xx.time = element['create_time'] || ''
                xx.content = element['text'] || ''
                dropList.push(xx)
              }
            }
            for (let index = 0; index < this.items.length; index++) {
              const element = this.items[index]
              if (element && element.name == 'list' && element.type == 'timeline') {
                this.items[index]['dropList'] = dropList
              }
            }
            this.info = info
            console.log('initData info', this.info)
          }
        },
        false
      )
    },
  },
}
</script>
