import * as DevopsTypes from "../constants/devopsTypes";

// 初始状态
const initState = {
  suid: null,
  auth_list: [],
  auth_info: {}
};

// 不同类别的事用不同的type处理
export default function devops(state = initState, action) {
  let tstate = {};
  switch (action.type) {
    case DevopsTypes.GET_AUTH_INFO:
      tstate = {
        auth_list: action.auth_list,
        auth_info: action.auth_info
      };
      return { ...state, ...tstate };
    default:
      return state;
  }
}
