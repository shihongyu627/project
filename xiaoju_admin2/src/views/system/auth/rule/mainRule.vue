<template>
  <div>
    <Row v-for="(v, k) in ruleList" :key="k" class="box" style="width: 100%;">
      <!-- 如果无下级，则呈现选择框 -->
      <Row :key="k" class="line" style="width: 100%;">
        <Col span="5" :key="k" class="label" @click.native="toClick(v.id, v.name)">{{ v.name }}</Col>
        <Col span="19">
          <Row style="width: 100%;">
            <template v-for="(vv, kk) in v.children || []">
              <Col :xs="12" :sm="8" :md="6" :lg="4" :xl="2" :xxl="2" v-if="(vv.children || []).length <= 0" :key="kk">
                <Checkbox :label="vv.id" :key="kk" :disabled="isSelect ? false : true" :value="vv.status ? true : false" @click.native="toClick(vv.id)">{{ vv.name }}</Checkbox>
              </Col>
            </template>
          </Row>
        </Col>
      </Row>
      <!-- 如果有下级，则呈现下级行 -->
      <Row :key="k" class="line" style="width: 100%;">
        <!-- <Col span="4" :key="k">{{ v.name }}</Col> -->
        <Col span="24">
          <Row style="width: 100%;">
            <template v-for="(vv, kk) in v.children || []">
              <Row v-if="(vv.children || []).length > 0" :key="kk" class="sline" style="width: 100%;background: rgba(200,200,200,0.1)">
                <!-- 如果无下级，则呈现选择框 -->
                <Row :key="kk" class="line" style="width: 100%;">
                  <Col span="5" :key="kk" class="label" style="padding-left:15px;" @click.native="toClick(vv.id, vv.name)">{{ vv.name }}</Col>
                  <Col span="19">
                    <Row style="width: 100%;">
                      <template v-for="(vvv, kkk) in vv.children || []">
                        <Col :xs="12" :sm="8" :md="6" :lg="4" :xl="2" :xxl="2" v-if="(vvv.children || []).length <= 0" :key="kkk">
                          <Checkbox :label="vvv.id" :key="kkk" :disabled="isSelect ? false : true" :value="vvv.status ? true : false" @click.native="toClick(vvv.id)">{{ vvv.name }}</Checkbox>
                        </Col>
                      </template>
                    </Row>
                  </Col>
                </Row>
                <!-- 如果有下级，则呈现下级行 -->
                <Row :key="kk" class="line" style="width: 100%;">
                  <!-- <Col span="4" :key="kk">{{ vv.name }}</Col> -->
                  <Col span="24">
                    <Row style="width: 100%;">
                      <template v-for="(vvv, kkk) in vv.children || []">
                        <Row v-if="(vvv.children || []).length > 0" :key="kkk" class="sline" style="width: 100%;background: rgba(200,200,200,0.1)">
                          <!-- 如果无下级，则呈现选择框 -->
                          <Row :key="kkk" class="line" style="width: 100%;">
                            <Col span="5" :key="kkk" class="label" style="padding-left:30px;" @click.native="toClick(vvv.id, vvv.name)">{{ vvv.name }}</Col>
                            <Col span="19">
                              <Row>
                                <template v-for="(vvvv, kkkk) in vvv.children || []">
                                  <Col :xs="12" :sm="8" :md="6" :lg="4" :xl="2" :xxl="2" v-if="(vvvv.children || []).length <= 0" :key="kkkk">
                                    <Checkbox :label="vvvv.id" :key="kkkk" :disabled="isSelect ? false : true" :value="vvvv.status ? true : false" @click.native="toClick(vvvv.id)">{{
                                      vvvv.name
                                    }}</Checkbox>
                                  </Col>
                                </template>
                              </Row>
                            </Col>
                          </Row>
                          <!-- 如果有下级，则呈现下级行 -->
                          <Row :key="kkk" class="line" style="width: 100%;">
                            <!-- <Col span="4" :key="kkk">{{ vvv.name }}</Col> -->
                            <Col span="24">
                              <Row style="width: 100%;">
                                <template v-for="(vvvv, kkkk) in vvv.children || []">
                                  <Row v-if="(vvvv.children || []).length > 0" :key="kkkk" class="sline" style="width: 100%;background: rgba(200,200,200,0.1)">
                                    <!-- 如果无下级，则呈现选择框 -->
                                    <Row :key="kkkk" class="line" style="width: 100%;">
                                      <Col span="5" :key="kkkk" class="label" style="padding-left:45px;" @click.native="toClick(vvv.id, vvv.name)">{{ vvvv.name }}</Col>
                                      <Col span="19">
                                        <Row style="width: 100%;">
                                          <template v-for="(vvvvv, kkkkk) in vvvv.children || []">
                                            <Col :xs="12" :sm="8" :md="6" :lg="4" :xl="2" :xxl="2" v-if="(vvvvv.children || []).length <= 0" :key="kkkkk">
                                              <Checkbox :label="vvvvv.id" :key="kkkkk" :disabled="isSelect ? false : true" :value="vvvvv.status ? true : false" @click.native="toClick(vvvvv.id)">{{
                                                vvvvv.name
                                              }}</Checkbox>
                                            </Col>
                                          </template>
                                        </Row>
                                      </Col>
                                    </Row>
                                    <!-- 如果有下级，则呈现下级行 -->
                                    <Row :key="kkkk" class="line" style="width: 100%;">
                                      <!-- <Col span="4" :key="kkk">{{ vvv.name }}</Col> -->
                                      <Col span="24">
                                        <Row style="width: 100%;">
                                          <template v-for="(vvvvv, kkkkk) in vvvv.children || []">
                                            <Row v-if="(vvvvv.children || []).length > 0" :key="kkkkk" class="sline" style="width: 100%;background: rgba(200,200,200,0.1)">
                                              {{ vvvvv.name }}
                                            </Row>
                                          </template>
                                        </Row>
                                      </Col>
                                    </Row>
                                  </Row>
                                </template>
                              </Row>
                            </Col>
                          </Row>
                        </Row>
                      </template>
                    </Row>
                  </Col>
                </Row>
              </Row>
            </template>
          </Row>
        </Col>
      </Row>
    </Row>
  </div>
