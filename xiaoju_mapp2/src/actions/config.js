import * as ConfigTypes from "../constants/configTypes";

function setConfig(config) {
  console.log("store action setConfig", config);
  return {
    type: ConfigTypes.SET_CONFIG,
    config: config
  };
}

export { setConfig };
