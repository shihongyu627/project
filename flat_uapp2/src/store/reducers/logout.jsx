import * as LogoutType from "../actions/logout";

// 初始状态
const initState = {
  isLogin: false,
  uid: null,
  username: "",
  user_nick: "",
  user_head: "",
  user_mobile: "",
  balance: 0,
  level: 0
};

// 不同类别的事用不同的type处理
export default function user(state = initState, action) {
  let tstate = {};
  return { ...state };
}
