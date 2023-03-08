<script>
import baseEdit from "@/views/components/base/baseEdit.vue";
export default {
  extends: baseEdit,
  components: {},
  data() {
    return {
      mname: "userWhite",
      items: [
        { label: "基本信息", desc: "表单的基本信息", type: "header" },
        { label: "名称", name: "title", value: "", type: "input", rules: [{ required: true, trigger: "blur" }] },
        { label: "手机号", name: "use_mobile", value: "", type: "input", rules: [{ required: true, trigger: "blur" }] },
        // {label: '关联用户', name: 'use_uid', value: '', type: 'uid', disabled:false, query: {}, rules: [{ required: false, trigger: 'blur', type: 'number' }]},
        { label: "是否全部可用", name: "is_all", value: 1, type: "switch", trueValue: 1, falseValue: 0 , onChange: this.allChange },
        { label: "可用商家", name: "shop_ids", value: "", type: "select", multiple: true, dropList: [], onChange: this.shopChange.bind(this) },
        { label: "可用区域", name: "store_ids", value: "", type: "select", multiple: true, dropList: [] },
        { label: "状态", name: "status", value: 1, type: "switch", trueValue: 1, falseValue: 0 },
        { label: "备注", name: "remark", type: "textarea" },
      ],
      forms: {},
    };
  },
  async created() {
    await this.loadItemsFieldDrop("shop", "shop_ids");
  },
  methods: {
    // 商家选择改变-设置区域下拉列表
    async shopChange(val = '') {
      console.log(val);
      val = (val||[]).join(',')
      // 清空区域下拉
      this.forms.is_all = 0 // 取消全部可用
      this.forms["store_ids"] = [];
      this.items[this.indexOfName("store_ids")]["value"] = [];
      this.items[this.indexOfName("store_ids")]["dropList"] = [];
      if (val) {
        await this.loadItemsFieldDrop("shop_store", "store_ids", { shop_id: val });
      }
    },
    allChange(val = '') {
      console.log(val);
      if(val == 1){
        this.forms["shop_ids"] = []
        this.forms["store_ids"] = []
        this.items[this.indexOfName("shop_ids")]["value"] = []
        this.items[this.indexOfName("store_ids")]["value"] = []
      } else{
        this.forms["shop_ids"] = []
        this.forms["store_ids"] = []
        this.items[this.indexOfName("shop_ids")]["value"] = []
        this.items[this.indexOfName("store_ids")]["value"] = []
      }
    },
    handleSubmit() {
      if (!this.action) {
        return true;
      }
      this.$refs.form.validate((valid) => {
        console.log("handleSubmit forms", valid, this.forms);
        if (valid) {
          this.forms.shop_ids = (this.forms.shop_ids || []).join(",");
          this.forms.store_ids = (this.forms.store_ids || []).join(",");
          $form.handleSubmit(this);
        }
      });
    },
  },
};
</script>
