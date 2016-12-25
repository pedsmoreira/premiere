import Store from '../Store';

describe('Store by method', () => {
    let store: Store<any>;
    let foreign: any = jest.fn();
    let model: any = {resolveStore: () => ({foreign})};

    beforeEach(() => {
        store = new Store<any>(jest.fn() as any);
    });

    it('should call model store foreign method', () => {
        let options = {option: true};
        store.by(model, 'key', options);
        expect(foreign).toHaveBeenCalledWith(store.model, 'key', options);
    });
});
