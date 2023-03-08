import * as UserTypes from '../constants/userTypes'

function loginSuccess(user) {
  console.log('store action loginsuccess', user)
  return {
    type: UserTypes.LOGIN_SUCCESS,
    user: user,
  }
}

function logoutSuccess() {
  console.log('store action logoutsuccess', {})
  return {
    type: UserTypes.LOGOUT_SUCCESS,
    user: {},
  }
}

export {loginSuccess, logoutSuccess}
