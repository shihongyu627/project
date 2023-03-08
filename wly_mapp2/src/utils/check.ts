import {Toast} from '@/utils/toast';
import { FormItemType } from '@/interface/base';

export const checkInputEmpty = function(
  value: any,
  name?: string,
  isToast = true,
  itemType?: FormItemType,
) {
  if (!value && value !== 0) {
    const toast = `${
      itemType === FormItemType.INPUT ? '请输入' : '请选择'
    }${name}`;
    isToast && Toast.info(toast);
    return false;
  } else {
    return true;
  }
};
export const checkLength = function(
  value: any,
  number: number | number[],
  name?: string,
  isToast = true,
) {
  const { length } = value || {};
  if (typeof number === 'object') {
    const min = number[0];
    const max = number[1];
    if (length < min || length > max) {
      const toast = `${name}字符长度应为${min}-${max}`;
      isToast && Toast.info(toast);
      return false;
    } else {
      return true;
    }
  } else if (length > number) {
    const toast = `${name}不超过 ${number} 字符`;
    isToast && Toast.info(toast);
    return false;
  } else {
    return true;
  }
};

export const phoneReg = /^\d{11}$/;
export const passwordReg = /(?!^(\d+|[a-zA-Z]+|[.',~!@#$%^&*?]+)$)^[\w.',~!@#$%^&*?]{6,18}/;
export const telephoneReg = /^((\d{1,4})|(\d{1,4}-|s))?\d{4,32}$/;
export const emailReg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
export const idCardReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
export const cardNoReg = /^[a-zA-Z\d]*$/;

export const checkReg = function(
  value: any,
  isToast = true,
  reg: any,
  name?: string,
) {
  const isRight = reg.test(value);
  if (!isRight && isToast) {
    Toast.info(`请输入正确的${name}`);
  }
  return isRight;
};

export const checkInteger = function(
  value: any,
  isToast = true,
  name?: string,
) {
  const isRight = !value.toString().includes('.') && Number(value) > 0;
  if (!isRight && isToast) {
    Toast.info(`${name}应该为正整数`);
  }
  return isRight;
};
export const checkPositive = function(
  value: any,
  isToast = true,
  name?: string,
) {
  // eslint-disable-next-line no-restricted-globals
  if (isNaN(value)) {
    if (isToast) {
      Toast.info(`${name}应该为数字`);
    }
    return false;
  }
  const isRight = Number(value) > 0;
  if (!isRight && isToast) {
    Toast.info(`${name}应该大于0`);
  }
  return isRight;
};
export enum CheckStringType {
  LENGTH = 'length',
  EMPTY = 'empty',
  INTEGER = 'integer',
  POSITIVE = 'positive',
  REG = 'reg',
  CUSTOM = 'custom',
}

export interface checkParamsItem {
  value?: any;
  name?: string;
  type?: CheckStringType;
  number?: number | number[];
  isToast?: boolean;
  ableEmpty?: boolean; // 是否选填
  itemType?: FormItemType;
  pattern?: any;
  custom?: (params: checkParamsItem) => boolean;
}
export default function checkParams(params: checkParamsItem[]): boolean {
  let isRight = true;
  for (let i = 0; i < params.length; i++) {
    const param = params[i];
    const {
      name,
      number = 32,
      value,
      isToast = true,
      ableEmpty = false,
      type = 'length',
      itemType,
      pattern,
      custom,
    } = param;
    //  必填是先判断空
    if (!ableEmpty) {
      isRight = checkInputEmpty(value, name, isToast, itemType);
      if (!isRight) {
        break;
      }
    }
    // 必填判断或者选填非空判断
    if (type === CheckStringType.EMPTY) {
      // 必填不为空,且无其他判断/选填无其他判断
      isRight = true;
    } else if (type === CheckStringType.LENGTH) {
      isRight =
        (ableEmpty && !value) ||
        (!!number && checkLength(value, number, name, isToast));
    } else if (type === CheckStringType.INTEGER) {
      isRight = (ableEmpty && !value) || checkInteger(value, isToast, name);
    } else if (type === CheckStringType.POSITIVE) {
      isRight = (ableEmpty && !value) || checkPositive(value, isToast, name);
    } else if (type === CheckStringType.REG) {
      isRight =
        (ableEmpty && !value) ||
        (!!type && checkReg(value, isToast, pattern, name));
    } else if (type === CheckStringType.CUSTOM && custom) {
      isRight = (ableEmpty && !value) || custom(param);
    }
    if (!isRight) {
      break;
    }
  }
  return isRight;
}
