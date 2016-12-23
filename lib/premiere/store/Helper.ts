export default class Helper {
    static http(data: any): any {
        let then = (fn: Function) => fn({data});

        let [get, put, patch, post, destroy] = Array(5).fill(0).map(() => {
            return jest.fn().mockReturnValue({then});
        });
        return () => ({get, put, patch, post, 'delete': destroy});
    }
}
