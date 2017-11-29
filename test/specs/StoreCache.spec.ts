import StoreCache from "../../src/premiere/StoreCache";
import Model from "../../src/premiere/Model";
import StoreCacheCascade from "../../src/premiere/StoreCacheCascade";

describe("StoreCache", () => {
  let storeCache;

  beforeEach(() => {
    storeCache = new StoreCache<Model>();
  });

  describe("#cascade", () => {
    it("returns a StoreCacheCascade instance", () => {
      expect(storeCache.cascade).toBeInstanceOf(StoreCacheCascade);
    });

    it("returns a different instance every time", () => {
      expect(storeCache.cascade).not.toBe(storeCache.cascade);
    });
  });

  it("clears lists on objects cache change", () => {
    const value = jest.fn();
    storeCache.lists.set("listKey", value);
    storeCache.objects.set("objectKey", "object");
    expect(storeCache.lists.get("listKey")).toBeUndefined();
  });

  it("clears lists on objects cache destroyed", () => {
    const value = jest.fn();
    storeCache.lists.set("listKey", value);
    storeCache.objects.set("listKey", value);
    storeCache.objects.destroy("listKey");
    expect(storeCache.lists.get("listKey")).toBeUndefined();
  });

  it("deletes promise once it is done", async () => {
    let resolvePromise;
    const promise = new Promise(resolve => {
      resolvePromise = resolve;
    });

    storeCache.promises.set("promiseKey", promise);
    resolvePromise("some value");

    await promise;
    expect(storeCache.promises.get("promiseKey")).toBeUndefined();
  });
});
