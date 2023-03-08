import * as VConsoleTypes from "../actions/VConsole";

// 初始状态
const initState = {
  isVConsole: false,
  VConsole: false
};

// 不同类别的事用不同的type处理
export default function VConsole(state = initState, action) {
  let tstate = {};
  tstate = {
    ...action
  };
  return { ...state, ...tstate };
}
