import Hash from "./Hash";

export type Listener<T> = (key: any, value: T) => any;

export default class Cache<T> {
  enabled: boolean = true;
  values: Hash<T> = {};
  changeListeners: Listener<T>[] = [];
  destroyListeners: Listener<T>[] = [];

  get(key: string): T {
    return this.values[key];
  }

  set(key: string, value: T): T {
    if (this.enabled) {
      this.values[key] = value;
      this.emitChange(key, value);
    }
    return value;
  }

  destroy(key: string): void {
    if (this.enabled && typeof this.values[key] !== "undefined") {
      delete this.values[key];
      this.emitDestroy(key);
    }
  }

  clear(): void {
    this.values = {};
  }

  onChange(callback: Listener<T>): void {
    this.changeListeners.push(callback);
  }

  protected emitChange(key: string, value: T): void {
    this.changeListeners.forEach((callback: Function) => callback(key, value));
  }

  onDestroy(callback: Listener<T>): void {
    this.destroyListeners.push(callback);
  }

  protected emitDestroy(key: string): void {
    this.destroyListeners.forEach((callback: Function) => callback(key));
  }
}
