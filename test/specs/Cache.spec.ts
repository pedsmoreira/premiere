import Cache from "../../src/premiere/Cache";

describe("Cache", () => {
  const value = jest.fn();
  let cache: Cache<any>;

  beforeEach(() => {
    cache = new Cache();
  });

  describe("#get", () => {
    it("returns expected value", () => {
      cache.values["specKey"] = value;
      expect(cache.get("specKey")).toBe(value);
    });
  });

  describe("#set", () => {
    context("enabled", () => {
      it("sets value", () => {
        cache.set("specKey", value);
        expect(cache.get("specKey")).toBe(value);
      });

      it("emits changes", () => {
        const fn = jest.fn();
        cache.onChange(fn);

        cache.set("specKey", value);
        expect(fn).toHaveBeenCalledWith("specKey", value);
      });
    });

    context("not enabled", () => {
      beforeEach(() => {
        cache.enabled = false;
      });

      it("does not set value", () => {
        cache.set("specKey", value);
        expect(cache.get("specKey")).toBeUndefined();
      });

      it("does not emit change", () => {
        const fn = jest.fn();
        cache.onChange(fn);

        cache.set("specKey", value);
        expect(fn).not.toHaveBeenCalled();
      });
    });

    it("returns given value", () => {
      expect(cache.set("specKey", value)).toBe(value);
    });
  });

  describe("#destroy", () => {
    context("not enabled", () => {
      beforeEach(() => {
        cache.enabled = false;
      });

      it("does not emit destroy", () => {
        const fn = jest.fn();
        cache.onDestroy(fn);

        cache.values["specKey"] = true;
        cache.destroy("specKey");
        expect(fn).not.toHaveBeenCalled();
      });
    });

    context("given an existing key", () => {
      beforeEach(() => {
        cache.set("specKey", value);
      });

      it("deletes key occurrence", () => {
        cache.destroy("specKey");
        expect(cache.get("specKey")).toBeUndefined();
      });
    });

    context("given a non existing key", () => {
      it("does not throw", () => {
        expect(() => cache.destroy("inexistingSpecKey")).not.toThrow();
      });

      it("does not emit destroy", () => {
        const fn = jest.fn();
        cache.onDestroy(fn);

        cache.destroy("specKey");
        expect(fn).not.toHaveBeenCalled();
      });
    });
  });

  describe("#clear", () => {
    it("empties values", () => {
      cache.set("specKey", value);
      cache.clear();
      expect(cache.values).toEqual({});
    });
  });

  describe("#onChange", () => {
    it("appends callback to changeListeners", () => {
      const fn0 = jest.fn();
      cache.onChange(fn0);

      const fn1 = jest.fn();
      cache.onChange(fn1);

      expect(cache.changeListeners).toEqual([fn0, fn1]);
    });
  });
});
