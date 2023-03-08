<template>
  <div style="min-width:320px;">
    <template v-for="(v, k) in items">
      <template v-if="v.type === 'header'">
        <form-header :name="v.label" :label="v.desc" :key="k"></form-header>
      </template>
      <template v-else-if="v.type === 'label'">
        <FormItem :label="v.label" :key="k">
          <div v-html="v.value"></div>
          <row>{{ v.desc }}</row>
        </FormItem>
      </template>
      <template v-else-if="v.type === 'download'">
        <FormItem :label="v.label" :key="k">
          <a :href="v.value" target="_blank" :download="v.filename">{{ v.filename }}</a>
          <row>{{ v.desc }}</row>
        </FormItem>
      </template>
      <template v-else-if="v.type === 'string' || v.type === 'text' || v.type === 'input'">
        <FormItem :label="v.label" :prop="v.name" :rules="v.rules" :key="k">
          <Input v-model="forms[v.name]" :placeholder="v.placeholder || '请输入' + v.label" :disabled="v.disabled" />
          <row>{{ v.desc }}</row>
        </FormItem>
      </template>
      <template v-else-if="v.type === 'number'">
        <FormItem :label="v.label" :prop="v.name" :rules="v.rules" :key="k">
          <InputNumber
            size="default"
            v-model="forms[v.name]"
            style="width:180px"
            :min="v.min || 0"
            :max="v.max"
            :placeholder="v.placeholder || '请输入' + v.label"
            :disabled="v.disabled"
            :precision="v.precision"
          ></InputNumber>
          <row>{{ v.desc }}</row>
        </FormItem>
      </template>
      <template v-else-if="v.type === 'password'">
        <FormItem :label="v.label" :prop="v.name" :rules="v.rules" :key="k">
          <Input v-model="forms[v.name]" type="password" password :placeholder="v.placeholder || '请输入' + v.label" :disabled="v.disabled"> </Input>
          <row>{{ v.desc }}</row>
        </FormItem>
      </template>
      <template v-else-if="v.type === 'addressInfo'">
        <FormItem :label="v.label" :prop="v.name" :rules="v.rules" :key="k">
          <formAddress v-model="forms[v.name]" :disabled="v.disabled" @on-change="v.onChange"></formAddress>
        </FormItem>
      </template>
      <template v-else-if="v.type === 'hidden'">
        <Input v-model="forms[v.name]" type="hidden" :disabled="v.disabled" :key="k" />
      </template>
      <template v-else-if="v.type === 'select'">
        <FormItem :label="v.label" :prop="v.name" :rules="v.rules" :key="k">
          <i-select v-model="forms[v.name]" style="width:200px" :placeholder="'请选择' + v.label" :disabled="v.disabled" :multiple="v.multiple ? true : false" @on-change="v.onChange">
            <Option :value="s.value" v-for="(s, sk) in v.dropList || []" :key="sk">{{ s.name }}</Option>
          </i-select>
          <row>{{ v.desc }}</row>
        </FormItem>
      </template>
      <template v-else-if="v.type === 'select_group'">
        <FormItem :label="v.label" :prop="v.name" :rules="v.rules" :key="k">
          <i-select v-model="forms[v.name]" style="width:200px" :placeholder="'请选择' + v.label" :disabled="v.disabled" :multiple="v.multiple ? true : false" @on-change="v.onChange">
            <OptionGroup :value="s.value" :label="s.name||s.label" v-for="(s, sk) in v.dropList || []" :key="sk">
              <Option :value="ss.value" v-for="(ss, ssk) in s.children || []" :key="ssk">{{ ss.name }}</Option>
            </OptionGroup>
          </i-select>
          <row>{{ v.desc }}</row>
        </FormItem>
      </template>
      <template v-else-if="v.type === 'tree'">
        <FormItem :label="v.label" :prop="v.name" :rules="v.rules" :key="k">
          <i-select v-model="forms[v.name]" style="width:200px" :placeholder="'请选择' + v.label" :disabled="v.disabled">
            <template v-for="(s, sk) in v.dropList || []">
              <Option :value="s.value" :key="sk">{{ s.name }}</Option>
              <template if="v.children && v.children.length > 0">
                <template v-for="(ss, skk) in s.children || []">
                  <Option :value="ss.value" :key="skk" style="margin-left:15px;">{{ ss.name }}</Option>
                  <template if="ss.children && ss.children.length > 0">
                    <Option :value="sss.value" v-for="(sss, skkk) in (ss && ss.children) || []" :key="skkk" style="margin-left:30px;">{{ sss.name }}</Option>
                    <template if="sss.children && sss.children.length > 0">
                      <Option :value="ssss.value" v-for="(ssss, skkkk) in (sss && sss.children) || []" :key="skkkk" style="margin-left:45px;">{{ ssss.name }}</Option>
                    </template>
                  </template>
                </template>
              </template>
            </template>
          </i-select>
          <row>{{ v.desc }}</row>
        </FormItem>
      </template>
      <template v-else-if="v.type === 'radio'">
        <FormItem :label="v.label" :prop="v.name" :rules="v.rules" :key="k">
          <RadioGroup v-model="forms[v.name]" style="width:200px" :disabled="v.disabled">
            <Option :value="s.value" v-for="(s, sk) in v.dropList || []" :key="sk">{{ s.name }}</Option>
          </RadioGroup>
          <row>{{ v.desc }}</row>
        </FormItem>
      </template>
      <template v-else-if="v.type === 'check'">
        <FormItem :label="v.label" :prop="v.name" :rules="v.rules" :disabled="v.disabled" :key="k">
          <CheckGroup v-model="forms[v.name]" style="width:200px">
            <Option :value="s.value" v-for="(s, sk) in v.dropList || []" :key="sk">{{ s.name }}</Option>
          </CheckGroup>
          <row>{{ v.desc }}</row>
        </FormItem>
      </template>
      <template v-else-if="v.type === 'image'">
        <FormItem :label="v.label" :prop="v.name" :rules="v.rules" :key="k">
          <uploadFile v-model="forms[v.name]" type="image" :disabled="v.disabled"></uploadFile>
          <row>{{ v.desc }}</row>
        </FormItem>
      </template>
      <template v-else-if="v.type === 'audio'">
        <FormItem :label="v.label" :prop="v.name" :rules="v.rules" :key="k">
          <uploadFile v-model="forms[v.name]" type="audio" :disabled="v.disabled"></uploadFile>
          <row>{{ v.desc }}</row>
        </FormItem>
      </template>
      <template v-else-if="v.type === 'video'">
        <FormItem :label="v.label" :prop="v.name" :rules="v.rules" :key="k">
          <uploadFile v-model="forms[v.name]" type="video" :disabled="v.disabled"></uploadFile>
          <row>{{ v.desc }}</row>
        </FormItem>
      </template>
      <template v-else-if="v.type === 'avatar'">
        <FormItem :label="v.label" :prop="v.name" :rules="v.rules" :key="k">
          <uploadFile v-model="forms[v.name]" type="avatar" :disabled="v.disabled"></uploadFile>
          <row>{{ v.desc }}</row>
        </FormItem>
      </template>
      <template v-else-if="v.type === 'document'">
        <FormItem :label="v.label" :prop="v.name" :rules="v.rules" :key="k">
          <uploadFile v-model="forms[v.name]" type="document" :disabled="v.disabled"></uploadFile>
          <row>{{ v.desc }}</row>
        </FormItem>
      </template>
      <template v-else-if="v.type === 'file'">
        <FormItem :label="v.label" :prop="v.name" :rules="v.rules" :key="k">
          <uploadFile v-model="forms[v.name]" type="file" :disabled="v.disabled"></uploadFile>
          <row>{{ v.desc }}</row>
        </FormItem>
      </template>
      <template v-else-if="v.type === 'maparea'">
        <FormItem :label="v.label" :prop="v.name" :rules="v.rules" :key="k">
          <formMapArea v-model="forms[v.name]" type="map" :info="forms" :store_id="forms['store_id']" :keyword="v.keyword" :polygonStyle="v.polygonStyle" :disabled="v.disabled"></formMapArea>
          <row>{{ v.desc }}</row>
        </FormItem>
      </template>
      <template v-else-if="v.type === 'mapbox'">
        <FormItem :label="v.label" :prop="v.name" :rules="v.rules" :key="k">
          <formMapBox v-model="forms[v.name]" type="map" :keyword="v.keyword" :polygonStyle="v.polygonStyle" :disabled="v.disabled"></formMapBox>
          <row>{{ v.desc }}</row>
        </FormItem>
      </template>
      <template v-else-if="v.type === 'switch'">
        <FormItem :label="v.label" :prop="v.name" :rules="v.rules" :key="k">
          <i-switch v-model="forms[v.name]" :trueValue="v.trueValue" :falseValue="v.falseValue" :disabled="v.disabled" @on-change="v.onChange"></i-switch>
          <row>{{ v.desc }}</row>
        </FormItem>
      </template>
      <template v-else-if="v.type === 'textarea'">
        <FormItem :label="v.label" :prop="v.name" :rules="v.rules" :key="k">
          <Input v-model="forms[v.name]" type="textarea" :autosize="{ minRows: 3 }" :placeholder="v.placeholder || '请输入' + v.label" :disabled="v.disabled" />
          <row>{{ v.desc }}</row>
        </FormItem>
      </template>
      <template v-else-if="v.type === 'ueditor'">
        <FormItem :label="v.label" :prop="v.name" :rules="v.rules" :key="k">
          <formUeditor v-model="forms[v.name]" :disabled="v.disabled"></formUeditor>
          <row>{{ v.desc }}</row>
        </FormItem>
      </template>
      <template v-else-if="v.type === 'editor'">
        <FormItem :label="v.label" :prop="v.name" :rules="v.rules || []" :key="k">
          <formEditor v-model="forms[v.name]" :config="v.config || {}" :zIndex="v.zIndex" :disabled="v.disabled"></formEditor>
          <i-row>{{ v.desc || '' }}</i-row>
        </FormItem>
      </template>
      <template v-else-if="v.type === 'datetime' || v.type === 'daterange' || v.type === 'datetimerange' || v.type === 'date' || v.type === 'time' || v.type === 'year' || v.type === 'month'">
        <FormItem :label="v.label" :prop="v.name" :rules="v.rules" :key="k">
          <formDate v-model="forms[v.name]" :type="v.type" :options="v.options || {}" :format="v.format" :disabled="v.disabled" @on-change="v.onChange"></formDate>
          <row>{{ v.desc }}</row>
        </FormItem>
      </template>
      <template v-else-if="v.type === 'uid'">
        <FormItem :label="v.label" :prop="v.name" :rules="v.rules" :key="k">
          <popBox v-model="forms[v.name]" :name.sync="user_nick" :placeholder="v.placeholder || '请选择' + v.label" type="user" :query="v.query || {}" :disabled="v.disabled"></popBox>
          <row>{{ v.desc }}</row>
        </FormItem>
      </template>
      <template v-else>
        <FormItem :label="v.label" :prop="v.name" :rules="v.rules" :key="k">
          <Input v-model="forms[v.name]" :placeholder="v.placeholder || '请输入' + v.label" :disabled="v.disabled" />
          <row>{{ v.desc }}</row>
        </FormItem>
      </template>
    </template>
  </div>
</template>
<script>
export default {
  name: 'formBody',
  components: {},
  props: {
    mname: {
      type: String,
      default: '',
    },
    kv: {
      type: String,
      default: '',
    },
    url: {
      type: Object,
      default: {},
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    forms: {
      type: Object,
      default: {},
    },
    items: {
      type: Array,
      default: [],
    },
    rules: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      index: 1,
      menuName: 'base',
      sloading: false,
      tname: 'config',
      group: 'base',
      formItems: [],
      formRules: [],
    }
  },
  watch: {
    forms() {
      this.$forceUpdate()
    },
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      //
    },
    handleCancel() {
      this.$emit('on-cancel', true)
    },
    handleSubmit() {
      this.$emit('on-submit', true)
    },
  },
}
</script>
<<style lang="less" scoped></style>
