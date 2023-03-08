<template>
  <div class="address">
    <v-distpicker :disabeld="disabeld" :type="type" @province="onChangeProvince"  @city="onChangeCity" @area="onChangeArea" :province="province" :city="city" :area="area" @selected="onSelect"></v-distpicker>
  </div>
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
      addressObj:{}
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
    // onSelect(val) {
    //   console.log('formAddress onSelect', val)
    //   this.$emit('on-change', val)
    // },
    onChangeProvince(val) {
      console.log('formAddress onChangeProvince', val)
      let obj = {}
      obj.province = val
      obj.city = ''
      obj.area = ''
      this.addressObj=obj
      this.$emit('on-change', obj)
    },
    onChangeCity(val) {
      console.log('formAddress onChangeCity', val)
      let obj = this.addressObj
      obj.city = val
      obj.area = ''
      console.log(obj);
      this.$emit('on-change', obj)
    },
    onChangeArea(val) {
      console.log('formAddress onChangeArea', val)
      let obj = this.addressObj
      obj.area = val
      console.log(obj);
      this.$emit('on-change', obj)
    },
  },
  init() {},
}
</script>
<style lang="less">
.address {
  .distpicker-address-wrapper {
    select {
      height: 32px;
      font-size: 0.8rem;
    }
  }
}
</style>