</template>
<script>
import Vue from 'vue'
import AuthRuleEditBox from './editBox'
Vue.component('authRuleEditBox', AuthRuleEditBox)
export default {
  components: {},
  data() {
    return {}
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
    isSelect: {
      type: Boolean,
      default: false,
    },
    ruleList: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  mounted() {},
  methods: {
    toAdd(pid = '', stitle = '') {
      $utils.url.push({
        name: 'auth_rule_add',
        query: { action: 'add', pid: pid, stitle: stitle },
      })
    },
    toClick(id, name = '') {
      let that = this
      this.$Modal.confirm({
        width: 480,
        okText: '关闭',
        cancelText: '新增子节点',
        onOk() {
          that.$emit('refresh', true)
          console.log('on-ok')
        },
        onCancel() {
          that.toAdd(id, '新增 ' + name + ' 子节点')
        },
        render: (h) => {
          return h('authRuleEditBox', {
            style: {
              margin: '0',
              color: '#19be6b',
            },
            props: {
              id: id,
            },
            on: {
              submit: (val) => {
                that.$emit('refresh', true)
                console.log('on-submit', val)
                that.$Modal.remove()
              },
            },
          })
        },
      })
    },
  },
}
</script>
<style lang="less" scoped>
.box {
  clear: both;
  overflow: hidden;
  margin-left: 0px;
  // margin-top: 5px;
  // margin-bottom: 5px;
  background: rgba(200, 200, 200, 0.05);
  border: 1px #eee solid;
  padding: 0px;
  border-bottom: 0;
  .label {
    padding-left: 5px;
    max-width: 150px;
    min-width: 100px;
    color: #444;
  }
  .line {
    padding-top: 5px;
    // padding-bottom: 5px;
  }
  .sline {
    clear: both;
    overflow: hidden;
    margin-left: 0px;
    margin-bottom: 0px;
  }
}
</style>
