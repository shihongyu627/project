import * as UserTypes from "../constants/userTypes";

// 初始状态
const initState = {
  isLogin: false,
  token: "",
  uid: null,
  username: "",
  user_nick: "",
  user_head: "",
  user_mobile: "",
  balance: 0,
  level: 0,
  is_operator: 0,
  real_status: 0,
  real_info: {},
  user_type: ""
};

// 不同类别的事用不同的type处理
export default function user(state = initState, action) {
  let tstate = {};
  switch (action.type) {
    case UserTypes.LOGIN_SUCCESS:
      tstate = {
        isLogin: true,
        ...action.user
      };
      return { ...state, ...tstate };
    case UserTypes.LOGOUT_SUCCESS:
      tstate = {
        isLogin: false,
        ...initState
      };
      return { ...state, ...tstate };
    default:
      return state;
  }
}
