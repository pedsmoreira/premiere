jest.mock('axios');
import axios from 'axios';
import api, {Api} from '../../lib/premiere/Api';

describe('Api', () => {
    let specApi: Api;

    beforeEach(() => {
        specApi = new Api();
    });

    describe('#constructor', () => {
        it('assigns properties', () => {
            specApi = new Api({base: 'base', custom: 'value'});
            expect(specApi.base).toEqual('base');
            expect((specApi as any).custom).toEqual('value');
        });
    });

    describe('#path', () => {
        it('returns an empty string by default', () => {
            expect(specApi.path).toEqual('');
        });
    });

    describe('#base', () => {
        context('with instance base', () => {
            it('returns instance base over api base and default value', () => {
                specApi.base = 'specBase';
                api.base = 'apiBase';

                expect(specApi.base).toEqual('specBase');
            });
        });

        context('with api base', () => {
            it('returns api base over default value', () => {
                api.base = 'apiBase';
                expect(specApi.base).toEqual('apiBase');
            });
        });

        context('without instance or api base', () => {
            it('returns default value', () => {
                api.base = null;
                expect(specApi.base).toEqual('/');
            });
        });
    });

    describe('baseUrl', () => {
        context('with path', () => {
            it('returns trailed base and path', () => {
                specApi.base = 'base';
                Object.defineProperty(specApi, 'path', {get: () => 'path'});
                expect(specApi.baseUrl).toEqual('base/path/')
            });
        });

        context('without path', () => {
            it('returns trailed base', () => {
                specApi.base = 'base';
                expect(specApi.baseUrl).toEqual('base/');
            });
        });
    });

    describe('#mixedHeaders', () => {
        it('returns merge of instance headers and api headers', () => {
            specApi.headers.name = 'John';
            api.headers = {surname: 'Doe'};

            expect(specApi.mixedHeaders).toEqual({
                name: 'John',
                surname: 'Doe'
            });
        });
    });

    describe('#jwtToken', () => {
        it('returns Authorization header', () => {
            specApi.headers.Authorization = 'abc';
            expect(specApi.jwtToken).toEqual('abc');
        });
    });

    describe('#jwtToken=', () => {
        it('sets Authorization header', () => {
            specApi.jwtToken = 'abc';
            expect(specApi.headers.Authorization).toEqual('Bearer abc');
        });
    });

    describe('#csrfToken', () => {
        it('returns X-CSRF-TOKEN header', () => {
            specApi.headers['X-CSRF-Token'] = 'abc';
            expect(specApi.csrfToken).toEqual('abc');
        });
    });

    describe('#csrfToken=', () => {
        it('sets X-CSRF-Token header', () => {
            specApi.csrfToken = 'test';
            expect(specApi.headers['X-CSRF-Token']).toBe('test');
        });
    });

    describe('http', () => {
        it('returns an axios instance with baseUrl and mixed headers', () => {
            api.headers = {name: 'John'};
            specApi.headers.surname = 'Doe';

            specApi.base = 'base';

            (axios.create as jest.Mock<any>).mockReturnValue('http');
            expect(specApi.http).toEqual('http');
            expect(axios.create).toHaveBeenCalledWith({
                baseURL: 'base/',
                headers: {name: 'John', surname: 'Doe'}
            });
        });
    });
});
