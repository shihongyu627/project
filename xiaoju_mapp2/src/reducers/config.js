import * as ConfigTypes from "../constants/configTypes";

// 初始状态
const initState = {
  hot_mobile: "",
  share_third_url: "",
  share_login_img: "",
  share_login_url: "",
  share_login_show_img: "",
};

// 不同类别的事用不同的type处理
export default function config(state = initState, action) {
  let tstate = {};
  switch (action.type) {
    case ConfigTypes.SET_CONFIG:
      tstate = {
        ...action.config
      };
      return { ...state, ...tstate };
    default:
      return state;
  }
}
