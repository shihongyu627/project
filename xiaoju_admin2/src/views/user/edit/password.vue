<script>
import baseEdit from '@/views/components/base/baseEdit.vue'
export default {
  extends: baseEdit,
  components: {},
  data() {
    return {
      title: '修改密码',
      mname: 'user',
      items: [
        { label: '修改密码', desc: '基本信息', type: 'header' },
        { label: '登录密码', name: 'password', value: '', type: 'password', rules: [{ required: true, message: '原密码不能为空', trigger: 'blur' }] },
        { label: '新的密码', name: 'new_password', value: '', type: 'password', rules: [{ required: true, message: '新密码不能为空', trigger: 'blur' }] },
        { label: '确认密码', name: 'new_password1', value: '', type: 'password', rules: [{ required: true, message: '确认密码不能为空', trigger: 'blur' }] },
      ],
      forms: {
        password: '',
        new_password: '',
        new_password1: '',
      },
    }
  },
  created() {},
  mounted() {},
  methods: {
    handleSubmit() {
      console.log('handleSubmit forms', this.forms)
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 修改密码
          if (this.forms.new_password !== this.forms.new_password1) {
            $utils.toast.warn('两次输入密码不一致')
            return
          }
          let q = this.forms
          $utils.api.load('authUpPassword', q, 'post', { toast: true }).then((res) => {
            //
          })
        }
      })
    },
  },
}
</script>
