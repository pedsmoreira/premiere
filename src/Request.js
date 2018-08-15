// @flow

import queryString from 'query-string';

import Model from './Model';
import Api, { api } from './Api';

type RequestMethod = 'get' | 'post' | 'put' | 'delete';

type RequestProps<T> = {
  url: string,
  method: RequestMethod,
  body?: any,
  api: Api,
  target?: any,
  query?: string,
  skipCache?: boolean,
  before?: any => any,
  transform?: any => T,
  after?: (T, ?any) => any,
  [string]: any
};

export default class Request<T> {
  httpRequestCache: ?Promise<*>;

  props: RequestProps<T> = {
    url: '',
    method: 'get',
    api
  };

  static _cache: { [any]: Request<*>[] } = {};

  static cached(target: any, request: Request<*>) {
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
    return (url || this.defaultUrl) + (query ? `?${query}` : '');
  }

  get defaultUrl(): string {
    return '';
  }

  url(url: string): this {
    this.props.url = url;
    return this;
  }

  method(method: RequestMethod): this {
    this.props.method = method;
    return this;
  }

  body(body: any): this {
    this.props.body = body;
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
    const { method, body } = this.props;
    if (!this.httpRequestCache) this.httpRequestCache = this.props.api.http[method](this.path, body);
    return this.httpRequestCache;
  }

  get cachedTargetRequest(): Request<T> {
    const { skipCache, target } = this.props;
    const shouldCache = target && !skipCache;

    // $FlowFixMe
    return shouldCache ? this.constructor.cached(target, this) : this;
  }
}
