<template>
  <Row>
    <Col>
      <TimePicker :value="time" @on-change="handleChange" :placement="placement" :type="type" :format="format" :placeholder="placeholder" style="width: 200px"></TimePicker>
    </Col>
  </Row>
</template>

<script>
export default {
  name: 'formTime',
  components: {},
  props: {
    value: {
      // 日期值，[区间·开始时间]
      type: String,
      default: () => {
        return $utils.time.now()
      },
    },
    end: String, // [区间·结束时间]
    type: {
      type: String,
      default: 'time',
    },
    format: {
      type: String,
      default: 'HH:mm',
    },
    placement: {
      type: String,
      default: 'bottom-end',
    },
    placeholder: {
      type: String,
      default: () => {
        return '选择时间'
      },
    },
  },
  data() {
    return {
      // date: null,
    }
  },
  watch: {},
  computed: {
    time: function() {
      // 时间区间
      if (this.end) {
        return [this.value, this.end]
      } else {
        return this.value
      }
    },
  },
  created() {
    this.handleChange(this.value)
  },
  methods: {
    handleChange(val) {
      // 时间格式化
      if (val) {
        // 时间区间
        if (this.end) {
          this.$emit('input', val[0])
          this.$emit('update:end', val[1])
        } else {
          this.$emit('input', val)
        }
        console.log('formTime handleChange', val)
      }
    },
  },
}
</script>
<style lang="less"></style>
