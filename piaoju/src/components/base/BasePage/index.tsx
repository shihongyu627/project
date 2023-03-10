import type { ProCardProps } from '@ant-design/pro-card';
import ProCard from '@ant-design/pro-card';
import type { PageContainerProps } from '@ant-design/pro-layout';
import { PageContainer } from '@ant-design/pro-layout';
import type { BackTopProps } from 'antd';
import { BackTop } from 'antd';
import type { ReactNode } from 'react';
import React from 'react';
import './index.less';

export interface BasePageProps extends PageContainerProps {
  mode?: 'page' | 'drawer' | 'modal' | 'card'; // 页面呈现类型
  title?: string | ReactNode; // 页面标题
  extra?: ReactNode | string; // 标题栏扩展按钮
  cardProps?: boolean | ProCardProps; // 内部card属性
  backTopProps?: boolean | BackTopProps; // 内部backtop属性
}
const BasePage: React.FC<BasePageProps> = (props) => {
  const [mode] = React.useState(props.mode || 'page');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const intl = useIntl();

  return (
    <>
      {mode === 'page' ? (
        <PageContainer
          {...props}
          header={{
            ...(props?.title ? { title: props?.title } : {}),
            ...(props?.subTitle ? { subTitle: props?.subTitle } : {}),
            ...(props?.extra ? { extra: props?.extra } : {}),
            onBack: () => window.history.back(),
            // todo面包屑待处理
            // breadcrumbRender: (_props: PageHeaderProps) => {
            //   const breadcrumb = _props?.breadcrumb;
            //   const routes = breadcrumb?.routes || [];
            //   const _routes = [
            //     {
            //       path: '/',
            //       breadcrumbName: '主页',
            //     },
            //     ...routes,
            //   ];
            //   return <Breadcrumb routes={_routes} />;
            // },
            ...props?.header,
          }}
        >
          {props?.cardProps === false ? (
            props.children
          ) : (
            <ProCard {...((props?.cardProps as ProCardProps) || {})}>{props.children}</ProCard>
          )}
          {props?.backTopProps === false ? null : (
            <BackTop {...((props?.backTopProps as BackTopProps) || {})} />
          )}
        </PageContainer>
      ) : (
        <>
          {props?.cardProps === false ? (
            props.children
          ) : (
            <ProCard {...((props?.cardProps as ProCardProps) || {})}>{props.children}</ProCard>
          )}
          {props?.backTopProps === false ? null : (
            <BackTop {...((props?.backTopProps as BackTopProps) || {})} />
          )}
        </>
      )}
    </>
  );
};

export default BasePage;
