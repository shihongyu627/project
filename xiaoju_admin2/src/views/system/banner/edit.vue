<script>
import baseEdit from '@/views/components/base/baseEdit.vue'
export default {
  extends: baseEdit,
  components: {},
  data() {
    return {
      mname: 'banner',
      items: [
        { label: '基本信息', desc: '表单的基本信息', type: 'header' },
        { label: '标题', name: 'title', value: '', type: 'input', rules: [{ required: true, trigger: 'blur' }] },
        { label: '位置', name: 'place', value: 'home_banner', type: 'select', dropList: [{ value: 'home_banner', name: '首页轮播图' }], rules: [{ required: true, trigger: 'blur' }] },
        { label: '封面图', name: 'image', value: '', type: 'image', desc: '建议图片宽高尺寸700*120像素及以上', rules: [{ required: true, trigger: 'blur' }] },
        { label: '超链接', name: 'linkurl', value: '', type: 'input' },
        { label: '内容', name: 'content', value: '', type: 'textarea' },
        { label: '状态', name: 'status', value: 1, type: 'switch', trueValue: 1, falseValue: 0 },
      ],
      forms: {},
    }
  },
  created() {},
  methods: {},
}
</script>
