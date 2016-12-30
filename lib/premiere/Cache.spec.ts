import Cache from './Cache';
import Api from './Api';
import {IModel} from './Model';

describe('Cache', () => {
    let cache: Cache;
    let model: IModel;
    let list: IModel[];
    let promise: any = 'promise instance';

    beforeEach(() => {
        cache = new Cache(new Api());
        model = {key: jest.fn().mockReturnValue('id')};
        list = [model];
    });

    it('should resolve key from object', () => {
        expect(Cache.resolveKey(model)).toBe('id');
    });

    it('should resolve key from value', () => {
        expect(Cache.resolveKey(1)).toBe('1');
    });

    it('should be enabled without api', () => {
        cache.api = null;
        expect(cache.enabled()).toBeTruthy();
    });

    it('should be enabled with api cache enabled', () => {
        cache.api.isUsingCache = () => true;
        expect(cache.enabled()).toBeTruthy();
    });

    it('should not be enabled with api cache disabled', () => {
        cache.api.isUsingCache = () => false;
        expect(cache.enabled()).toBeFalsy();
    });

    it('should have promise enabled without api', () => {
        cache.api = null;
        expect(cache.promiseEnabled()).toBeTruthy();
    });

    it('should have promise enabled with api promise cache enabled', () => {
        cache.api.isUsingPromiseCache = () => true;
        expect(cache.promiseEnabled()).toBeTruthy();
    });

    it('should not have promise enabled with api promise cache disabled', () => {
        cache.api.isUsingPromiseCache = () => false;
        expect(cache.promiseEnabled()).toBeFalsy();
    });

    it('should get object with key', () => {
        cache.set(model);
        expect(cache.get('id')).toBe(model);
    });

    it('should not get object when disabled', () => {
        cache.enabled = () => false;
        cache.set(model);
        expect(cache.get('id')).toBeUndefined();
    });

    it('should find object value', () => {
        (model as any)['property'] = 'value';
        cache.set(model);
        expect(cache.where('property', 'value')).toBe(model);
    });

    it('should not find object when disabled', () => {
        cache.set(model);
        cache.enabled = () => false;
        expect(cache.get('id')).toBeUndefined();
    });

    it('should destroy with key', () => {
        cache.set(model);
        cache.destroy('id');
        expect(cache.get('id')).toBeUndefined();
    });

    it('should destroy with object', () => {
        cache.set(model);
        cache.destroy(model);
        expect(cache.get('id')).toBeUndefined();
    });

    it('should clear lists after destroying', () => {
        cache.lists = 'lists' as any;
        cache.set(model);
        cache.destroy(model);
        expect(cache.lists).toEqual({});
    });

    it('should set list', () => {
        cache.setList('list', list);
        expect(cache.lists['list']).toBe(list);
    });

    it('should get list', () => {
        cache.setList('list', list);
        expect(cache.getList('list')).toBe(list);
    });

    it('should destroy list', () => {
        cache.setList('list', list);
        cache.destroyList('list');
        expect(cache.getList('list')).toBeUndefined();
    });

    it('should set promise', () => {
        cache.setPromise('promise', promise);
        expect(cache.promises['promise']).toBe(promise);
    });

    it('should get promise', () => {
        cache.setPromise('promise', promise);
        expect(cache.getPromise('promise')).toBe(promise);
    });

    it('should destroy promise', () => {
        cache.setPromise('promise', promise);
        cache.destroyPromise('promise');
        expect(cache.getPromise('promise')).toBeUndefined();
    });
});
