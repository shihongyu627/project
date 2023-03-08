import { useEffect, useState } from 'react';
import { Tag, message } from 'antd';
import { groupBy } from 'lodash';
import { page } from '@/utils';
import moment from 'moment';
import {
  useModel,
  // useRequest
} from 'umi';
import { messageList, editByAnntIdAndUserId } from '@/services/ant-design-pro/message';
// import { getNotices } from '@/services/ant-design-pro/api';
import Page2 from './modal';

import NoticeIcon from './NoticeIcon';
import styles from './index.less';
import React from 'react';
import { history } from 'umi';
export type GlobalHeaderRightProps = {
  fetchingNotices?: boolean;
  onNoticeVisibleChange?: (visible: boolean) => void;
  onNoticeClear?: (tabName?: string) => void;
};

const getNoticeData = (notices: API.NoticeIconItem[]): Record<string, API.NoticeIconItem[]> => {
  if (!notices || notices.length === 0 || !Array.isArray(notices)) {
    return {};
  }

  const newNotices = notices.map((notice) => {
    const newNotice = { ...notice };

    if (newNotice.datetime) {
      newNotice.datetime = moment(notice.datetime as string).fromNow();
    }

    if (newNotice.id) {
      newNotice.key = newNotice.id;
    }

    if (newNotice.extra && newNotice.status) {
      const color = {
        todo: '',
        processing: 'blue',
        urgent: 'red',
        doing: 'gold',
      }[newNotice.status];
      newNotice.extra = (
        <Tag
          color={color}
          style={{
            marginRight: 0,
          }}
        >
          {newNotice.extra}
        </Tag>
      ) as any;
    }

    return newNotice;
  });
  return groupBy(newNotices, 'type');
};

const getUnreadData = (noticeData: Record<string, API.NoticeIconItem[]>) => {
  const unreadMsg: Record<string, number> = {};
  Object.keys(noticeData).forEach((key) => {
    const value = noticeData[key];

    if (!unreadMsg[key]) {
      unreadMsg[key] = 0;
    }

    if (Array.isArray(value)) {
      unreadMsg[key] = value.filter((item) => !item.read).length;
    }
  });
  return unreadMsg;
};

const NoticeIconView: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [notices, setNotices] = useState<API.NoticeIconItem[]>([]);
  // const { data } = useRequest(getNotices);
  // const data1: any = await messageList();
  // const data = messageList;
  const onCancel = async (e: any, ref: any) => {
    const columns = `${localStorage.getItem('loginType')}`;
    const loginType = JSON.parse(columns);
    // console.log('onCancel', loginType);
    if (e.readFlag === '0' && loginType === 'SaaS') {
      const res: any = await editByAnntIdAndUserId(e.anntId);
      console.log('onCancel', res);
    }
    page.closeModal(ref);
  };
  const onOk = async (e: any, ref: any) => {
    const columns = `${localStorage.getItem('loginType')}`;
    const loginType = JSON.parse(columns);
    if (e.readFlag === '0' && loginType === 'SaaS') {
      const res: any = await editByAnntIdAndUserId(e.anntId);
      console.log('onCancel', res);
    }
    page.closeModal(ref);
  };
  const showModal = (item: any) => {
    const ref = page.showModal(<Page2 action={item} />, {
      title: item.titile,
      maskClosable: false,
      zIndex: 9999,
      onCancel: () => {
        onCancel(item, ref);
      },
      onOk: () => {
        onOk(item, ref);
      },
    });
  };
  const _statistics = async () => {
    const data: any = await messageList({});
    // console.log('notices1', data);
    if (data.code == 200 || data.code === 0) {
      (data.result.records || []).map((item: any) => {
        item.type = 'notification';
        item.datetime = item.sendTime;
        item.title = item.titile;
        if (item.readFlag === '0') {
          const ref = page.showModal(<Page2 action={item} />, {
            title: item.titile,
            maskClosable: false,
            zIndex: 9999,
            onCancel: () => {
              onCancel(item, ref);
            },
            onOk: () => {
              onOk(item, ref);
            },
          });
        } else {
          item.read = true;
        }
      });
      setNotices(data.result.records || []);
    }
  };
  useEffect(() => {
    _statistics();
  }, []);

  const noticeData = getNoticeData(notices);
  const unreadMsg = getUnreadData(noticeData || {});

  //改变阅读状态
  const changeReadState = (id: string) => {
    setNotices(
      notices.map((item) => {
        const notice = { ...item };
        if (notice.id === id) {
          notice.read = true;
        }
        return notice;
      }),
    );
  };

  //清空
  const clearReadState = (title: string, key: string) => {
    setNotices(
      notices.map((item) => {
        const notice = { ...item };
        if (notice.type === key) {
          notice.read = true;
        }
        return notice;
      }),
    );
    message.success(`${'清空了'} ${title}`);
  };

  return (
    <NoticeIcon
      className={styles.action}
      count={currentUser && currentUser.unreadCount}
      onItemClick={(item) => {
        showModal(item);
        changeReadState(item.id!);
      }}
      onClear={(title: string, key: string) => clearReadState(title, key)}
      loading={false}
      clearText="清空"
      viewMoreText="查看更多"
      onViewMore={
        () => history?.push('/message')
        // message.info('Click on view more')
      }
      clearClose
    >
      <NoticeIcon.Tab
        tabKey="notification"
        count={unreadMsg.notification}
        list={noticeData.notification}
        title="通知"
        emptyText="你已查看所有通知"
        showViewMore
        showClear={false}
      />
      {/* <NoticeIcon.Tab
        tabKey="message"
        count={unreadMsg.message}
        list={noticeData.message}
        title="消息"
        // emptyText="您已读完所有消息"
        showViewMore
      /> */}
      {/* <NoticeIcon.Tab
        tabKey="event"
        title="待办"
        emptyText="你已完成所有待办"
        count={unreadMsg.event}
        list={noticeData.event}
        showViewMore
      /> */}
    </NoticeIcon>
  );
};

export default NoticeIconView;
