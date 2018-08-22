// @flow

import Request from './Request';

export default class TargetCache {
  targetRequests: { [string]: Request<*> } = {};
  listRequests: { [string]: Request<*> } = {};

  target(request: Request<*>): void {
    this.targetRequests[request.path] = request;
    this.listRequests = {};
  }

  list(request: Request<*>): void {
    this.listRequests[request.path] = request;
  }

  put(request: any): Request<*> {
    const path = request.path;
    const cachedRequest = this.targetRequests[path] || this.listRequests[path];

    return request.after(() => {
      const data = request.transformedData;
      Array.isArray(data) ? this.list(data) : this.target(data);
    });
  }
}
