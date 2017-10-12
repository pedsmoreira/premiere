import { Api } from "./Api";
import Model from "./Model";
import Hash from "./Hash";
import { buildUrl } from "./helpers/UrlHelper";
import StoreCache from "./StoreCache";
import StoreFetch from "./StoreFetch";
import ModelResponse, { Callback } from "./ModelResponse";

export interface Options {
  url?: string;
  queryParams?: string | Hash<any>;
  callback?: Callback;
}

export interface FetchOptions extends Options {
  ignoreCache?: boolean;
}

export interface FetchListOptions extends FetchOptions {
  completeItems?: boolean;
}

export interface ActOptions extends Options {
  data?: Hash<any>;
  method?: string;
}

export default class Store<T extends Model> extends Api {
  model: typeof Model;
  cache: StoreCache<T> = new StoreCache<T>();
  protected _fetch: StoreFetch<T>;

  constructor(model: typeof Model, properties: Hash<any> = {}) {
    super(properties);
    this.model = model;

    if (model && !model.hasStore) {
      model.store = this;
    }
  }

  get path(): string {
    return this.model.reflector.path;
  }

  protected get fetch(): StoreFetch<T> {
    return (this._fetch = this._fetch || new StoreFetch<T>(this));
  }

  index(options: FetchListOptions = {}): Promise<T[]> {
    const url = buildUrl(options);
    const cacheName = `index/${url}`;

    return this.cache.cascade
      .promise(cacheName)
      .list(cacheName, options)
      .push(this.fetch.index.bind(this), url, options.callback)
      .play();
  }

  get(key: any, options: FetchOptions = {}): Promise<T> {
    const url = buildUrl(options, key);

    return this.cache.cascade
      .promise(`where/${url}`)
      .object(key, options)
      .push(this.fetch.get.bind(this), url, options.callback)
      .play();
  }

  async create(values: Hash<any>, options: Options = {}): Promise<T> {
    const response = await this.http.post(buildUrl(options), values);
    const instance = new ModelResponse<T>(this.model, response, options.callback).asInstance;
    return this.cache.objects.set(instance.key, instance);
  }

  async update(key: any, values: Hash<any>, options: Options = {}): Promise<T> {
    const response = await this.http.put(buildUrl(options, key), values);
    const modelResponse = new ModelResponse<T>(this.model, response, options.callback);
    return this.cache.objects.set(key, modelResponse.asInstance);
  }

  async destroy(key: T | any, options: Options = {}): Promise<void> {
    await this.http.delete(buildUrl(options, key));
    this.cache.objects.destroy(key);
  }

  by(model: typeof Model, key: any, options: FetchListOptions = {}): Promise<T[]> {
    return model.store.foreign(this.model, model.key(key), options);
  }

  foreign(model: typeof Model, key: any, options: FetchListOptions = {}): Promise<T[]> {
    const url = buildUrl(options, model.key(key) + "/" + model.reflector.path);
    const cacheName = `foreign/${url}`;

    return this.cache.cascade
      .promise(cacheName)
      .list(cacheName, options)
      .push(this.fetch.foreign, url, options.callback)
      .play();
  }

  act(options: ActOptions = {}): Promise<any> {
    const url = buildUrl(options);
    const method = (<any>this.http)[options.method || "post"];
    return method(url, options.data || {});
  }
}
