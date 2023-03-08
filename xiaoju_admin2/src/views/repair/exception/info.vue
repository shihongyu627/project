<script>
import baseInfo from '@/views/components/base/baseInfo.vue'
export default {
  extends: baseInfo,
  components: {},
  data() {
    return {
      mname: 'deviceTagsRecord',
      items: [
        { label: '异常车辆数据', desc: '异常车辆的基本信息', type: 'header' },
        { label: '车辆编号', name: 'device_no', value: '', type: 'label' },
        { label: '异常信息', name: 'tags', value: '', type: 'label' },
        { label: '异常内容', name: 'content', value: '', type: 'label' },
        { label: '异常地点', name: 'device_address', value: '', type: 'label' },
        // { label: '截图', name: 'gallery', value: '', type: 'gallery' },
        // { label: '提交者', name: 'user_nick', value: '', type: 'label' },
        { label: '提交时间', name: 'create_time', value: '', type: 'label' },
      ],
      info: {},
    }
  },
  created() {},
  methods: {
  },
}
</script>
