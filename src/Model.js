// @flow

import casex from 'casex';
import pluralize from 'pluralize';

import Api, { api } from './Api';
import Relationship from './Relationship';

import HasMany from './Relationships/HasMany';
import BelongsTo from './Relationships/BelongsTo';
import HasOne from './Relationships/HasOne';
import Request from './Request';

export default class Model {
  static primaryKey: string = 'id';
  static identifier: string = 'id';
  static basename: string = '';

  _relationshipCache: { [string]: $Subtype<Relationship<Model>> };

  get relationshipCache() {
    if (!this._relationshipCache) Object.defineProperty(this, '_relationshipCache', { value: {}, enumerable: false });
    return this._relationshipCache;
  }

  get primaryKey(): any {
    // $FlowFixMe
    return this[this.constructor.primaryKey];
  }

  get identifier(): any {
    // $FlowFixMe
    return this[this.constructor.identifier];
  }

  static new(data: Object): self {
    return new this.constructor().set(data);
  }

  static get api(): Api {
    return api;
  }

  static get snakeBasename(): string {
    return casex(this.basename, 'ca_se');
  }

  static get singularPath() {
    return pluralize.singular(this.snakeBasename);
  }

  static get pluralPath() {
    return pluralize.plural(this.snakeBasename);
  }

  static get foreignKey(): string {
    return `${this.singularPath}_${this.primaryKey}`;
  }

  get persistenceObject(): Object {
    const result: Object = {};

    Object.keys(this).forEach(key => {
      // $FlowFixMe
      result[key] = this.denormalized(key, this[key]);
    });

    return result;
  }

  transformed(prefix: string, key: string, value: any): any {
    const underscored: string = `${prefix}_${key}`;
    // $FlowFixMe
    const fn: ?Function = this[underscored] || this[casex(underscored, 'caSe')];

    return fn ? fn.bind(this)(value) : value;
  }

  normalized(key: string, value: any): any {
    return this.transformed('normalize', key, value);
  }

  denormalized(key: string, value: any): any {
    return this.transformed('denormalize', key, value);
  }

  set(data: Object): this {
    Object.keys(data).forEach(key => {
      // $FlowFixMe
      this[key] = this.normalized(key, data[key]);
    });

    return this;
  }

  duplicate(): this {
    // $FlowFixMe
    const newInstance: this = Object.assign(new this.constructor(), this);
    delete this.primaryKey;

    return newInstance;
  }

  static get request(): Request<Model> {
    return new Request().target(this);
  }

  static make(data: Object): this {
    return new this().set(data);
  }

  static makeArray(dataArray: Object[]): self[] {
    return dataArray.map(data => this.make(data));
  }

  async reload(): Promise<void> {
    const data = await this.constructor.find(this.primaryKey);
    this.set(data);
  }

  static find(key: any): Request<self> {
    return this.request.url(`${this.pluralPath}/${key}`).transform(this.make);
  }

  static get all(): Request<self[]> {
    // $FlowFixMe
    return this.request.url(this.pluralPath).transform(this.makeArray);
  }

  create(data?: Object): Request<self> {
    return this.constructor.create(data || this.persistenceObject);
  }

  static create(data: Object): Request<self> {
    return this.request
      .transform(this.make)
      .method('post')
      .body(data)
      .url(this.pluralPath);
  }

  update(data?: Object): Request<self> {
    if (data) {
      this.set(data);
    } else {
      data = this.persistenceObject;
    }

    return this.constructor.update(this.identifier, data);
  }

  static update(identifier: any, data: Object): Request<self> {
    return this.request
      .transform(this.make)
      .method('put')
      .body(data)
      .url(`${this.pluralPath}/${identifier}`);
  }

  save(data?: Object): Request<self> {
    return this.constructor.save(data || this.persistenceObject);
  }

  static save(data: Object): Request<self> {
    const key = data[this.primaryKey];
    return key ? this.update(key, data) : this.create(data);
  }

  destroy(): Request<self> {
    return this.constructor.destroy(this.identifier);
  }

  static destroy(identifier: any): Request<self> {
    return this.request.method('delete').url(`${this.pluralPath}/${identifier}`);
  }

  belongsTo(model: typeof Model): BelongsTo<Model> {
    return this.relationship(BelongsTo, model);
  }

  belongsToMany(model: typeof Model): HasMany<Model> {
    return this.hasMany(model);
  }

  hasOne<Model>(model: typeof Model): HasOne<Model> {
    return this.relationship(HasOne, model);
  }

  hasMany(model: typeof Model): HasMany<Model> {
    return this.relationship(HasMany, model);
  }

  relationship(relationship: typeof Relationship, model: typeof Model): $Subtype<Relationship<Model>> {
    // $FlowFixMe
    const cacheName = new Error().stack.match(/at (\S+)/g)[3].slice(3);
    if (!this.relationshipCache[cacheName]) this.relationshipCache[cacheName] = new relationship(this, model);

    return this.relationshipCache[cacheName];
  }
}
