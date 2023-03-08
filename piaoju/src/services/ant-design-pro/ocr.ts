import { urls } from './http';
import requrie from './requrie';

// 智能识别报关单
export const ocrCustoms = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onPostload(urls.ocrCustoms, 'POST', data, {
      toast: false,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};

// 智能识别报关单结果
export const ocrGetFileParseResult = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onPostload(urls.ocrGetFileParseResult, 'POST', data, {
      toast: false,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
// 阿里云OCR
export const ocrChange = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onPostload(urls.ocrChange, 'POST', data, {
      toast: true,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
// 腾讯云OCR
export const tencentOcr = async (params: any) => {
  const data = {
    ...params,
  };
  try {
    const res = await requrie.onPostload(urls.tencentOcr, 'POST', data, {
      toast: true,
      login: true,
      options: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
