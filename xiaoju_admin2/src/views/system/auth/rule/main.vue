<template>
  <div>
    <box-header>
      <Row slot="left" :gutter="2">
        <Button type="primary" @click.native="toAdd()">新增权限</Button>
      </Row>
    </box-header>
    <MainRule :isEdit="true" :isSelect="true" :ruleList="ruleList" @refresh="this.loadData" />
  </div>
</template>
<script>
import MainRule from './mainRule'
export default {
  components: {
    MainRule,
  },
  data() {
    return {
      url: '',
      query: {
        pid: 1,
        title: '',
      },
      table: {
        mname: 'authRule',
        key: 'id',
        url: {},
      },
      ruleList: [],
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      let q = {}
      q.pid = 0
      q.is_all = 1
      $utils.api.load('authRuleMainDropTree', q).then((res) => {
        this.ruleList = res.data[0].children || []
      })
    },
    toAdd(pid = '', stitle = '') {
      $utils.url.push({
        name: 'auth_rule_add',
        query: { action: 'add', pid: pid, stitle: stitle },
      })
    },
  },
}
</script>
<style lang="less" scoped></style>
