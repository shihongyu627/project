import { combineReducers } from "redux";
import config from "./config";
import user from "./user";
import device from "./device";
import devops from "./devops";

export default combineReducers({
  config,
  user,
  device,
  devops
});
