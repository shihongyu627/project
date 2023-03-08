import { combineReducers } from "redux";
import user from "./user";
import logout from "./logout";
import VConsole from "./VConsole";

export default combineReducers({
  user,
  logout,
  VConsole
});
