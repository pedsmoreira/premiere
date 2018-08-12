// @flow

import axios, { AxiosInstance } from 'axios';

export default class Api {
  path: string;
  headers: Object = {};

  _http: AxiosInstance = axios.create();

  static CsrfHeader = 'X-CSRF-Token';

  get baseUrl(): string {
    return (this.path + '/').replace('//', '/');
  }

  get jwtToken(): string | null {
    return this.headers.Authorization;
  }

  set jwtToken(token: string) {
    this.headers.Authorization = `Bearer ${token}`;
  }

  get csrfToken(): string {
    return this.headers[Api.CsrfHeader];
  }

  set csrfToken(token: string | null) {
    this.headers[Api.CsrfHeader] = token;
  }

  get http(): AxiosInstance {
    this._http.baseUrl = this.baseUrl;
    this._http.headers = this.headers;
    return this._http;
  }
}

const api = new Api();
export { api };
