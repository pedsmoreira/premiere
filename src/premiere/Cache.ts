import Hash from "./Hash";

export type ChangeListener<T> = (key: any, value: T) => any;

export default class Cache<T> {
  enabled: boolean = true;
  values: Hash<T> = {};
  changeListeners: ChangeListener<T>[] = [];

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
      this.emitChange(key, undefined);
    }
  }

  clear(): void {
    this.values = {};
  }

  onChange(callback: ChangeListener<T>): void {
    this.changeListeners.push(callback);
  }

  protected emitChange(key: string, value: T): void {
    this.changeListeners.forEach((callback: Function) => callback(key, value));
  }
}
