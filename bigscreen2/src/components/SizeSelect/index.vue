<!--
 * @Author: your name
 * @Date: 2020-03-03 18:29:28
 * @LastEditTime: 2020-03-19 15:42:17
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /sunsea-master/src/components/SizeSelect/index.vue
 -->
<template>
  <el-dropdown trigger="click" @command="handleSetSize">
    <div>
      <svg-icon class-name="icon-size" icon-class="Adjust" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-for="item of sizeOptions" :key="item.value" :disabled="size===item.value" :command="item.value">
        {{ item.label }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  data() {
    return {
      sizeOptions: [
        { label: '默认', value: 'default' },
        { label: '中等', value: 'medium' },
        { label: '较小', value: 'small' },
        { label: '迷你', value: 'mini' }
      ]
    }
  },
  computed: {
    size() {
      return this.$store.getters.size
    }
  },
  methods: {
    handleSetSize(size) {
      this.$ELEMENT.size = size
      this.$store.dispatch('app/setSize', size)
      this.refreshView()
      this.$message({
        message: '设置成功',
        type: 'success'
      })
    },
    refreshView() {
      // In order to make the cached page re-rendered
      this.$store.dispatch('tagsView/delAllCachedViews', this.$route)

      const { fullPath } = this.$route

      this.$nextTick(() => {
        this.$router.replace({
          path: '/redirect' + fullPath
        })
      })
    }
  }

}
</script>
