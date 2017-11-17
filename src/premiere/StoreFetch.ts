import Model from "./Model";
import Store from "./Store";
import ModelResponse, { Callback } from "./ModelResponse";

export default class StoreFetch<T extends Model> {
  store: Store<T>;

  constructor(store: Store<T>) {
    this.store = store;
  }

  fetch = async (url: string, callback?: Callback, store: Store<Model> = this.store): Promise<ModelResponse<T>> => {
    const response = await store.http.get(url);
    return new ModelResponse<T>(this.store.model, response, callback);
  };

  index = async (url: string, callback?: Callback): Promise<T[]> => {
    const response = await this.fetch(url, callback);
    return response.asArray;
  };

  get = async (url: string, callback?: Callback): Promise<T> => {
    const response = await this.fetch(url, callback);
    return response.asInstance;
  };

  foreign = async (store: Store<Model>, url: string, callback?: Callback): Promise<Model[]> => {
    const response = await this.fetch(url, callback, store);
    return response.asArray;
  };
}
