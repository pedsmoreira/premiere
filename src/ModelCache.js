// @flow

import Request from './Request';

export default class ModelCache {
  modelRequests: { [string]: Request<*> } = {};
  listRequests: { [string]: Request<*> } = {};

  model(request: Request<*>): Request<*> {
    const cached = this.modelRequests[request.path];
    if (cached) return cached;

    return (this.modelRequests[request.path] = request.after(this.purgeLists));
  }

  list(request: Request<*>): Request<*> {
    const cached = this.modelRequests[request.path];
    if (cached) return cached;

    return (this.listRequests[request.path] = request);
  }

  put(request: any, options: { model?: boolean } = {}): Request<*> {
    return options.model ? this.model(request) : this.list(request);
  }

  purgeLists = () => {
    this.listRequests = {};
  };
}
