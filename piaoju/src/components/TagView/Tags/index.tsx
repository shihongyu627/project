import { CloseOutlined } from '@ant-design/icons';
import type { PropsWithChildren } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { history } from 'umi';
import styles from './index.less';
import { useAliveController } from 'react-activation';
export interface Props extends PropsWithChildren<any> {
  tagList: any; // 标签
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Tags: React.FC<Props> = React.forwardRef((props, ref) => {
  const { dropScope } = useAliveController();
  // const [left, setLeft] = useState(0);
  // const [top, setTop] = useState(0);
  const [menuVisible, setMenuVisible] = useState(false);
  // const [currentTag, setCurrentTag] = useState();

  const tagListRef = useRef();
  const contextMenuRef = useRef();
  const handleClickOutside = (event: any) => {
    const isOutside = !(contextMenuRef.current && contextMenuRef.current.contains(event.target));
    if (isOutside && menuVisible) {
      setMenuVisible(false);
    }
  };
  useEffect(() => {
    return () => {
      document.body.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // 由于react的state不能及时穿透到 document.body.addEventListener去，需要在每次值发送改变时进行解绑和再次监听
  useEffect(() => {
    document.body.removeEventListener('click', handleClickOutside);
    document.body.addEventListener('click', handleClickOutside);
  }, [menuVisible]);

  // const openContextMenu = (event: any, tag: any) => {
  //   event.preventDefault();
  //   const menuMinWidth = 105;
  //   const clickX = event.clientX;
  //   const clickY = event.clientY; //事件发生时鼠标的Y坐标
  //   const clientWidth = tagListRef.current?.clientWidth || 0; // container width
  //   const maxLeft = clientWidth - menuMinWidth; // left boundary
  //   setCurrentTag(tag);
  //   setMenuVisible(true);
  //   setTop(clickY);

  //   // 当鼠标点击位置大于左侧边界时，说明鼠标点击的位置偏右，将菜单放在左边
  //   // 反之，当鼠标点击的位置偏左，将菜单放在右边
  //   const Left = clickX > maxLeft ? clickX - menuMinWidth + 15 : clickX;
  //   setLeft(Left);
  // };

  return (
    <div className={styles.tags_wrapper} ref={tagListRef}>
      <div>
        {props.tagList.map((item: any, i: any) => (
          <div
            key={item.path}
            className={item.active ? `${styles.item} ${styles.active}` : styles.item}
            onClick={() => {
              // console.log(item.query, 9999999);
              history.push({ pathname: item.path, query: item.query });
            }}
            // onContextMenu={(e) => openContextMenu(e, item)}
          >
            <span>{item.title}</span>
            {i !== 0 && (
              <CloseOutlined
                className={styles.icon_close}
                onClick={(e) => {
                  e.stopPropagation();
                  dropScope(item.path);
                  props.closeTag(item);
                }}
              />
            )}
          </div>
        ))}
      </div>
      {/* {menuVisible ? (
        <ul
          className={styles.contextmenu}
          style={{ left: `${left}px`, top: `${top}px` }}
          ref={contextMenuRef}
        >
          <li
            onClick={() => {
              setMenuVisible(false);
              props.refreshTag(currentTag);
            }}
          >
            刷新
          </li>
          <li
            onClick={() => {
              setMenuVisible(false);
              props.closeOtherTag(currentTag);
            }}
          >
            关闭其他
          </li>
          <li
            onClick={() => {
              setMenuVisible(false);
              props.closeAllTag();
            }}
          >
            关闭所有
          </li>
        </ul>
      ) : null} */}
    </div>
  );
});
export default Tags;
