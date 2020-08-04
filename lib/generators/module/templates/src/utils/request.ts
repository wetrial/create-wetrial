import {
  addRequestInterceptor,
  addResponseInterceptor,
  commonRequestInterceptor,
  commonResponseWithRefreshTokenInterceptor,
} from '@wetrial/core/es/request';

addRequestInterceptor(...commonRequestInterceptor);
addResponseInterceptor(...commonResponseWithRefreshTokenInterceptor);

export { request, get, post, put, patch, del, head, options } from '@wetrial/core';
