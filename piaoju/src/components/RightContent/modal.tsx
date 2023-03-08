import React from 'react';
import { Image } from 'antd';
import logo from '../../../public/WeChat.png';

const Page: React.FC<any> = (props) => {
  // console.log('props', props);

  React.useEffect(() => {
    // console.log('query', props?.location?.query);
  }, [props?.location?.query]);

  return <Image width={250} src={logo} preview={false} />;
};

export default Page;
