import { Component } from "react";

import { Picker, View } from "@tarojs/components";
import "./index.less";

export default class Index extends Component {
  state = {
    rangeList: [[], [], [], []],
    value: "",
    dateDetails: ["年", "月", "时"],
    mode: "datetime",
    rangeValue: [],
    dateTimeVal: "",
    monthAddress: 1
  };
  componentDidMount() {
    this._initDateTimePickerFn();
  }
  componentDidShow() {}
  /**
   * 初始化时间选择器
   */
  _initDateTimePickerFn() {
    try {
      const { value, mode } = this.state;
      //====获取到当前时间===
      let showTimeValue = this._validateShowTime(value, mode);

      // ====获取年份====
      const currentYear = showTimeValue.substring(
        0,
        showTimeValue.indexOf("-")
      );
      // ====获取月份====
      const currentMouth = showTimeValue.split(" ")[0].split("-")[1];
      const yearList = this._gotDateTimeList({
        _start: Number(currentYear),
        _end: Number(currentYear) + 100,
        _type: 0
      });

      // ====获取月份===
      const monthList = this._gotDateTimeList({
        _start: Number(currentMouth),
        _end: 12,
        _type: 1
      });
      let myDate = new Date();
      let day = myDate.getDate(); //获取当前日(1-31)
      let hours = myDate.getHours(); //获取当前小时数(0-23)
      // let minute = myDate.getMinutes(); //获取当前分钟(0-59)
      //====获取天数===
      const dayList = this._gotDayList(currentYear, currentMouth, day);
      // ====获取小时===
      const hourList = this._gotDateTimeList({
        _start: Number(hours),
        _end: 23,
        _type: 2
      });
      // ====获取分钟===
      // const munithList = this._gotDateTimeList({
      //   _start: Number(minute),
      //   _end: 59,
      //   _type: 3
      // });
      let rangeList = new Array();
      rangeList.push(yearList);
      rangeList.push(monthList);
      rangeList.push(dayList);
      rangeList.push(hourList);
      // rangeList.push(munithList);
      mode === "datetime";
      this.setState(
        {
          rangeList
        },
        () => {
          this._echoDateTime(showTimeValue); // 初始化时间显示
        }
      );
    } catch (err) {
      console.log(err);
    }
  }
  /**
   * 验证显示的时间是否合法
   * @param {Number} _value 要验证的时间
   * @param {Number} _mode  选择器类型
   */
  _validateShowTime(_value, _mode) {
    let currentTime = this.formatTime(new Date()).replace(/\//g, "-");
    let showTimeValue = _value.trim() || currentTime;
    const secondReg = /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/;
    const munithReg = /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}$/;
    if (_mode === "dateminute") {
      // yyyy-MM-dd HH:mm
      // 验证是否合法
      secondReg.test(showTimeValue) &&
        (showTimeValue = showTimeValue.substring(
          0,
          showTimeValue.lastIndexOf(":")
        ));
      munithReg.test(showTimeValue) ||
        (showTimeValue = currentTime.substring(
          0,
          currentTime.lastIndexOf(":")
        ));
    } else {
      // yyyy-MM-dd HH:mm:ss
      munithReg.test(showTimeValue) && (showTimeValue += ":00");
      secondReg.test(showTimeValue) || (showTimeValue = currentTime);
    }
    return showTimeValue;
  }

