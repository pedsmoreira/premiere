// @flow

import TargetCache from './TargetCache';
import Model from './Model';

export default class RequestCache {
  modelCaches: { [typeof Model]: TargetCache } = {};

  get(model: typeof Model): TargetCache {
    if (!this.modelCaches[model]) this.modelCaches[model] = new TargetCache();
    return this.modelCaches[model];
  }

  clear() {
    this.modelCaches = {};
  }
}
