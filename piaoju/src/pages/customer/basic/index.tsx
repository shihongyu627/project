import {
  PjClientadd,
  adminSelectDetails,
  PjClientedit,
  // pjComboLogadd,
  pjComboNoPageList,
  pjUserNoPageList,
  checkIsName,
  checkIdName,
} from '@/services/ant-design-pro/customer';
import { BaseEdit, findIndexItems } from '@kafudev/ui-kit';
import moment from 'moment';
import React from 'react';
import { history } from 'umi';

const Page: React.FC<any> = (props) => {
  const [forms, setForms] = React.useState<any>({});
  const [items] = React.useState<any>([
    { label: '企业信息', desc: '', type: 'header' },
    {
      label: '企业名称',
      name: 'name',
      type: 'input',
      width: 'sm',
      placeholder: '请输入企业名称',
      rules: [{ required: true, trigger: 'blur' }],
    },
    {
      label: '客户类型',
      name: 'clientType',
      type: 'radio',
      options: [
        { label: '贸易型企业', value: 1 },
        { label: '生产型企业', value: 2 },
      ],
      rules: [{ required: true, trigger: 'blur', type: 'number' }],
    },
    {
      label: '实际经营地址',
      name: 'address',
      type: 'input',
      placeholder: '请输入实际经营地址',
    },
    {
      label: '国税等级',
      name: 'nationalLevel',
      type: 'radio',
      options: [
        { label: 'A类企业', value: 1 },
        { label: 'B类企业', value: 2 },
        { label: 'C类企业', value: 3 },
      ],
      rules: [{ required: true, trigger: 'blur', type: 'number' }],
    },
    {
      label: '联系人',
      name: 'contacts',
      type: 'input',
      placeholder: '请输入联系人',
    },
    {
      label: '海关代码',
      name: 'customsCode',
      type: 'input',
      placeholder: '请输入海关代码',
    },
    {
      label: '联系电话',
      name: 'phone',
      type: 'input',
      placeholder: '请输入联系电话',
    },
    {
      label: '纳税人认定时间',
      name: 'taxpayerTime',
      type: 'date',
      fieldProps: {
        format: 'YYYY-MM-DD',
      },
      placeholder: '请选择认定时间',
    },
    {
      label: '主营业务',
      name: 'business',
      type: 'textarea',
      // fieldProps: { maxLength: 100 },
      // rules: [{ type: 'string', max: 100, message: '超过最大长度' }],
    },
    { label: '空', name: 'empty', type: 'empty' },
    {
      label: '营业执照',
      name: 'licenseUrl',
      type: 'image',
      // desc: '建议图片宽高尺寸比例690*272像素及以上',
      rules: [{ required: false, trigger: 'blur' }],
      actionUrl: '/admin/sys/common/upload',
      onResult: async (res: any) => {
        if (res?.code == 200) {
          return { url: res.result };
        }
        return {};
      },
    },
    { label: '空', name: 'empty', type: 'empty' },
    {
      label: '经营者备案表',
      name: 'filingUrl',
      type: 'image',
      // desc: '建议图片宽高尺寸比例690*272像素及以上',
      rules: [{ required: false, trigger: 'blur' }],
      actionUrl: '/admin/sys/common/upload',
      onResult: async (res: any) => {
        if (res?.code == 200) {
          return { url: res.result };
        }
        return {};
      },
    },
    { label: '空', name: 'empty', type: 'empty' },
    {
      label: '其他',
      name: 'otherUrl',
      type: 'image',
      max: 10,
      fieldProps: {
        multiple: true,
      },
      // desc: '建议图片宽高尺寸比例690*272像素及以上',
      actionUrl: '/admin/sys/common/upload',
      onResult: async (res: any) => {
        if (res?.code == 200) {
          return { url: res.result };
        }
        return {};
      },
    },
    { label: '开票信息', desc: '', type: 'header', borderColor: '' },
    {
      label: '名称',
      name: 'billName',
      type: 'input',
      placeholder: '请输入名称',
    },
    {
      label: '纳税人识别号',
      name: 'billIdentity',
      type: 'input',
      placeholder: '请输入纳税人识别号',
      rules: [{ required: true, trigger: 'blur' }],
    },
    {
      label: '地址',
      name: 'billAddress',
      type: 'input',
      placeholder: '请输入地址',
    },
    {
      label: '电话',
      name: 'billCall',
      type: 'input',
      placeholder: '请输入电话',
    },
    {
      label: '开户行',
      name: 'billBank',
      type: 'input',
      placeholder: '请输入开户行',
    },
    {
      label: '账号',
      name: 'billAccount',
      type: 'input',
      placeholder: '请输入账号',
    },
    {
      label: '发票邮寄地址',
      name: 'billMailing',
      type: 'input',
      placeholder: '请输入发票邮寄地址',
    },
    {
      label: '收件人名称',
      name: 'billRecipientName',
      type: 'input',
      placeholder: '请输入收件人名称',
    },
    {
      label: '收件人电话',
      name: 'billPhone',
      type: 'input',
      placeholder: '请输入收件人电话',
    },
    { label: '套餐服务', desc: '', type: 'header' },
    {
      label: '选择套餐',
      name: 'combo',
      type: 'select',
      request: async function () {
        const result: any = await pjComboNoPageList();
        const columnsArr: any[] = result.result;
        const res: any = [];
        columnsArr.map((item) => {
          const temp = {
            label: item.name,
            value: item.comboType,
          };
          res.push(temp);
        });
        return res;
      },
      placeholder: '请选择套餐',
      rules: [{ required: true, trigger: 'blur', type: 'select' }],
    },
    {
      label: '套餐合作时间',
      name: 'cooperation_time',
      type: 'dateRange',
      placeholder: ['请选择套餐合作开始时间', '请选择套餐合作结束时间'],
    },
    {
      label: '套餐折扣',
      name: 'discount',
      type: 'digit',
      fieldProps: {
        min: 0,
        max: 100,
      },
      placeholder: '请输入套餐折扣',
    },
    {
      label: '服务开始时间',
      name: 'beginTime',
      type: 'date',
      placeholder: '请选择服务开始时间',
    },
    {
      label: '分配客服',
      name: 'allots',
      type: 'select',
      fieldProps: {
        mode: 'multiple',
      },
      request: async function () {
        const result: any = await pjUserNoPageList();
        const columnsArr: any[] = result.result;
        const res: any = [];
        columnsArr.map((item) => {
          const temp = {
            label: item.realname,
            value: item.id,
          };
          res.push(temp);
        });
        return res;
      },
      placeholder: '请选择客服',
    },
    { label: '空', name: 'empty', type: 'empty' },
    {
      label: '备注',
      name: 'remark',
      type: 'textarea',
      // fieldProps: { maxLength: 100 },
      // rules: [{ type: 'string', max: 100, message: '超过最大长度' }],
    },
  ]);

  React.useEffect(() => {
    // console.log('query', props?.location?.query);
    if (props?.location?.query.action === 'edit') {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      getData(props?.location?.query.id);
    }
    // if (props?.location?.query.action === 'edit') {
    //   items[findIndexItems('combo', items)].disabled = 'disabled';
    //   items[findIndexItems('allots', items)].disabled = 'disabled';
    //   items[findIndexItems('cooperation_time', items)].fieldProps = { disabled: true };
    // }
  }, [props?.location?.query, items]);

  const getData = async (id: any) => {
    if (id) {
      const result: any = await adminSelectDetails(id);
      // console.log('initFormsresult:', result);
      if (result.result) {
        items[findIndexItems('combo', items)].disabled = 'disabled';
        items[findIndexItems('allots', items)].disabled = 'disabled';
        items[findIndexItems('cooperation_time', items)].fieldProps = { disabled: true };
        const formresult = result.result;
        if (formresult.allot) {
          const columnsArr = formresult.allot;
          const chars = columnsArr.split(',');
          formresult.allots = chars;
        }
        if (formresult.cooperationBeginTime && formresult.cooperationEndTime) {
          const cooperation_time = [formresult.cooperationBeginTime, formresult.cooperationEndTime];
          formresult.cooperation_time = cooperation_time;
        }
        // console.log('initFormsresult:', formresult);
        setForms(formresult);
      } else {
        const formresult = {};
        setForms(formresult);
      }
    }
  };

  // 表单提交
  const onSubmit = async (values: any) => {
    // 合并接口数据和表单数据
    const value = Object.assign({}, forms, values);
    // console.log('onSubmit:', value);
    if (value.allots) {
      const str = value.allots.join(',');
      value.allot = str;
      delete value.allots;
    }
    if (value.cooperation_time) {
      const time1 = moment(value.cooperation_time[0]).format('YYYY-MM-DD');
      value.cooperationBeginTime = time1;
      const time2 = moment(value.cooperation_time[1]).format('YYYY-MM-DD');
      value.cooperationEndTime = time2;
      delete value.cooperation_time;
    }

    if (value.id) {
      const dd: any = {};
      dd.name = value.name;
      dd.id = value.id;
      const rescheckIdName: any = await checkIdName(dd);
      // console.log('checkIdName', rescheckIdName);
      if (rescheckIdName.code === 200) {
        const res: any = await PjClientedit(value);
        // console.log('onSubmit:', res);
        if (res.code == 200) {
          history.go(-1);
        }
      }
    } else {
      const dd: any = {};
      dd.name = value.name;
      const rescheckIsName: any = await checkIsName(dd);
      // console.log('checkIsName', rescheckIsName);
      if (rescheckIsName.code === 200) {
        value.tenantId = props?.location?.query.id;
        const res: any = await PjClientadd(value);
        // console.log('onSubmit:', res);
        if (res.code == 200) {
          // const pjComboLog: any = {};
          // pjComboLog.clientId = res.clientId;
          // pjComboLog.cooperationBeginTime = value.cooperationBeginTime;
          // pjComboLog.cooperationEndTime = value.cooperationEndTime;
          // pjComboLog.comboType = value.combo;
          // const xx: any = await pjComboLogadd(pjComboLog);
          // if (xx.code == 200) {
          history.go(-1);
          // }
        }
      }
    }
  };
  //路由校验及获取
  const urlDatas = `${localStorage.getItem('auths')}`;
  const urlData = JSON.parse(urlDatas);
  const check = (url: any) => {
    if (!urlData) {
      return false;
    }
    return urlData.some((item: any) => item.url == url);
  };

  // 表单字段变化
  const onValuesChange = async (changedValues: any, values: any) => {
    console.log('onValuesChange:', changedValues, values);
    for (const key in changedValues) {
      if (Object.prototype.hasOwnProperty.call(changedValues, key)) {
        const value = changedValues[key];
        // console.log('onValuesChange:', key, value);
        if (key === 'name') {
          const dd: any = {};
          dd.name = value;
          const res: any = await checkIsName(dd);
          console.log('checkIsName', res);
        }
        switch (key) {
          case 'status':
            // if (value == true) {
            //   items[formUtils.findIndexItems('extra', items)].type = 'empty';
            //   setItems([...items]);
            // } else {
            //   items[formUtils.findIndexItems('extra', items)].type = 'input';
            //   setItems([...items]);
            // }
            break;
          default:
            break;
        }
      }
    }
  };

  return (
    <BaseEdit
      pageProps={{
        title: '租户资料',
      }}
      {...props}
      mode={'page'}
      rowCol={2}
      action={props.action || props?.location?.query?.action}
      items={items}
      values={forms}
      onValuesChange={onValuesChange}
      submitter={
        check('/ticket/tenant/basic/commit') === false
          ? {
              render() {
                return [];
              },
            }
          : {}
      }
      onSubmit={onSubmit}
    />
  );
};

export default Page;