  /**
   * 获取年份、月份、小时、分钟、秒
   * @param {Number} _start 开始值
   * @param {Number} _end   结束值
   * @param {Number} _type  类型
   */
  _gotDateTimeList({ _start, _end, _type }) {
    let resultDataList = new Array();
    for (let i = _start; i <= _end; i++) {
      resultDataList.push(this._addZore(i) + this.state.dateDetails[_type]);
    }
    return resultDataList;
  }
  /**
   * 获取天数
   * @param {Number} _year  年份
   * @param {Number} _mouth  月份
   * @param {Number} day  当前月份天数
   */
  _gotDayList(_year, _mouth, day) {
    let now = new Date(_year, _mouth, 0);
    const dayLength = now.getDate();
    let dayList = new Array();
    for (let i = Number(day); i <= dayLength; i++) {
      dayList.push(this._addZore(i) + "日");
    }
    return dayList;
  }
  /**
   * 补零
   * @param {Number} _num  数值
   */
  _addZore(_num) {
    return _num < 10 ? "0" + _num : _num.toString();
  }
  /**
   * 回显时间
   * @param {Number} _showTimeValue  初始化时要显示的时间
   */
  _echoDateTime(_showTimeValue) {
    console.log(_showTimeValue);
    const rangeList = this.state.rangeList || [];
    let rangeValue = new Array();
    const list = _showTimeValue.split(/[\-|\:|]/);
    console.log(list);
    console.log(rangeList);
    list.map((el, index) => {
      rangeList[index] &&
        rangeList[index].map((item, itemIndex) => {
          item.indexOf(el) !== -1 && rangeValue.push(itemIndex);
        });
    });
    this.setState({
      rangeValue
    });
  }
  /**
   * 点击确定时触发的回调函数
   * @param {Number} ev
   */
  selectChangeFn = ev => {
    const selectValues = ev.detail.value;
    const rangeList = this.state.rangeList;
    let dateTime = "";
    selectValues.map((el, index) => {
      dateTime += rangeList[index][el].substring(
        0,
        rangeList[index][el].length - 1
      );
      if (index == 0 || index == 1) {
        dateTime += "-";
      } else if (
        index == 3 ||
        (index == 4 && index != selectValues.length - 1)
      ) {
        dateTime += ":";
      } else if (index == 2 && index != selectValues.length - 1) {
        dateTime += " ";
      }
    });
    dateTime += "00:00";
    // ====触发父组件把值传递给父组件====
    // this.triggerEvent("change", { value: dateTime });
    this.setState(
      {
        dateTimeVal: dateTime
      },
      () => {
        this.props.getDateTime(dateTime, this.props.typeInfo);
      }
    );
  };
  /**
   *  当具体的一项的值发生改变时触发
   *  @param {Number} ev
   */
  selectColumnChangeFn = ev => {
    const { column, value } = ev.detail;
    let { rangeList, rangeValue, monthAddress, yaerAddress } = this.state;
    let selectValue = Number(
      rangeList[column][value].substring(0, rangeList[column][value].length - 1)
    );
    let myDate = new Date();
    let nowYear = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
    let nowMonth = myDate.getMonth() + 1; ///获取当前月份
    let hours = myDate.getHours(); //获取当前小时数(0-23)
    // let minute = myDate.getMinutes(); //获取当前分钟数(0-59)
    let day = myDate.getDate(); //获取当前日(1-31)
    if (!yaerAddress) {
      yaerAddress = nowYear;
    }
    if (column === 0) {
      // 改变月份
      const currentYear = Number(
        rangeList[0][rangeValue[0]].substring(
          0,
          rangeList[0][rangeValue[0]].length - 1
        )
      );
      // ====判断是否是当前日期，非当前日期，时间回到正常数据===
      if (nowYear != selectValue) {
        day = 1;
        nowMonth = 1;
        hours = 0;
        // minute = 0;
      }
      const dayList = this._gotDayList(currentYear, monthAddress, day);
      // ====获取月份===
      const monthList = this._gotDateTimeList({
        _start: Number(nowMonth),
        _end: 12,
        _type: 1
      });
      // ====获取小时===
      const hourList = this._gotDateTimeList({
        _start: Number(hours),
        _end: 23,
        _type: 2
      });
      // // ====获取分钟===
      // const munithList = this._gotDateTimeList({
      //   _start: Number(minute),
      //   _end: 59,
      //   _type: 3
      // });
      // ====判断闰年===
      if (
        (selectValue % 4 == 0 && selectValue % 100 !== 0) ||
        selectValue % 400 == 0
      ) {
        if (monthAddress == 2) {
          dayList.push("29日");
        }
      }
      rangeList[column + 2] = dayList;
      rangeList[column + 1] = monthList;
      rangeList[column + 3] = hourList;
      // rangeList[column + 4] = munithList;
      this.setState({
        yaerAddress: selectValue
      });
    }
    if (column === 1) {
      // 改变月份
      const currentYear = Number(
        rangeList[0][rangeValue[0]].substring(
          0,
          rangeList[0][rangeValue[0]].length - 1
        )
      );
      // ====判断是否是当前日期，非当前日期，时间回到正常数据===
      if (yaerAddress == nowYear && nowMonth == selectValue) {
        day = day;
        hours = hours;
        // minute = minute;
      } else {
        day = 1;
        hours = 0;
        // minute = 0;
      }
      // ====获取小时==
      const hourList = this._gotDateTimeList({
        _start: Number(hours),
        _end: 23,
        _type: 2
      });
      // // ====获取分钟===
      // const munithList = this._gotDateTimeList({
      //   _start: Number(minute),
      //   _end: 59,
      //   _type: 3
      // });
      const dayList = this._gotDayList(currentYear, selectValue, day);
      // ====判断闰年===
      if (
        (yaerAddress % 4 == 0 && yaerAddress % 100 !== 0) ||
        yaerAddress % 400 == 0
      ) {
        if (selectValue == 2) {
          dayList.push("29日");
        }
      }
      rangeList[column + 1] = dayList;
      rangeList[column + 2] = hourList;
      // rangeList[column + 3] = munithList;
      this.setState({
        monthAddress: selectValue
      });
    }
    if (column === 2) {
      // 改变天
      // ====判断是否是当前日期，非当前日期，时间回到正常数据===
      if (yaerAddress == nowYear && selectValue == day) {
        hours = hours;
        // minute = minute;
      } else {
        hours = 0;
        // minute = 0;
      }
      // ====获取小时===
      const hourList = this._gotDateTimeList({
        _start: Number(hours),
        _end: 23,
        _type: 2
      });
      // // ====获取分钟===
      // const munithList = this._gotDateTimeList({
      //   _start: Number(minute),
      //   _end: 59,
      //   _type: 3
      // });
      rangeList[column + 1] = hourList;
      // rangeList[column + 2] = munithList;
    }
    if (column === 3) {
      // 改变小时
      // ====判断是否是当前日期，非当前日期，时间回到正常数据===
      if (yaerAddress == nowYear && selectValue == hours) {
        // minute = minute;
      } else {
        // minute = 0;
      }
      // ====获取分钟===
      // const munithList = this._gotDateTimeList({
      //   _start: Number(minute),
      //   _end: 59,
      //   _type: 3
      // });
      // rangeList[column + 1] = munithList;
    }
    this.setState({
      rangeList
    });
  };

  // =====格式化日期===
  formatTime = date => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    return (
      [year, month, day].map(this.formatNumber).join("/") +
      " " +
      [hour, minute, second].map(this.formatNumber).join(":")
    );
  };

  formatNumber = n => {
    n = n.toString();
    return n[1] ? n : "0" + n;
  };

  render() {
    const { is_back, title, onClick = () => {} } = this.props;
    let { dateTimeVal, rangeList } = this.state;

    return (
      <Picker
        mode="multiSelector"
        range={rangeList}
        onChange={this.selectChangeFn}
        onColumnChange={this.selectColumnChangeFn}
      >
        <View className="picker">{dateTimeVal || title || "请选择"}</View>
      </Picker>
    );
  }
}
