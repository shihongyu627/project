// @ts-ignore
/* eslint-disable */
import { message, notification } from 'antd';
import { history, request } from 'umi';
export default class http {
  static async onPostload(
    url: any,
    method: any,
    params: any,
    config = {
      toast: false,
      login: false,
      options: {},
    },
  ) {
    try {
      let res: any = await request<any>(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Tenant-Token': `${localStorage.getItem('token')}`,
        },
        data: {
          ...params,
        },
        skipErrorHandler: true,
        ...(config.options || {}),
      });
      if (res.code === 200 || res.code === 0) {
        if (config.toast && config.login) {
          message.success(res.message || res.msg || '操作成功');
        }
        return res;
      } else {
        if (config.toast) {
          message.destroy();
          message.error(res.message || res.msg || '操作异常');
        }
        if (res.code == 401) {
          localStorage.removeItem('token');
          // localStorage.clear();
          const params = `${localStorage.getItem('search')}`;
          const datas = JSON.parse(params);
          history.push(`/user/login` + datas);
          return res;
        }
        return res;
      }
    } catch (error: any) {
      message.destroy();
      message.error(error.message || error.msg || '操作异常');
      return error;
    }
  }
  static async onGetload(
    url: any,
    method: any,
    params: any,
    config = {
      toast: false,
      login: false,
      options: {},
    },
  ) {
    try {
      let res: any = await request<any>(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Tenant-Token': `${localStorage.getItem('token')}`,
        },
        params: {
          ...params,
        },
        skipErrorHandler: true,
        ...(config.options || {}),
      });
      if (res.code === 0 || res.code === 200) {
        if (config.toast && config.login) {
          message.success(res.message || res.msg || '成功');
        }
        return res;
      } else {
        message.destroy();
        message.error(res.message || res.msg || '操作异常');
        notification.destroy();
        if (res.code === 401) {
          localStorage.removeItem('token');
          // localStorage.clear();
          const params = `${localStorage.getItem('search')}`;
          const datas = JSON.parse(params);
          history.push(`/user/login` + datas);
          return res;
        }
        return res;
      }
    } catch (error: any) {
      message.destroy();
      message.error(error.message || error.msg || '操作异常');
      return error;
    }
  }
  static async onExportXls(
    url: any,
    method: any,
    params: any,
    config = {
      toast: false,
      login: false,
      options: {},
    },
  ) {
    try {
      let res = await request<any>(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Tenant-Token': `${localStorage.getItem('token')}`,
        },
        params: {
          ...params,
        },
        skipErrorHandler: true,
        ...(config.options || {}),
      });
      return res;
    } catch (error) {
      return error;
    }
  }
  static async onArrload(
    url: any,
    method: any,
    params: any,
    config = {
      toast: false,
      login: false,
      options: {},
    },
  ) {
    try {
      let res: any = await request<any>(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Tenant-Token': `${localStorage.getItem('token')}`,
        },

        data: params,
        skipErrorHandler: true,
        ...(config.options || {}),
      });
      if (res.code === 200 || res.code === 0) {
        if (config.toast && config.login) {
          message.success(res.message || res.msg || '操作成功');
        }
        return res;
      } else {
        if (config.toast) {
          message.destroy();
          message.error(res.message || res.msg || '操作异常');
        }
        if (res.code === 401) {
          localStorage.removeItem('token');
          // localStorage.clear();
          const params = `${localStorage.getItem('search')}`;
          const datas = JSON.parse(params);
          history.push(`/user/login` + datas);
          return res;
        }
        return res;
      }
    } catch (error: any) {
      message.destroy();
      message.error(error.message || error.msg || '操作异常');
      return error;
    }
  }
  static async onArrPost(
    url: any,
    method: any,
    params: any,
    config = {
      toast: false,
      login: false,
      options: {},
    },
  ) {
    try {
      let res: any = await request<any>(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Tenant-Token': `${localStorage.getItem('token')}`,
        },

        data: params,
        skipErrorHandler: true,
        ...(config.options || {}),
      });
      if (res.code === 200 || res.code === 0) {
        if (config.toast && config.login) {
          message.success(res.message || res.msg || '操作成功');
        }
        return res;
      } else {
        if (config.toast) {
          message.destroy();
          message.error(res.message || res.msg || '操作异常');
        }
        if (res.code === 401) {
          localStorage.removeItem('token');
          // localStorage.clear();
          const params = `${localStorage.getItem('search')}`;
          const datas = JSON.parse(params);
          history.push(`/user/login` + datas);
          return res;
        }
        return res;
      }
    } catch (error: any) {
      message.destroy();
      message.error(error.message || error.msg || '操作异常');
      return error;
    }
  }
  static async upload(
    url: any,
    method: any,
    params: any,
    config = {
      toast: false,
      login: false,
      options: {},
    },
  ) {
    try {
      let res: any = await request<any>(url, {
        method: method,
        headers: {
          // Accept: '*/*',
          // 'Content-Type': 'multipart/form-data',
          'Tenant-Token': `${localStorage.getItem('token')}`,
        },

        data: params,
        skipErrorHandler: true,
        ...(config.options || {}),
      });
      if (res.code === 200 || res.code === 0) {
        if (config.toast && config.login) {
          message.success(res.message || res.msg || '操作成功');
        }
        return res;
      } else {
        if (config.toast) {
          message.destroy();
          message.error(res.message || res.msg || '操作异常');
        }
        if (res.code === 401) {
          localStorage.removeItem('token');
          // localStorage.clear();
          const params = `${localStorage.getItem('search')}`;
          const datas = JSON.parse(params);
          history.push(`/user/login` + datas);
          return res;
        }
        return res;
      }
    } catch (error: any) {
      message.destroy();
      message.error(error.message || error.msg || '操作异常');
      return error;
    }
  }
  static async onupload(
    url: any,
    method: any,
    params: any,
    config = {
      toast: false,
      login: false,
      options: {},
    },
  ) {
    try {
      let res: any = await request<any>(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Tenant-Token': `${localStorage.getItem('token')}`,
        },
        params: {
          ...params,
        },
        skipErrorHandler: true,
        ...(config.options || {}),
      });
      res.code = 200;
      if (res.code === 0 || res.code === 200) {
        if (config.toast && config.login) {
          message.success(res.message || res.msg || '成功');
        }
        return res;
      } else {
        message.destroy();
        message.error(res.message || res.msg || '操作异常');
        notification.destroy();
        if (res.code === 401) {
          // localStorage.clear();
          localStorage.removeItem('token');
          const params = `${localStorage.getItem('search')}`;
          const datas = JSON.parse(params);
          history.push(`/user/login` + datas);
          return res;
        }
        return res;
      }
    } catch (error: any) {
      message.destroy();
      message.error(error.message || error.msg || '操作异常');
      return error;
    }
  }
}
