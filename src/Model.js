// @flow

import casex from 'casex';
import pluralize from 'pluralize';

import Api, { api } from './Api';
import Relationship, { type RelationshipOptions } from './Relationship';

import HasMany from './Relationships/HasMany';
import BelongsTo from './Relationships/BelongsTo';
import HasOne from './Relationships/HasOne';

export default class Model {
  static primaryKey: string = 'id';
  static identifier: string = 'id';
  static basename: string = '';

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

  static make(data: Object): this {
    return new this().set(data);
  }

  static makeArray(dataArray: Object[]): Model[] {
    return dataArray.map(data => this.make(data));
  }

  reload(): Promise<this> {
    return this.constructor.find(this.primaryKey);
  }

  static async find(key: any): Promise<this> {
    const { data } = await this.api.http.get(`${this.pluralPath}/${key}`);
    return this.make(data);
  }

  static async all(): Promise<self[]> {
    const { data } = await this.api.http.get(this.pluralPath);
    return this.makeArray(data);
  }

  create(data?: Object): Promise<this> {
    return this.constructor.create(data || this.persistenceObject);
  }

  static async create(data: Object) {
    const response = await this.api.http.post(this.pluralPath, data);
    return this.make(response.data);
  }

  update(data?: Object): Promise<this> {
    if (data) {
      this.set(data);
    } else {
      data = this.persistenceObject;
    }

    return this.constructor.update(this.identifier, data);
  }

  static async update(identifier: any, data: Object): Promise<this> {
    const response = await this.api.http.post(`${this.basename}/${identifier}`);
    return this.make(response.data);
  }

  save(data?: Object): Promise<this> {
    return this.constructor.save(data || this.persistenceObject);
  }

  static save(data: Object): Promise<this> {
    const key = data[this.primaryKey];
    return key ? this.update(key, data) : this.create(data);
  }

  destroy(): Promise<void> {
    return this.constructor.destroy(this.identifier);
  }

  static async destroy(identifier: any): Promise<void> {
    await this.api.http.destroy(`${this.basename}/${identifier}`);
  }

  belongsTo(model: typeof Model, options: RelationshipOptions): BelongsTo<Model> {
    return this.relationship(BelongsTo, model, options);
  }

  belongsToMany(model: typeof Model, options: RelationshipOptions): HasMany<Model> {
    return this.hasMany(model, options);
  }

  hasOne<Model>(model: typeof Model, options: RelationshipOptions): HasOne<Model> {
    return this.relationship(HasOne, model, options);
  }

  hasMany(model: typeof Model, options: RelationshipOptions): HasMany<Model> {
    return this.relationship(HasMany, model, options);
  }

  relationship(
    relationship: typeof Relationship,
    model: typeof Model,
    options?: Object
  ): $Subtype<Relationship<Model>> {
    return new relationship(this, model, options);
  }
}
