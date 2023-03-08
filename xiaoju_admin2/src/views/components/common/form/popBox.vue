<template>
  <Row>
    <i-col>
      <Input v-model="value" :placeholder="placeholder" :disabled="true" style="width: 200px;margin-right:5px;">
        <div slot="append">
          <Button type="ghost"  :disabled="disabled" @click="openModel">选择</Button>
        </div>
      </Input>
    </i-col>
    <i-col>
      {{ name }}
    </i-col>
    <Modal class-name="vertical-center-modal" v-model="modal" width="650" :footer-hide="true" :scrollable="false" :draggable="false">
      <pop-user @on-click="clickRow" @on-clear="clear" v-if="type == 'user'" :query="query"></pop-user>
    </Modal>
  </Row>
</template>

<script>
import popUser from '../../../user/popUser'

export default {
  name: 'popBox',
  components: {
    popUser,
  },
  props: {
    name: {
      type: String,
      default: '',
    },
    value: String | Number,
    type: String,
    placeholder: String,
    disabled: {
      type: Boolean,
      default: false,
    },
    query: {
      type: Object,
      default: () => {
        return {}
      },
    }, // box的查询query
  },
  data() {
    return {
      row: null,
      modal: false,
    }
  },
  watch: {
    row(v) {
      // this.ajaxData()
    },
  },
  created() {},
  mounted() {},
  methods: {
    openModel() {
      this.modal = true
    },
    clickRow(row) {
      if (row) {
        this.row = row
        let id = null
        let nn = ''
        if (this.type == 'user') {
          id = row.uid
          nn = row.user_nick
        } else if (this.type == 'shop') {
          id = row.shop_id
          nn = row.shop_name
        }
        try {
          this.$emit('input', id)
          this.$emit('update:name', nn)
          this.$emit('on-click', row)
          this.modal = false
          console.log('clickRow ', row)
        } catch (error) {
          console.log(error)
        }
      }
    },
    clear() {
      let row = {}
      row.user = {}
      this.clickRow(row)
      console.log('clear')
    },
  },
  watch: {},
  init() {},
}
</script>
<style lang="less">
.vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;

  .ivu-modal {
    top: 0;
  }
}
</style>
