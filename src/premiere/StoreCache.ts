import Cache from "./Cache";
import StoreCacheCascade from "./StoreCacheCascade";
import Model from "./Model";

export default class StoreCache<T extends Model> {
  objects: Cache<T> = new Cache<T>();
  lists: Cache<T[]> = new Cache<T[]>();
  promises: Cache<Promise<T | T[]>> = new Cache<Promise<T | T[]>>();

  constructor() {
    this.bindListClearance();
    this.bindPromiseDeletion();
  }

  get cascade(): StoreCacheCascade<T> {
    return new StoreCacheCascade<T>(this);
  }

  private clearLists(): void {
    this.lists.clear();
  }

  private bindListClearance(): void {
    const boundClearLists = this.clearLists.bind(this);
    this.objects.onChange(boundClearLists);
    this.objects.onDestroy(boundClearLists);
  }

  private schedulePromiseDeletion(key: any, promise: Promise<any>): void {
    const removePromise = () => this.promises.destroy(key);
    promise.then(removePromise, removePromise);
  }

  private bindPromiseDeletion(): void {
    this.promises.onChange(this.schedulePromiseDeletion.bind(this));
  }
}
