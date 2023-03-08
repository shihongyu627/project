import { RouteContext } from '@ant-design/pro-layout';
import Qs from 'qs';
import type { PropsWithChildren } from 'react';
import React, { useRef, useState } from 'react';
import { history } from 'umi';
import styles from './index.less';
import Tags from './Tags';
export interface Props extends PropsWithChildren<any> {
  pathname: any;
  search: any;
}
/**
 * @component TagView 标签页组件
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TagView: React.FC<Props> = React.forwardRef((props, ref: any) => {
  const [tagList, setTagList] = useState([]);
  const routeContextRef = useRef();
  // 初始化 visitedViews，设置project为首页
  const initTags = (routeContext: any) => {
    const data: any = localStorage.getItem('tagsArr') || [];
    const newsTagList = JSON.parse(data) || [];
    if (newsTagList.length === 0 && routeContext.menuData) {
      const firstTag = routeContext.menuData.filter((el: any) => el.path === props.home)[0];
      // console.log(newsTagList, routeContext, firstTag, '标签数组');
      const title = firstTag.name;
      const path = firstTag.path;
      history?.push({ pathname: firstTag.path, query: firstTag.query });
      const arr: any = [
        {
          title,
          path,
          children: props.children,
          refresh: 0,
          active: true,
        },
      ];
      localStorage.setItem('tagsArr', JSON.stringify(arr));
      // console.log('initTags tagsArr', JSON.stringify(arr));
      setTagList(arr);
    }
  };
  // 监听路由改变
  const handleOnChange = (routeContext: any) => {
    const { currentMenu } = routeContext;
    const data: any = localStorage.getItem('tagsArr') || [];
    // console.log('handleOnChange data:', data);
    const newsTagList = JSON.parse(data) || [];
    // console.log('handleOnChange newsTagList:', data);
    // console.log(currentMenu, '监听路由改变');
    // tags初始化
    if (!newsTagList || newsTagList?.length === 0) {
      return initTags(routeContext);
    }

    // 判断是否已打开过该页面
    let hasOpen = false;
    let index = -1;
    const tagsCopy: any =
      newsTagList.map((item: any, _index: any) => {
        if (currentMenu?.path === item.path) {
          hasOpen = true;
          index = _index;
          // 刷新浏览器时，重新覆盖当前 path 的 children
          return { ...item, active: true, children: props.children };
        } else {
          return { ...item, active: false };
        }
      }) || [];

    // 没有该tag时追加一个,并打开这个tag页面
    if (!hasOpen) {
      const title = routeContext.title || '';
      const path = currentMenu?.path;
      let query = props.search;
      query = Qs.parse(query.split('?')[1]);
      //后面不带path刷新时，需要拦截，
      if (path == '/') {
        return;
      }
      tagsCopy.push({
        title,
        path,
        children: props.children,
        refresh: 0,
        active: true,
        query: query,
      });
    } else {
      let query = props.search;
      query = Qs.parse(query.split('?')[1]);
      tagsCopy[index].query = query;
    }
    localStorage.setItem('tagsArr', JSON.stringify(tagsCopy));
    // console.log('handleOnChange tagsArr:', tagsCopy, JSON.stringify(tagsCopy));
    return setTagList(tagsCopy);
  };
  React.useEffect(() => {
    if (routeContextRef?.current) {
      handleOnChange(routeContextRef.current);
    }
    const data: any = localStorage.getItem('tagsArr') || [];
    const newsTagList = JSON.parse(data) || [];
    setTagList(newsTagList);
  }, [props?.pathname]);

  // 关闭标签
  const handleCloseTag = (tag: any) => {
    const data: any = localStorage.getItem('tagsArr') || [];
    const newsTagList = JSON.parse(data) || [];
    const tagsCopy: any = newsTagList.map((el: any) => ({ ...el }));

    // 判断关闭标签是否处于打开状态
    newsTagList.forEach((el: any, i) => {
      if (el.path === tag.path && tag.active) {
        const next: any = newsTagList[i - 1];
        next.active = true;
        history.push({ pathname: next?.path, query: next?.query });
      }
    });
    localStorage.setItem(
      'tagsArr',
      JSON.stringify(tagsCopy.filter((el: any) => el.path !== tag?.path)),
    );
    setTagList(tagsCopy.filter((el: any) => el.path !== tag?.path));
  };

  // 关闭所有标签
  const handleCloseAll = () => {
    const data: any = localStorage.getItem('tagsArr') || [];
    const newsTagList = JSON.parse(data) || [];
    const tagsCopy = newsTagList.filter((el: any) => el.path === props.home);
    history.push(props.home);
    localStorage.setItem('tagsArr', JSON.stringify(tagsCopy));
    setTagList(tagsCopy);
  };

  // 关闭其他标签
  const handleCloseOther = (tag: any) => {
    const data: any = localStorage.getItem('tagsArr') || [];
    const newsTagList = JSON.parse(data) || [];
    const tagsCopy = newsTagList.filter(
      (el: any) => el.path === props.home || el.path === tag.path,
    );
    history.push({ pathname: tag?.path, query: tag?.query });
    localStorage.setItem('tagsArr', JSON.stringify(tagsCopy));
    setTagList(tagsCopy);
  };

  // 刷新选择的标签
  // const handleRefreshTag = (tag: any) => {
  //   const data: any = localStorage.getItem('tagsArr');
  //   const newsTagList = JSON.parse(data) || [];
  //   const tagsCopy: any = newsTagList.map((item: any) => {
  //     if (item.path === tag.path) {
  //       history.push({ pathname: tag?.path, query: tag?.query });
  //       return { ...item, refresh: item.refresh + 1, active: true };
  //     }
  //     return { ...item, active: false };
  //   });
  //   localStorage.setItem('tagsArr', JSON.stringify(tagsCopy));
  //   setTagList(tagsCopy);
  // };

  return (
    <>
      <RouteContext.Consumer>
        {(value) => {
          // console.log(value);
          routeContextRef.current = value;
          return null;
        }}
      </RouteContext.Consumer>
      <div className={styles.tag_view}>
        <div className={styles.tags_container}>
          <Tags
            tagList={tagList}
            closeTag={handleCloseTag}
            closeAllTag={handleCloseAll}
            closeOtherTag={handleCloseOther}
            // refreshTag={handleRefreshTag}
          />
        </div>
      </div>
      {tagList.map((item: any) => {
        return (
          <div key={item.path} style={{ display: item.active ? 'block' : 'none' }}>
            <div key={item.refresh}>{item.children}</div>
          </div>
        );
      })}
    </>
  );
});

export default TagView;
