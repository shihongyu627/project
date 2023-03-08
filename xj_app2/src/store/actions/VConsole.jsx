import * as VConsoleType from "../constants/VConsoleType";

function setConsole(status) {
  console.log("store action setConsole", status);
  return {
    type: VConsoleType.SET_CONSOLE,
    VConsole: status,
    isVConsole: status,
  };
}

export { setConsole };
