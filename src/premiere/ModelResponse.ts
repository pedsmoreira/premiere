import { AxiosResponse } from "axios";
import Hash from "./Hash";
import Model from "./Model";

export interface CallbackResponse {
  data: Hash<any> | Hash<any>[];
}

export type Callback = (response: AxiosResponse) => CallbackResponse;

export default class ModelResponse<T extends Model> {
  model: typeof Model;
  response: AxiosResponse;
  callback: Callback;

  constructor(model: typeof Model, response: AxiosResponse, callback?: Callback) {
    this.model = model;
    this.response = response;
    this.callback = callback;
  }

  get data(): any {
    if (this.callback) {
      return this.callback(this.response).data;
    }

    return this.response.data;
  }

  get asInstance(): T {
    return this.model.make(this.data) as T;
  }

  get asArray(): T[] {
    let data = this.data;
    if (!Array.isArray(data)) {
      data = [data];
    }

    return this.model.makeArray(data) as T[];
  }
}
