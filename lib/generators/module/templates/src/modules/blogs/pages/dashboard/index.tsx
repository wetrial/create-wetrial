import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card } from 'antd';

export default () => {

  return (
    <PageContainer
      breadcrumb={undefined}
      title="dashboard示例页面"
    >
      <Card className="page-body">
        dashboard 示例页面，你可以按你的实际要求修改 或者 删除
      </Card>
    </PageContainer>
  );
};
