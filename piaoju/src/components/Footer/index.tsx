import { useIntl } from 'umi';
import { DefaultFooter } from '@ant-design/pro-layout';
import React, { useState } from 'react';

const Footer: React.FC = () => {
  const intl = useIntl();
  const defaultMessage = intl.formatMessage({
    id: 'app.copyright.produced',
    defaultMessage: '杭州链境科技有限公司出品',
  });

  const currentYear = new Date().getFullYear();
  const [counts, setcounts] = useState(0);
  //获取操作系统类型
  const _copy = async () => {
    // console.log('result', counts);
    const text = document.getElementById('copyBox')?.innerText;
    const input: any = document.getElementById('input');
    input.value = text; // 修改文本框的内容
    input.select(); // 选中文本
    document.execCommand('copy'); // 执行浏览器复制命令
  };
  const navigatorObject: any = window.navigator || [];
  const userAgent = () => {
    const browserReg = {
      Chrome: /Chrome/,
      IE: /MSIE/,
      Firefox: /Firefox/,
      Opera: /Presto/,
      Safari: /Version\/([\d.]+).*Safari/,
      '360': /360SE/,
      QQBrowswe: /QQ/,
      Edge: /Edg/,
    };
    const deviceReg = {
      iPhone: /iPhone/,
      iPad: /iPad/,
      Android: /Android/,
      Windows: /Windows/,
      Mac: /Macintosh/,
    };
    const userAgentStr = navigator.userAgent;
    const userAgentObj = {
      browserName: '', // 浏览器名称
      browserVersion: '', // 浏览器版本
      osName: '', // 操作系统名称
      osVersion: '', // 操作系统版本
      deviceName: '', // 设备名称
    };
    for (const key in browserReg) {
      if (browserReg[key].test(userAgentStr)) {
        userAgentObj.browserName = key;
        if (key === 'Chrome') {
          userAgentObj.browserVersion = userAgentStr.split('Chrome/')[1].split(' ')[0];
        } else if (key === 'IE') {
          userAgentObj.browserVersion = userAgentStr.split('MSIE ')[1].split(' ')[1];
        } else if (key === 'Firefox') {
          userAgentObj.browserVersion = userAgentStr.split('Firefox/')[1];
        } else if (key === 'Opera') {
          userAgentObj.browserVersion = userAgentStr.split('Version/')[1];
        } else if (key === 'Safari') {
          userAgentObj.browserVersion = userAgentStr.split('Version/')[1].split(' ')[0];
        } else if (key === '360') {
          userAgentObj.browserVersion = '';
        } else if (key === 'QQBrowswe') {
          userAgentObj.browserVersion = userAgentStr.split('Version/')[1].split(' ')[0];
        } else if (key === 'Edge') {
          userAgentObj.browserVersion = userAgentStr.split('Edg/')[1].split(' ')[0];
        }
      }
    }

    for (const key in deviceReg) {
      if (deviceReg[key].test(userAgentStr)) {
        userAgentObj.osName = key;
        if (key === 'Windows') {
          userAgentObj.osVersion = userAgentStr.split('Windows NT ')[1].split(';')[0];
        } else if (key === 'Mac') {
          userAgentObj.osVersion = userAgentStr.split('Mac OS X ')[1].split(')')[0];
        } else if (key === 'iPhone') {
          userAgentObj.osVersion = userAgentStr.split('iPhone OS ')[1].split(' ')[0];
        } else if (key === 'iPad') {
          userAgentObj.osVersion = userAgentStr.split('iPad; CPU OS ')[1].split(' ')[0];
        } else if (key === 'Android') {
          userAgentObj.osVersion = userAgentStr.split('Android ')[1].split(';')[0];
          userAgentObj.deviceName = userAgentStr
            .split('(Linux; Android ')[1]
            .split('; ')[1]
            .split(' Build')[0];
        }
      }
    }
    return userAgentObj;
  };
  // console.log(JSON.stringify(userAgent()));
  const userInfo = `${localStorage.getItem('userInfo')}`;
  const datasuserInfo = JSON.parse(userInfo);

  // const getIPs = (callback: any) => {
  //   const ip_dups = {};
  //   const RTCPeerConnection =
  //     window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
  //   const useWebKit = !!window.webkitRTCPeerConnection;
  //   const mediaConstraints = {
  //     optional: [{ RtpDataChannels: true }],
  //   };
  //   // 这里就是需要的ICEServer了
  //   const servers = {
  //     iceServers: [
  //       { urls: 'stun:stun.services.mozilla.com' },
  //       { urls: 'stun:stun.l.google.com:19302' },
  //     ],
  //   };
  //   const pc = new RTCPeerConnection(servers, mediaConstraints);
  //   function handleCandidate(candidate: any) {
  //     const ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/;
  //     const hasIp = ip_regex.exec(candidate);
  //     if (hasIp) {
  //       const ip_addr = ip_regex.exec(candidate)[1];
  //       if (ip_dups[ip_addr] === undefined) callback(ip_addr);
  //       ip_dups[ip_addr] = true;
  //     }
  //   }
  //   // 网络协商的过程
  //   pc.onicecandidate = function (ice) {
  //     if (ice.candidate) {
  //       handleCandidate(ice.candidate.candidate);
  //     }
  //   };

  //   pc.createDataChannel('');
  //   //创建一个SDP(session description protocol)会话描述协议 是一个纯文本信息 包含了媒体和网络协商的信息
  //   pc.createOffer(
  //     function (result) {
  //       pc.setLocalDescription(
  //         result,
  //         function () {},
  //         function () {},
  //       );
  //     },
  //     function () {},
  //   );
  //   setTimeout(function () {
  //     const lines = pc.localDescription.sdp.split('\n');
  //     lines.forEach(function (line) {
  //       if (line.indexOf('a=candidate:') === 0) handleCandidate(line);
  //     });
  //   }, 1000);
  // };
  // getIPs((ip: any) => {
  //   console.log('ip', ip);
  // });

  return (
    <>
      <DefaultFooter
        // copyright={}
        // copyright={'Copyright' + '\xa0\xa0' + '2019-' + `${currentYear} ${defaultMessage}`}
        copyright={
          <div
            style={{ marginTop: '-5px' }}
            onClick={() => {
              const count = counts + 1;
              setcounts(count);
              if (count >= 5) {
                _copy();
              }
              // console.log('xxx', count);
            }}
          >
            {'Copyright' + '\xa0\xa0' + '2019-' + `${currentYear} ${defaultMessage}`}
          </div>
        }

        // links={[
        //   {
        //     key: 'Ant Design Pro',
        //     title: 'Ant Design Pro',
        //     href: 'https://pro.ant.design',
        //     blankTarget: true,
        //   },
        //   {
        //     key: 'github',
        //     title: <GithubOutlined />,
        //     href: 'https://github.com/ant-design/ant-design-pro',
        //     blankTarget: true,
        //   },
        //   {
        //     key: 'Ant Design',
        //     title: 'Ant Design',
        //     href: 'https://ant.design',
        //     blankTarget: true,
        //   },
        // ]}
      />
      <div id="copyBox" style={{ display: 'none' }}>
        <div>{'系统平台：' + userAgent().osName + '\r\n'}</div>
        <div>{'系统版本：' + userAgent().osVersion + '\r\n'}</div>
        <div>{'浏览器：' + userAgent().browserName + '\r\n'}</div>
        <div>{'浏览器版本：' + userAgent().browserVersion + '\r\n'}</div>
        <div>{'userAgent：' + navigatorObject.userAgent + '\r\n'}</div>
        <div>{'域名：' + window.location.protocol + '//' + window.location.host + '\r\n'}</div>
        {/* <div>{'访问IP：' + ip() + '\r\n'}</div> */}
        <div>
          {'当前企业：' +
            'ID=' +
            datasuserInfo.tenantId +
            ',name=' +
            datasuserInfo.tenantName +
            '\r\n'}
        </div>
        <div>
          {'当前用户：' + 'ID=' + datasuserInfo.id + ',name=' + datasuserInfo.username + '\r\n'}
        </div>
        {/* <div>{'企业名称：' + (copyform.name || '') + '\r\n'}</div>
        <div>{'企业ID：' + (copyform.tenantNo || '') + '\r\n'}</div>
        <div>{'管理账号：' + (copyform.username || '') + '\r\n'}</div>
        <div>{'初始密码：' + (copyform.password || '')}</div> */}
      </div>
      <textarea
        id="input"
        style={{ position: 'fixed', top: '10000px', left: '10000px', opacity: '0' }}
      ></textarea>
    </>
  );
};

export default Footer;
