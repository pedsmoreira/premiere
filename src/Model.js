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

  _original: ?Object;
  _relationshipCache: { [string]: $Subtype<Relationship<Model>> };

  original(): this {
    this._original = this.persistenceObject;
    return this;
  }

  get pristine(): boolean {
    return !!this._original && JSON.stringify(this._original) === JSON.stringify(this.persistenceObject);
  }

  get changed() {
    return !this.pristine;
  }

  get relationshipCache() {
    if (!this._relationshipCache) Object.defineProperty(this, '_relationshipCache', { value: {}, enumerable: false });
    return this._relationshipCache;
  }

  get hasPrimaryKey(): boolean {
    return !!this.primaryKey;
  }

  get primaryKey(): any {
    // $FlowFixMe
    return this[this.constructor.primaryKey];
  }

  get identifier(): any {
    // $FlowFixMe
    return this[this.constructor.identifier];
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

  get changePersistenceObject(): Object {
    if (!this._original) return this.persistenceObject;

    return this.persistenceObject;
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

  unset(props: string | string[]): this {
    if (!Array.isArray(props)) props = [props];

    // $FlowFixMe
    props.forEach(prop => delete this[prop]);
    return this;
  }

  get duplicate(): this {
    // $FlowFixMe
    return Object.assign(new this.constructor(), this).unset(this.constructor.primaryKey);
  }

  static get request(): Request<Model> {
    return new Request().target(this);
  }

  static new(data: Object): self {
    return new this().set(data);
  }

  static newArray(dataArray: Object[]): self[] {
    return dataArray.map(data => this.new(data));
  }

  async reload(): Promise<void> {
    const data = await this.constructor.find(this.primaryKey);
    this.set(data);
  }

  static find(key: any): Request<self> {
    return this.request.url(`${this.pluralPath}/${key}`).transform(this.new);
  }

  static get all(): Request<self[]> {
    // $FlowFixMe
    return this.request.url(this.pluralPath).transform(this.newArray);
  }

  create(): Request<self> {
    if (this.hasPrimaryKey)
      throw new Error(`[premiere] Attempting to create a ${this.constructor.name} instance that already has a key.`);

    return this.constructor.request
      .transform(this.set)
      .method('post')
      .body(this.persistenceObject)
      .url(this.constructor.pluralPath);
  }

  static create(data: Object): Request<self> {
    return this.new(data).create();
  }

  update(): Request<self> {
    return this.constructor.request
      .transform(this.set)
      .method('put')
      .body(this.persistenceObject)
      .url(`${this.constructor.pluralPath}/${this.primaryKey}`);
  }

  updateChanges(): Request<self> {
    return this.update().body(this.changePersistenceObject);
  }

  static update(data: Object, identifier?: any): Request<self> {
    if (identifier) data[this.primaryKey] = identifier;
    return this.new(data).update(data);
  }

  save(): Request<self> {
    return this.hasPrimaryKey ? this.update() : this.create();
  }

  saveChanges(): Request<self> {
    return this.save().body(this.changePersistenceObject);
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
