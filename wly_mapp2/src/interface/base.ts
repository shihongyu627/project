export interface BaseProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export interface Pagination {
  total: number;
  size: number;
  index: number;
  length: number;
  beginIndex: number;
  endIndex: number;
}

export interface BaseResponse {
  code: string;
  msg: string;
  memo: string;
  data: any;
  pagination?: Pagination;
  result: number;
  success: boolean;
  requestId: string;
  linkTime: number;
}

export const Http_Result = {
  SUCCESS: 1,
  AUTH_INVALID: -7,
  AUTH_FREEZE: -2000,
  ERROR: -1,
  FAIL: -2
}
export const AUTH_ERROR = [
  Http_Result.AUTH_FREEZE,
  Http_Result.AUTH_INVALID,
]

export enum FormItemType {
  INPUT = 'input',
  PICKER = 'picker',
  PHOTO = 'photo',
  FILE = 'file',
  POSITION = 'position',
  SELECT = 'select',
}
