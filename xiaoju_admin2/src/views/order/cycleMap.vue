<script>
import baseInfo from '@/views/components/base/baseInfo.vue'
export default {
    extends: baseInfo,
    components: {
    },
    data () {
        return {
            mname: 'order',
            items: [
                {label: '基本信息', desc: '订单的基本信息', type: 'header'},
                {label: '标题', name: 'title', value: '', type: 'label', },
                {label: '封面图', name: 'image', value: '',  type: 'image', },
                {label: '内容', name: 'content', value: '',  type: 'label', },
                {label: '关键词', name: 'keyword', value: '',  type: 'label', },
                {label: '订单数据', desc: '订单的基本信息', type: 'header'},
                {label: '订单编号', name: 'order_no', value: '', type: 'label', },
                {label: '实际支付金额', name: 'order_fee', value: '',  type: 'label', },
                {label: '流程数据', desc: '流程截图信息', type: 'header'},
                {label: '流程', name: 'order_items', value: '',  type: 'list', dropList: [] },
            ],
            info: {},
        }
    },
    created () {
    },
    methods: {
        initData(kv) {
          // 加载详情数据
          console.log('initData info', this.info)
          $form.initData(this, {}, (res) => {
            if (res) {
              let info = res || {}
              // 格式化
              let dropList = []
              if(info.order_items && info.order_items.length>0) {
                  for (let index = 0; index < info.order_items.length; index++) {
                      const element = info.order_items[index];
                      let xx = {}
                      xx.label = element['item_name'];
                      xx.name = 'item_finish_imgs';
                      xx.type = element['item_type']==1?'image':'label';
                      xx.value = element['item_finish_imgs'];
                      dropList.push(xx)
                      
                  }
              }
              for (let index = 0; index < this.items.length; index++) {
                  const element = this.items[index];
                  if(element && element.name == 'order_items' && element.type == 'list') {
                      this.items[index]['dropList'] = dropList
                  }
              }
              this.info = info
              console.log('initData info', this.info)
            }
          })
        },
    }
}
</script>
