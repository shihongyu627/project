import React from 'react';
import { BaseInfo } from '@/components/base';

const Page: React.FC<any> = (props) => {
  const [datas] = React.useState<any>({
    title: 'cccc',
    place: 'shop_banner',
    image: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    form: {
      form2: 'xxxxb222',
    },
    list: [
      {
        name: '项目1',
        list1: 'xxxxa111',
        list2: 'xxxxb111',
      },
      {
        name: '项目2',
        list1: 'xxxxa222',
        list2: 'xxxxb222',
      },
    ],
    type: 'horizontal',
    switch: 1,
  });
  const [items] = React.useState<any>([
    { label: '基本信息', type: 'header' },
    {
      label: '表单样式',
      name: 'type',
      type: 'radio',
      // radioType: 'radio',
      options: [
        { label: '横排', value: 'horizontal' },
        { label: '竖排', value: 'vertical' },
        // { label: '行内', value: 'inline' },
      ],
    },
    {
      label: '标题',
      name: 'title',
      type: 'input',
    },
    {
      label: '位置',
      name: 'place',
      type: 'select',
      dropList: [
        { label: '首页轮播', value: 'home_banner' },
        { label: '商城轮播', value: 'shop_banner' },
      ],
    },
    {
      label: '封面图',
      name: 'image',
      type: 'image',
      desc: '建议图片宽高尺寸比例690*272像素及以上',
    },
    {
      label: '内容',
      name: 'content',
      type: 'textarea',
      fieldProps: { maxLength: 100 },
    },
    { label: '组合信息', type: 'header' },
    // {
    //   label: '组合字段-group',
    //   type: 'group',
    //   name: 'group',
    //   items: [
    //     { label: '组合1', name: 'group1', type: 'input' },
    //     { label: '组合2', name: 'group2', type: 'input' },
    //   ],
    // },
    // { label: '嵌套信息', desc: '', type: 'header' },
    // {
    //   label: '嵌套表单-object',
    //   type: 'object',
    //   name: 'form',
    //   items: [
    //     { label: '字段1', name: 'form1', type: 'input' },
    //     { label: '字段2', name: 'form2', type: 'input' },
    //   ],
    // },
    { label: '列表信息', desc: '', type: 'header' },
    { label: '列表类型', name: 'listtype', type: 'switch' },
    {
      label: '列表表单-array',
      type: 'array',
      name: 'list',
      showType: 'card',
      items: [
        { label: '字段1', name: 'list1', type: 'input' },
        { label: '字段2', name: 'list2', type: 'input' },
      ],
    },
    {
      label: '状态',
      name: 'status',
      type: 'switch',
      trueText: '开启',
      falseText: '关闭',
      trueValue: 1,
      falseValue: 0,
    },
    {
      label: '附加字段',
      name: 'extra',
      type: 'input',
    },
  ]);

  React.useEffect(() => {
    // console.log('query', props?.location?.query);
  }, [props?.location?.query]);

  return <BaseInfo mode={props.mode} title="" items={items} datas={datas} />;
};

export default Page;
