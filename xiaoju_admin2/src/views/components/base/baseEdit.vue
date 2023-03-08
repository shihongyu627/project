<template>
  <div>
    <!-- 标题 -->
    <h3 v-if="title">{{ title }}</h3>
    <Row>
      <Col :xs="24" :sm="24" :md="18" :lg="14">
        <Form ref="form" :model="forms" :label-width="140" :disabled="action == 'view' ? true : false">
          <form-body :forms="forms" :items="items" :disabled="action == 'view' ? true : false"></form-body>
          <button-box v-if="action != 'view'">
            <Poptip confirm title="请检查数据, 再确认提交" @on-ok="handleSubmit">
              <button-sub :loading="sloading"></button-sub>
            </Poptip>
            <button-back></button-back>
          </button-box>
        </Form>
      </Col>
    </Row>
    <Modal title="图片预览" v-model="imgVisible">
      <img :src="imgUrl" style="width: 100%" />
    </Modal>
  </div>
</template>
<script>
import baseView from "./baseView.vue";
export default {
  extends: baseView,
  name: "baseEdit",
  components: {},
  data() {
    return {
      sloading: false,
      action: "add",
      kv: "",
      mname: "",
      url: {},
      items: [],
      forms: {},
      imgUrl: "",
      imgVisible: false,
    };
  },
  watch: {
    items() {
      this.$forceUpdate();
    },
    forms() {
      this.$forceUpdate();
    },
  },
  created() {
    console.log("baseEdit created.");
    let query = this.$route.query;
    console.log("created query", query);
    console.log("created mname", this.mname);
    this.action = query.action ? query.action : this.action;
    // 初始化控件
    this.initItem();
    if (this.action === "add") {
      // 添加初始化
      this.initForm();
    } else if (this.action === "edit") {
      this.kv = query.kv;
      this.initData();
    } else {
      $utils.toast.error("请求方式异常");
    }
  },
  methods: {
    initData() {
      // 加载详情数据
      console.log("initData forms", this.forms);
      $form.initData(this, {}, (res) => {
        if (res) {
          this.forms = res;
          console.log("initData forms", this.forms);
        }
      });
    },
    initForm() {
      // 初始化表单
      console.log("initForm forms", this.forms);
      let forms = this.forms || {};
      for (let index = 0; index < this.items.length; index++) {
        const element = this.items[index];
        if (element.type !== "header" && element.type !== "label") {
          if (element.value) {
            forms[element.name] = element.value || "";
          } else {
            // 数字设置为空，否则会有默认值1
            if (element.type === "number") {
              forms[element.name] = "";
            }
          }
        }
      }
      this.forms = forms;
      console.log("initForm forms", this.forms);
    },
    initItem() {
      // 初始化控件
      console.log("initItem items", this.items);
      for (let index = 0; index < this.items.length; index++) {
        const element = this.items[index];
        if (element.rules) {
          for (let j = 0; j < element.rules.length; j++) {
            const ee = element.rules[j];
            if (!ee.message) {
              let message = "";
              if (ee.required) {
                message = element.label + "不能为空";
              }
              this.items[index]["rules"][j]["message"] = message;
            }
          }
        }
      }
      console.log("initItem items", this.items);
    },
    handleSubmit() {
      if (!this.action) {
        return true;
      }
      this.$refs.form.validate((valid) => {
        console.log("handleSubmit forms", valid, this.forms);
        if (valid) {
          $form.handleSubmit(this);
        }
      });
    },
    showImg(src) {
      this.imgUrl = src;
      this.imgVisible = true;
    },
    async loadItemsFieldDrop(type, field, param = {}) {
      // 通过pk查询字典数据
      let q = param;
      let apiname = "";
      if (type == "shop") {
        apiname = "shopDropList";
      }
      if (type == "shop_store") {
        apiname = "shopStoreDropList";
      }
      if (type == "device") {
        apiname = "deviceDropList";
      }
      if (type == "product") {
        apiname = "productDropList";
      }
      if (type == "product_class") {
        apiname = "productClassDropList";
      }
      if (type == "product_class_tree") {
        apiname = "productClassDropTree";
      }
      if (type == "help_class") {
        apiname = "helpClassDropList";
      }
      if (type == "help_class_tree") {
        apiname = "helpClassDropTree";
      }
      if (type == "auth_group") {
        apiname = "authGroupDropList";
      }
      if (type == "auth_type") {
        apiname = "authTypeDropList";
      }
      if (!apiname) {
        return;
      }
      let res = await $utils.api.load(apiname, q);
      if (res && res.data) {
        let ll = res.data;
        let dropList = [];
        for (let index = 0; index < ll.length; index++) {
          const element = ll[index];
          let xx = {};
          xx.value = element.value;
          xx.name = element.name;
          xx.children = element.children || [];
          dropList.push(xx);
        }
        for (let index = 0; index < this.items.length; index++) {
          const element = this.items[index];
          if (element && element.name == field && (element.type == "select" || element.type == "tree")) {
            this.items[index]["dropList"] = (this.items[index]["dropList"] || []).concat(dropList);
          }
        }
        console.log("dropList " + field, dropList);
      }
    },
    // 通过name查询items下标
    indexOfName(name = "", items = []) {
      if (!name) {
        return -1;
      }
      if (!items) {
        items = this.items || [];
      }
      for (let index = 0; index < this.items.length; index++) {
        const element = this.items[index];
        if (element && element.name == name) {
          return index;
        }
      }
      return -1;
    },
  },
};
</script>
<style lang="less" scoped></style>
