<template>
  <div class="main caseMain" />
</template>

<script>
export default {
  name: 'LogQuery',
  components: {
  },
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.caseMain {
    .backStyle{
        background-color: #fff;
        padding: 15px;
        margin-right: 15px;
        margin-bottom: 15px;
        color: #1B64B8;
        ::v-deep .el-page-header__content {
            font-size: 14px;
            color: #666;
            font-weight: bold;
        }
    }
    .formcon{
        background: #fff;
        padding-top: 15px;
        padding-bottom: 15px;
    }
    .sub_btn{
        text-align: center;
    }
    .el-table {
        margin-top: 30px;
    }
}
</style>
