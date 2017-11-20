import StoreCache from "../../src/premiere/StoreCache";
import Model from "../../src/premiere/Model";
import { StoreCascadeListOptions, StoreCascadeOptions } from "../../src/premiere/StoreCacheCascade";

const cacheKey = "specKey";

describe("StoreCacheCascade", () => {
  let storeCache: StoreCache<Model>;

  beforeEach(() => {
    storeCache = new StoreCache();
  });

  describe("#promise", () => {
    const defaultResponse = new Promise(jest.fn()) as any;
    const cachedResponse = new Promise(jest.fn()) as any;

    const pushAndPlayPromise = () => {
      return storeCache.cascade
        .promise(cacheKey)
        .push(() => defaultResponse)
        .play();
    };

    context("with cached promise", () => {
      it("returns cached promise", () => {
        storeCache.promises.set(cacheKey, cachedResponse);
        expect(pushAndPlayPromise()).toBe(cachedResponse);
      });
    });

    context("without cached promise", () => {
      it("returns expected result", () => {
        expect(pushAndPlayPromise()).toBe(defaultResponse);
      });

      it("caches result", () => {
        pushAndPlayPromise();
        expect(storeCache.promises.get(cacheKey)).toBe(defaultResponse);
      });
    });
  });

  describe("#object", () => {
    const defaultResponse = { key: cacheKey };
    const cachedResponse = jest.fn() as any;

    const pushAndPlayObject = (options: StoreCascadeOptions = {}) => {
      return storeCache.cascade
        .object(cacheKey, options)
        .push(() => Promise.resolve(defaultResponse))
        .play();
    };

    context("with cached promise", () => {
      beforeEach(() => {
        storeCache.objects.set(cacheKey, cachedResponse);
      });

      context("without ignoreCache option", () => {
        it("returns cached object", () => {
          return expect(pushAndPlayObject()).resolves.toBe(cachedResponse);
        });
      });

      context("with ignoreCache option", () => {
        it("returns a new result", () => {
          return expect(pushAndPlayObject({ ignoreCache: true })).resolves.toBe(defaultResponse);
        });
      });
    });

    context("without cached promise", () => {
      it("returns expected response", () => {
        return expect(pushAndPlayObject()).resolves.toBe(defaultResponse);
      });

      it("caches result", async () => {
        await pushAndPlayObject();
        expect(storeCache.objects.get(cacheKey)).toBe(defaultResponse);
      });
    });
  });

  describe("#list", () => {
    const object0 = { key: "key#0" };
    const object1 = { key: "key#1" };

    const defaultResponse = [object0, object1];
    const cachedResponse = jest.fn() as any;

    const pushAndPlayList = (options: StoreCascadeListOptions = {}) => {
      return storeCache.cascade
        .list(cacheKey, options)
        .push(() => Promise.resolve(defaultResponse))
        .play();
    };

    context("with cached list", () => {
      beforeEach(() => {
        storeCache.lists.set(cacheKey, cachedResponse);
      });

      context("without ignoreCache option", () => {
        context("with completeItems option", () => {
          it("does not set items", async () => {
            await pushAndPlayList();
            expect(storeCache.objects.get("key#0")).toBeUndefined();
            expect(storeCache.objects.get("key#1")).toBeUndefined();
          });
        });

        it("returns cached list", () => {
          return expect(pushAndPlayList()).resolves.toBe(cachedResponse);
        });
      });

      context("with ignoreCache option", () => {
        it("returns new result", () => {
          return expect(pushAndPlayList({ ignoreCache: true })).resolves.toBe(defaultResponse);
        });
      });
    });

    context("without cached list", () => {
      it("returns expected result", () => {
        return expect(pushAndPlayList()).resolves.toBe(defaultResponse);
      });

      it("caches result", async () => {
        await pushAndPlayList();
        expect(storeCache.lists.get(cacheKey)).toBe(defaultResponse);
      });

      context("with completeItems option", () => {
        it("sets objects", async () => {
          await pushAndPlayList({ completeItems: true });
          expect(storeCache.objects.get("key#0")).toBe(object0);
          expect(storeCache.objects.get("key#1")).toBe(object1);
        });

        it("does not clear lists", async () => {
          const list = jest.fn() as any;
          storeCache.lists.set("listKey#0", list);

          await pushAndPlayList({ completeItems: true });
          expect(storeCache.lists.get("listKey#0")).toBe(list);
        });
      });

      context("without completeItems option", () => {
        it("does not set objects", async () => {
          await pushAndPlayList();
          expect(storeCache.objects.get("key#0")).toBeUndefined();
          expect(storeCache.objects.get("key#1")).toBeUndefined();
        });
      });
    });
  });
});
