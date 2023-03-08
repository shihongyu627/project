/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
  const { currentUser } = initialState ?? {};
  const columnsArr = `${localStorage.getItem('auths')}`;
  const datas = JSON.parse(columnsArr);
  const check = (url: any) => {
    if (!datas) {
      return false;
    }
    return datas.some((item: any) => item.url == url);
  };
  // console.log('kk', check('/dashboard/analysis'));
  return {
    canAdmin: currentUser && currentUser.access === 'admin',
    '/dashboard/analysis': check('/dashboard/analysis'),
    '/ticket/order': check('/ticket/order'),
    '/ticket/client': check('/ticket/client'),
    '/statistics': check('/statistics'),
    '/ticket/combo': check('/ticket/combo'),
    '/isystem': check('/isystem'),
    '/ticket/firm': check('/ticket/firm'),
    '/ticket/log': check('/ticket/log'),
    '/ticket/picture': check('/ticket/picture'),
    '/ticket/exchangeRate': check('/ticket/exchangeRate'),
    '/isystem/depart': check('/isystem/depart'),
    '/isystem/user': check('/isystem/user'),
    '/isystem/roleUserList': check('/isystem/roleUserList'),
    '/ticket/tenant': check('/ticket/tenant'),
    '/ticket/enterprise': check('/ticket/enterprise'),
    '/ticket/tenant/basic': check('/ticket/tenant/basic'),
    '/ticket/foreign': check('/ticket/foreign'),
    '/ticket/configuration': check('/ticket/configuration'),
    '/ticket/message': check('/ticket/message'),
    '/ticket/contract/model': check('/ticket/contract/model'),
  };
}
