<template>
  <Row>
    <Col>
      <v-distpicker :disabeld="disabeld" :type="type" :province="province" :city="city" :area="area" @selected="onSelect"></v-distpicker>
    </Col>
  </Row>
</template>

<script>
import VDistpicker from 'v-distpicker'
export default {
  name: 'formAddress',
  components: {
    VDistpicker,
  },
  props: {
    value: {
      type: Object,
      default: () => {
        return {}
      },
    },
    disabeld: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: () => {
        return 'select'
      },
    },
    placeholder: {
      type: String,
      default: () => {
        return '选择省市区'
      },
    },
  },
  data() {
    return {
      province: '',
      city: '',
      area: '',
    }
  },
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler(val, oval) {
        console.log('watch value', val)
        if (val) {
          this.province = val.province || ''
          this.city = val.city || ''
          this.area = val.area || ''
        }
      },
    },
  },
  computed: {},
  created() {},
  mounted() {},
  updated() {},
  methods: {
    onSelect(val) {
      console.log('formAddress onSelect', val)
      this.$emit('on-change', val)
    },
  },
  init() {},
}
</script>
<style lang="less"></style>
