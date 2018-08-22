// @flow

import queryString from 'query-string';

import Model from './Model';
import Api, { api } from './Api';
import ModelCache from './ModelCache';
import RequestCache from './RequestCache';

type RequestMethod = 'get' | 'post' | 'put' | 'delete';

type RequestProps<T> = {
  url: string,
  method: RequestMethod,
  body?: any,
  api: Api,
  target?: any,
  query?: string,
  skipCache?: boolean,
  cacheModel?: boolean,
  before?: any => any,
  transform?: any => T,
  after: ((T, ?any) => any)[],
  [string]: any
};

export default class Request<T> {
  httpRequestCache: ?Promise<*>;

  props: RequestProps<T> = {
    url: '',
    method: 'get',
    after: [],
    api
  };

  static cache: RequestCache = new RequestCache();

  get cache(): ModelCache {
    const { target } = this.props;
    if (!target) throw new Error(`[premiere] Attemptin to get cache for request without cache.`);

    return this.constructor.cache.get(target);
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
    this.props.after.push(after);
    return this;
  }

  async fetch(): Promise<T> {
    const { before, transform, after, cacheModel } = this.props;

    const request = this.shouldCache ? this.cache.put(this, { model: !!cacheModel }) : this;
    const response = await request.httpRequest;

    let transformedData = response.data;
    if (before) transformedData = before(transformedData);
    if (transform) transformedData = transform(transformedData);
    this.props.after.forEach(fn => fn(transformedData, response.data));

    return transformedData;
  }

  get httpRequest(): Promise<*> {
    const { method, body } = this.props;
    if (!this.httpRequestCache) this.httpRequestCache = this.props.api.http[method](this.path, body);
    return this.httpRequestCache;
  }

  get shouldCache(): boolean {
    const { skipCache, target } = this.props;
    return !!target && !skipCache;
  }

  cacheModel(): this {
    this.props.cacheModel = true;
    return this;
  }
}
