import { Select } from 'antd';
import React from 'react';
export type Props = {
  selectdata: any[]; //
  placeholder: any;
  style: any;
  changeSelect: any;
};
const { Option } = Select;

const SelectData: React.FC<Props> = (props: any) => {
  // console.log(props.selectdata);
  function onChange(value: any) {
    props.changeSelect(value);
  }

  function onSearch(val: any) {
    console.log('search:', val);
  }
  return (
    <Select
      allowClear
      showSearch
      placeholder={props.placeholder}
      optionFilterProp="children"
      style={props.style}
      onChange={onChange}
      onSearch={onSearch}
      filterOption={(input: any, option: any) =>
        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {(props?.selectdata || []).map((item: any, index: any) => {
        return (
          <Option value={item.id} key={index}>
            {item.name}
          </Option>
        );
      })}
    </Select>
  );
};

export default SelectData;
