<script>
export default {
  components: {},
  data() {
    return {}
  },
  computed: {
    userName() {
      return $utils.data.get('auth', 'uname') || ''
    },
    isSystem() {
      return $utils.data.get('auth', 'is_system') || false
    },
    isAllOrder() {
      return $utils.data.get('auth', 'is_all_order') || false
    },
    shopId() {
      return this.$store.state.app.shopId || $utils.data.get('app', 'shopId') || ''
    },
    shopName() {
      return this.$store.state.app.shopName || $utils.data.get('app', 'shopName') || $utils.data.get('auth', 'shop_name') || ''
    },
  },
  created() {
    console.log('baseView created.')
  },
  methods: {
    // 下划线转换驼峰
    toHump(name) {
      return name.replace(/\_(\w)/g, function(all, letter) {
        return letter.toUpperCase()
      })
    },
    // 驼峰转换下划线
    toLine(name) {
      return name.replace(/([A-Z])/g, '_$1').toLowerCase()
    },
    setTime(val) {
      return $utils.time.format(val)
    },
    loadimg(url, type = 'image') {
      return $utils.image.load(url, type)
    },
    loadtime(time) {
      return $utils.time.format(time)
    },
    toUrl(url, query = {}) {
      if (url) {
        // 判断是否商品
        if (url.indexOf('goods/detail') >= 0) {
          query = {
            gid: this.getUrlKey(url, 'goods_id'),
          }
          url = '/goods/info'
        }
        // 判断是否分类
        if (url.indexOf('goods/list') >= 0) {
          query = {
            category_id: this.getUrlKey(url, 'category_id'),
          }
          url = '/goods/list'
        }
        return $utils.url.push({
          path: url,
          query: query,
        })
      }
    },
    getUrlKey: function(url, name) {
      return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(url) || ['', ''])[1].replace(/\+/g, '%20')) || null
    },
    loadScript(src, callback) {
      let script = document.createElement('script')
      let head = document.getElementsByTagName('head')[0]
      script.type = 'text/javascript'
      script.charset = 'UTF-8'
      script.src = src
      if (script.addEventListener) {
        script.addEventListener(
          'load',
          function() {
            callback()
          },
          false
        )
      } else if (script.attachEvent) {
        script.attachEvent('onreadystatechange', function() {
          var target = window.event.srcElement
          if (target.readyState === 'loaded') {
            callback()
          }
        })
      }
      head.appendChild(script)
    },
  },
}
</script>
<style lang="less" scoped></style>
