import React from 'react';

const Page: React.FC<any> = (props) => {
  // console.log('props', props);

  React.useEffect(() => {
    // console.log('query', props?.location?.query);
  }, [props?.location?.query]);

  return <div dangerouslySetInnerHTML={{ __html: props.action.msgContent }} />;
};

export default Page;
