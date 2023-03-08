<template>
  <div>终端监控</div>
</template>

<script>
// import Pagination from '@/components/Pagination'
import api_list from './api/deviceMonitor'
export default {
  name: 'DeviceMonitor',
  components: {
    // Pagination
  },
  data() {
    return {

    }
  },
  mounted() {
    api_list.getDeviceModelList({}).then((res) => {

    })
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>

</style>
