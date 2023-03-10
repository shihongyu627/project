import React from "react";
import { Scrollpicker } from "../Scrollpicker";
import { range, convert2Digit } from "../../common/utils";
export class Timepicker extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = (columnIndex, rowIndex) => {
      const { list, value } = this.state;
      const tmpValue = value.concat();
      tmpValue.splice(columnIndex, 1, rowIndex);
      const ret = tmpValue.map((valueItem, valueIndex) => {
        return list[valueIndex][valueItem].value;
      });
      this.props.onChange && this.props.onChange(ret.join(":"));
    };
    this.state = {
      ...this.init(props)
    };
  }
  init(props) {
    const { hourStep, minuteStep, secondStep, value, modeType } = props;
    const hourSum = 24;
    const minuteSum = 60;
    const secondSum = 60;
    if (hourSum % hourStep !== 0) {
      throw TypeError(`hourStep 参数 ${hourStep} 无效`);
    }
    if (minuteSum % minuteStep !== 0) {
      throw TypeError(`minuteStep 参数 ${minuteStep} 无效`);
    }
    if (secondSum % secondStep !== 0) {
      throw TypeError(`secondStep 参数 ${secondStep} 无效`);
    }
    const hours = range(hourSum / hourStep).map(item => {
      item = convert2Digit(item * hourStep);
      return {
        label: `${item} 时`,
        value: item
      };
    });
    const minutes = range(minuteSum / minuteStep).map(item => {
      item = convert2Digit(item * minuteStep);
      return {
        label: `${item} 分`,
        value: item
      };
    });
    const list = [hours, minutes];
    if (modeType == "second") {
      const seconds = range(secondSum / secondStep).map(item => {
        item = convert2Digit(item * secondStep);
        return {
          label: `${item} 秒`,
          value: item
        };
      });
      const list = [hours, minutes, seconds];
    }
    let valueArray = [];
    let valueRet = [];
    if (value) {
      valueArray = value.split(":");
    }
    // if (valueArray && valueArray.length && valueArray.length !== 3) {
    //     throw TypeError(`value 参数 ${value} 无效`);
    // }
    if (valueArray && valueArray.length) {
      valueArray.forEach((valueItem, valueIndex) => {
        const tag = list[valueIndex].some((targetItem, targetIndex) => {
          if (targetItem.value === valueItem) {
            valueRet[valueIndex] = targetIndex;
            return true;
          } else {
            return false;
          }
        });
        if (!tag) {
          throw TypeError(
            `value 参数${
              valueIndex === 0 ? "时" : valueIndex === 1 ? "分" : "秒"
            }字段 ${valueItem} 无效`
          );
        }
      });
    }
    const data = {
      value: valueRet,
      list
    };
    return data;
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({
        ...this.state,
        ...this.init(nextProps)
      });
    }
  }
  render() {
    const { value, list } = this.state;
    return React.createElement(
      Scrollpicker,
      Object.assign({}, this.props, {
        value: value,
        list: list,
        onChange: this.handleChange
      })
    );
  }
}
Timepicker.defaultProps = {
  ...Scrollpicker.defaultProps,
  hourStep: 1,
  minuteStep: 1,
  secondStep: 1
};
//# sourceMappingURL=index.js.map
