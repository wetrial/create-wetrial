import { Request, Response } from 'express';
import { authorizeIntercept } from './_base';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // 支持值为 Object 和 Array
  'GET /api/global/getApp': (request: Request, response: Response) => {
    const result = {
      groups: ['dashboard', 'sample'],
    };
    authorizeIntercept({ request, response }, result);
  },
};
