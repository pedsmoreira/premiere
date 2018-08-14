// @flow

import queryString from 'query-string';

import Model from './Model';
import Api, { api } from './Api';

type FetchRequestProps<T> = {
  url: string,
  api: Api,
  target?: any,
  query?: string,
  skipCache?: boolean,
  before?: any => any,
  transform?: any => T,
  after?: (T, ?any) => any
};

export default class FetchRequest<T> {
  httpRequestCache: ?Promise<*>;

  props: FetchRequestProps<T> = {
    url: '',
    api
  };

  static _cache: { [any]: FetchRequest<*>[] } = {};

  static cached(target: any, request: FetchRequest<*>) {
    if (!this._cache[target]) this._cache[target] = [];
    const targetCache = this._cache[target];

    const existingCache = targetCache.find(req => req.path === request.path);
    if (!existingCache) targetCache.push(request);

    return existingCache || request;
  }

  static clearCache(target: any) {
    this._cache[target] = [];
  }

  get path(): string {
    const { url, query } = this.props;
    return url + (query ? `?${query}` : '');
  }

  url(url: string): this {
    this.props.url = url;
    return this;
  }

  query(query: Object | string): this {
    this.props.query = typeof query === 'string' ? query : queryString.stringify(query);
    return this;
  }

  target(target: any): this {
    this.props.target = target;
    return this;
  }

  skipCache(): this {
    this.props.skipCache = true;
    return this;
  }

  before(before: any => any): this {
    this.props.before = before;
    return this;
  }

  unboundTransform(transform: any => T): this {
    this.props.transform = transform;
    return this;
  }

  transform(transform: any => T): this {
    return this.unboundTransform(transform.bind(this.props.target));
  }

  after(after: (T, ?any) => any): this {
    this.props.after = after;
    return this;
  }

  async fetch(): Promise<T> {
    const { before, transform, after } = this.props;
    let { data: rawData } = await this.cachedTargetRequest.httpRequest;

    let data = rawData;
    if (before) data = before(data);
    if (transform) data = transform(data);
    if (after) after(data, rawData);

    return data;
  }

  get httpRequest(): Promise<*> {
    if (!this.httpRequestCache) this.httpRequestCache = this.props.api.http.get(this.path);
    return this.httpRequestCache;
  }

  get cachedTargetRequest(): FetchRequest<T> {
    const { skipCache, target } = this.props;
    const shouldCache = target && !skipCache;

    // $FlowFixMe
    return shouldCache ? this.constructor.cached(target, this) : this;
  }
}
