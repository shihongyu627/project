<script>
import baseEdit from '@/views/components/base/baseEdit.vue'
export default {
  extends: baseEdit,
  components: {},
  data() {
    return {
      mname: 'authType',
      items: [
        { label: '基本信息', desc: '表单的基本信息', type: 'header' },
        {
          label: '类型',
          name: 'type',
          value: '',
          type: 'select',
          dropList: [
            { value: 1, name: '管理' },
            { value: 2, name: '商家' },
            { value: 5, name: '运营' },
            { value: 0, name: '其他' },
          ],
          rules: [{ required: true, trigger: 'blur', type: 'number' }],
        },
        { label: '名称', name: 'name', value: '', type: 'input', rules: [{ required: true, trigger: 'blur' }] },
        { label: '图标', name: 'icon', value: '', type: 'image', desc: '建议图片宽高尺寸512*512像素及以上', rules: [{ required: false, trigger: 'blur' }] },
        // {label: '图示', name: 'image', value: '',  type: 'image',  rules: [{ required: false, trigger: 'blur' }]},
        { label: '状态', name: 'status', value: 1, type: 'switch', trueValue: 1, falseValue: 2 },
      ],
      forms: {},
    }
  },
  created() {
    
  },
  methods: {},
}
</script>
