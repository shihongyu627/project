<template>
<div>
  <!-- 标题 -->
  <h3 v-if="title">{{title}}</h3>
  <Row>
    <Col >
    <Form ref="form" :model="info" :label-width="120" :label-colon="true">
      <div v-for="(v, k) in items" :key="k">
          <template v-if="v.type === 'header'" >
              <form-header :name="v.label" :label="v.desc"></form-header>
          </template>
          <template v-else-if="v.type === 'label'" >
              <FormItem :label="v.label" style="margin-bottom:0px;" >
                  <div v-html="info[v.name]"></div>
              </FormItem>
          </template>
          <template v-else-if="v.type === 'image'" >
              <FormItem :label="v.label" style="margin-bottom:0px;" >
                  <img :src="loadimg(info[v.name])" style="width:120px;" @click="showImg(loadimg(info[v.name]))"></img>
              </FormItem>
          </template>
          <template v-else-if="v.type === 'gallery'" >
              <FormItem :label="v.label" style="margin-bottom:0px;" >
                  <div v-for="(vv, kk) in info[v.name]" :key="kk">
                      <img :src="loadimg(vv)" style="width:120px;" @click="showImg(loadimg(vv))"></img>
                  </div>
              </FormItem>
          </template>
          <template v-else-if="v.type === 'timeline'" >
            <FormItem style="margin-bottom:0px;" >
              <Timeline>
                <TimelineItem color="green" v-for="(vv, kk) in v.dropList" :key="kk">
                  <p class="label">{{vv.label||''}}{{vv.slabel?"【"+vv.slabel+"】":''}}</p> 
                  <p class="time">{{vv.time}}</p>
                  <p class="content">{{vv.content}}</p>
                </TimelineItem>
              </Timeline>
            </FormItem>
          </template>
          <template v-else>
              <FormItem :label="v.label" style="margin-bottom:0px;" >
                  <div v-html="info[v.name]"></div>
              </FormItem>
          </template>
        </div>
      </Form>
    </Col>
  </Row>
  <Modal title="图片预览" v-model="imgVisible" >
      <img :src="imgUrl"  style="width: 100%">
  </Modal>
</div>
</template>
<script>
import baseView from './baseView.vue'
export default {
  extends: baseView,
  name: 'baseInfo',
  components: {
  },
  props: {
      kv: null,
  },
  watch: {
      kv (v) {
        console.log('baseInfo watch kv', this.mname, v)
        this.initData(v)
      }
  },
  data () {
    return {
      mname: '',
      url: {},
      items: [],  // 显示条目
      info: {},
      imgUrl: '',
      imgVisible: false,
      list:[]
    }
  },
  created () {
    console.log('baseInfo created.')
    let route = this.$route
    console.log('route', route)
    this.title = route.title || ''
    let query = this.$route.query
    console.log('created query', query)
    console.log('created mname', this.mname)
    if (query.kv){
      this.kv = query.kv
    }
    if(this.kv){
      this.initData(this.kv)
    }
  },
  methods: {
    initItems () {
      return this.items
    },
    initData(kv) {
      this.initItems()
      // 加载详情数据
      this.info = {}
      $form.initData(this, {}, (res) => {
        if (res) {
          this.info = res
          console.log('initData info', this.info)
        }
      }, false)
    },
    showImg (src) {
      this.imgUrl = src;
      this.imgVisible = true;
    }
  }
}
</script>
<style lang="less" scoped>
</style>
