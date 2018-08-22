// @flow

import ModelCache from './ModelCache';
import Model from './Model';

export default class RequestCache {
  modelCaches: { [typeof Model]: ModelCache } = {};

  get(model: typeof Model): ModelCache {
    if (!this.modelCaches[model]) this.modelCaches[model] = new ModelCache();
    return this.modelCaches[model];
  }

  clear() {
    this.modelCaches = {};
  }
}
