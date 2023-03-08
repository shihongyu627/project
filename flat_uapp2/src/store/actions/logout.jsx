import * as LogoutType from "../constants/logoutType";

function loginSuccess(user) {
  console.log("store action loginsuccess", user);
  return {
    type: LogoutType.LOGIN_SUCCESS,
    user: user
  };
}

function logoutSuccess() {
  console.log("store action logoutsuccess", {});
  return {
    type: LogoutType.LOGOUT_SUCCESS,
    user: {}
  };
}

export { loginSuccess, logoutSuccess };
