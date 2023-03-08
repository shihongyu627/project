<template>
  <div>
    <div style="margin-top:15px">远程控制</div>
    <div style="margin-top:5px;display: flex;justify-content:space-start;">
      <Button @click="controlItemBtn('OPEN_LOCK')">远程开锁</Button>
      <Button @click="controlItemBtn('CLOSE_LOCK')" style="margin-left:35px">
        远程关锁
      </Button>
      <Button @click="controlItemBtn('FIND_DEVICE')" style="margin-left:35px">
        远程寻车
      </Button>
    </div>
    <div style="margin-top:15px;display: flex;justify-content:space-start;">
      <Button @click="controlItemBtn('PAUSE_UNLOCK')">临时开锁</Button>
      <Button @click="controlItemBtn('PAUSE_LOCK')"  style="margin-left:35px">临时关锁</Button>
    </div>
    <div style="margin-top:15px;display: flex;justify-content:space-start;">
      <Button @click="controlItemBtn('NOW_LOCATION')">立即定位</Button>
      <Button @click="controlItemBtn('CHECK_LOCK')" style="margin-left:35px">
        检测锁态
      </Button>
      <Button v-if="isMqtt" @click="getEmqxClient(mqttClientId, '设备MQTT端信息')" style="margin-left:35px;font-size: 12px;">
        MQTT信息
      </Button>
    </div>
    <div style="margin-top:15px">远程设置</div>
    <div style="margin-top:5px;display: flex;justify-content:space-start;">
      <Input placeholder="请输入配置信息" v-model="dev_config" style="width:210px" />
      <Poptip confirm="{true}" title="请检查数据, 再确认提交" @on-ok="controlItemBtn('SET_CONFIG', { config: dev_config })">
        <Button style="margin-left:35px">更新配置</Button>
      </Poptip>
    </div>
    <div style="margin-top:15px">远程重启</div>
    <div style="margin-top:5px;display: flex;justify-content:space-start;">
      <Button type="error" @click="controlItemBtn('RESTART')">
        重新启动
      </Button>
      <Button type="warning" @click="controlItemBtn('RELOGIN')" style="margin-left:35px">
        重新登录
      </Button>
    </div>
    <Drawer :title="`MQTT客户端信息${device_no}`" width="640" v-model="showMqttInfo" :styles="{ 'z-index': 8540 }">
      <p :style="pStyle">MQTT类型</p>
      <div class="demo-drawer-profile">
        <Row>
          <Col span="12"> {{ type_name }} </Col>
        </Row>
      </div>
      <Divider />
      <p :style="pStyle">连接信息</p>
      <div class="demo-drawer-profile">
        <Row>
          <Col span="12"> 客户端ID: {{ mqttInfo.clientid }} </Col>
          <Col span="12"> 用户名: {{ mqttInfo.username }} </Col>
        </Row>
        <Row>
          <Col span="12"> 节点: {{ mqttInfo.node }} </Col>
          <Col span="12"> 是否为桥接: {{ mqttInfo.is_bridge }} </Col>
        </Row>
        <Row>
          <Col span="12"> 协议类型: {{ mqttInfo.proto_name }} </Col>
          <Col span="12"> 协议版本: {{ mqttInfo.proto_ver }} </Col>
        </Row>
        <Row>
          <Col span="12"> IP地址: {{ mqttInfo.ip_address }} </Col>
          <Col span="12"> 端口: {{ mqttInfo.port }} </Col>
        </Row>
        <Row>
          <Col span="12"> 连接状态: {{ mqttInfo.connected }} </Col>
          <Col span="12"> 心跳: {{ mqttInfo.keepalive }} </Col>
        </Row>
        <Row>
          <Col span="12"> 连接时间: {{ mqttInfo.connected_at }} </Col>
          <Col span="12"> 离线时间: {{ mqttInfo.disconnected_at }} </Col>
        </Row>
      </div>
      <Divider />
      <p :style="pStyle">会话信息</p>
      <div class="demo-drawer-profile">
        <Row>
          <Col span="12"> 会话创建时间: {{ mqttInfo.created_at }} </Col>
          <Col span="12"> 会话过期间隔（秒）: {{ mqttInfo.expiry_interval }} </Col>
        </Row>
        <Row>
          <Col span="12"> 订阅数量: {{ mqttInfo.subscriptions_cnt }} </Col>
          <Col span="12"> 最大订阅数量: {{ mqttInfo.max_subscriptions }} </Col>
        </Row>
        <Row>
          <Col span="12"> 飞行窗口: {{ mqttInfo.inflight }} </Col>
          <Col span="12"> 最大飞行窗口: {{ mqttInfo.max_inflight }} </Col>
        </Row>
        <Row>
          <Col span="12"> 消息队列: {{ mqttInfo.mqueue_len }} </Col>
          <Col span="12"> 最大消息队列: {{ mqttInfo.max_mqueue }} </Col>
        </Row>
      </div>
      <div class="demo-drawer-footer">
        <Button type="warning" style="margin-right: 8px" @click="getEmqxClient(mqttClientId, '设备MQTT端信息')">设备MQTT端信息</Button>
        <Button type="primary" @click="getEmqxClient('_' + mqttClientId, '系统MQTT端信息')">系统MQTT端信息</Button>
      </div>
    </Drawer>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    device_ids: {
      type: String,
      value: '',
    },
    device_no: {
      // 单设备可显示
      type: String,
      value: '',
    },
    isMqtt: {
      // mqtt的单设备可显示查看mqtt客户端的按钮
      type: Boolean,
      value: false,
    },
    mqttClientId: {
      // mqtt的单设备可显示查看mqtt客户端的按钮
      type: String,
      value: '',
    },
  },
  data() {
    return {
      dev_config: '',
      showMqttInfo: false,
      mqttInfo: {},
      type_name: '',
      pStyle: {
        fontSize: '16px',
        color: 'rgba(0,0,0,0.85)',
        lineHeight: '24px',
        display: 'block',
        marginBottom: '16px',
      },
    }
  },
  created() {},
  mounted() {},
  methods: {
    controlItemBtn(action, param = {}) {
      if (!this.device_ids) {
        $utils.toast.error('请选择需要控制的设备')
        return
      }
      let q = param
      q.device_ids = this.device_ids
      q.action = action
      $utils.api.load('controlDevice', q, 'post', { toast: true, toasterror: false })
    },
    getEmqxClient(mqttClientId, type_name = '') {
      let that = this
      if (!mqttClientId) {
        $utils.toast.error('设备客户端ID不能为空')
        return
      }
      that.type_name = type_name
      let q = {}
      q.client_id = mqttClientId
      $utils.api.load('deviceGetEmqxClient', q, 'post', { toast: false, toasterror: false }).then((res) => {
        that.showMqttInfo = true
        if (res.code == 1) {
          that.mqttInfo = res.data || {}
        } else {
          that.mqttInfo = {}
          $utils.toast.error(res.message)
        }
      })
    },
  },
}
</script>
<style lang="less" scoped>
/deep/ .ivu-drawer-wrap {
  z-index: 1340;
}
.demo-drawer-footer {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  background: #fff;
}
.demo-drawer-profile {
  font-size: 14px;
}
.demo-drawer-profile .ivu-col {
  margin-bottom: 8px;
}
</style>
