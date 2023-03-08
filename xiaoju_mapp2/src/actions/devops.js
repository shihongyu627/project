import * as DevopsTypes from "../constants/devopsTypes";

function getAuthInfo({auth_list, auth_info}) {
  console.log("store action getAuthInfo", {auth_list, auth_info});
  return {
    type: DevopsTypes.GET_AUTH_INFO,
    auth_list: auth_list,
    auth_info: auth_info
  };
}

export { getAuthInfo };
