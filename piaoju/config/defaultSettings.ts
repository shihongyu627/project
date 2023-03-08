import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'dark',
  // 拂晓蓝
  primaryColor: '#1890ff',
  layout: 'top',
  contentWidth: 'Fluid',
  fixedHeader: true,
  fixSiderbar: true,
  colorWeak: false,
  title: '链境退税',
  pwa: false,
  logo: 'https://cos.ljyst.com/attachment/20230109/1673235708496_095a20e92c658c6c0487b39a19eaa0a3_.jpg',
  //黑
  //https://cos.ljyst.com/attachment/20230109/1673235708496_095a20e92c658c6c0487b39a19eaa0a3_.jpg
  //白
  //https://cos.ljyst.com/attachment/20230109/1673235640303_ef09a416c784f2d0d1b7edc00f12f2de_.jpg
  iconfontUrl: '',
  headerHeight: 48,
  splitMenus: false,
};
// {
//   "navTheme": "dark",
//   "primaryColor": "#1890ff",
//   "layout": "top",
//   "contentWidth": "Fluid",
//   "fixedHeader": true,
//   "fixSiderbar": true,
//   "pwa": false,
//   "logo": "https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg",
//   "headerHeight": 48,
//   "splitMenus": false
// }

export default Settings;
