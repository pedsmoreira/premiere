jest.mock("../../src/premiere/helpers/UrlHelper");
import { buildUrl } from "../../src/premiere/helpers/UrlHelper";

import Store from "../../src/premiere/Store";
import Model from "../../src/premiere/Model";

class SpecStore extends Store<Model> {
  httpMock = {
    get: jest.fn(),
    put: jest.fn(),
    post: jest.fn(),
    delete: jest.fn()
  };

  get http(): any {
    return this.httpMock;
  }
}

describe("Store", () => {
  let store: SpecStore;

  (buildUrl as jest.Mock<any>).mockReturnValue("url");

  beforeEach(() => {
    store = new SpecStore(Model);
  });

  describe("constructor", () => {
    it("sets model", () => {
      expect(store.model).toBe(Model);
    });

    it("sets properties", () => {
      const store = new Store<Model>(null, { property: "value" });
      expect((store as any).property).toBe("value");
    });

    it("sets store to Model", () => {
      Model.store = null;
      const store = new Store<Model>(Model);
      expect(Model.store).toBe(store);
    });

    it("does not override model store", () => {
      Model.store = "old store" as any;
      const store = new Store<Model>(Model);
      expect(Model.store).toBe("old store");
    });

    it("does not throw exception with null model", () => {
      expect(() => new Store<any>(null)).not.toThrow();
    });
  });

  describe("#path", () => {
    it("gets path from model", () => {
      Model.reflector.path = "specs";
      expect(store.path).toEqual("specs");
    });
  });

  describe("#index", () => {
    const response = { data: [{ id: "id#0" }] };

    beforeEach(() => {
      store.http.get.mockReturnValue(Promise.resolve(response));
    });

    it("returns a list of model instances", async () => {
      const result = await store.index();
      expect(result).toBeInstanceOf(Array);
      expect(result[0]).toBeInstanceOf(Model);
      expect(result[0].key).toEqual("id#0");
    });

    it("build url", () => {
      const options = jest.fn() as any;
      store.index(options);
      expect(buildUrl).toHaveBeenCalledWith(options);
    });
  });

  describe("#get", () => {
    const response = { data: { id: "id#0" } };

    beforeEach(() => {
      store.http.get.mockReturnValue(Promise.resolve(response));
    });

    it("returns a model instance", async () => {
      const result = await store.get("id");
      expect(result).toBeInstanceOf(Model);
      expect(result.key).toEqual("id#0");
    });

    it("build url", () => {
      const options = jest.fn() as any;
      store.get("id", options);
      expect(buildUrl).toHaveBeenCalledWith(options, "id");
    });
  });

  describe("#create", () => {
    beforeEach(() => {
      store.http.post.mockReturnValue(Promise.resolve({ data: { id: "id#0" } }));
    });

    it("returns a model instance", async () => {
      const result = await store.create({});
      expect(result).toBeInstanceOf(Model);
      expect(result.key).toBe("id#0");
    });

    it("sets result to cache", async () => {
      await store.create({});
      expect(store.cache.objects.get("id#0")).toBeInstanceOf(Model);
    });

    it("builds url", () => {
      const options = jest.fn() as any;
      store.create({}, options);
      expect(buildUrl).toHaveBeenCalledWith(options);
    });
  });

  describe("#update", () => {
    beforeEach(() => {
      store.http.put.mockReturnValue(Promise.resolve({ data: { id: "id#0" } }));
    });

    it("returns a model instance", async () => {
      const result = await store.update("id#0", {});
      expect(result).toBeInstanceOf(Model);
      expect(result.key).toBe("id#0");
    });

    it("sets result to cache", async () => {
      await store.update("id#0", {});
      expect(store.cache.objects.get("id#0")).toBeInstanceOf(Model);
    });

    it("builds url", () => {
      const options = jest.fn() as any;
      store.update("id", {}, options);
      expect(buildUrl).toHaveBeenCalledWith(options, "id");
    });
  });

  describe("#destroy", () => {
    beforeEach(() => {
      store.http.delete.mockReturnValue(Promise.resolve({}));
    });

    it("deletes cached data", async () => {
      store.cache.objects.set("id#0", {} as any);
      await store.destroy("id#0");
      expect(store.cache.objects.get("id#0")).toBeUndefined();
    });

    it("builds url", () => {
      const options = jest.fn() as any;
      store.destroy("id", options);
      expect(buildUrl).toHaveBeenCalledWith(options, "id");
    });
  });

  describe("#by", () => {
    const model = {
      store: { foreign: jest.fn() },
      key: jest.fn().mockReturnValue("key")
    } as any;

    it("returns result from model foreign", () => {
      const options = jest.fn() as any;
      store.by(model, "key", options);
      expect(model.store.foreign).toHaveBeenCalledWith(store.model, "key", options);
    });

    it("works without providing options", () => {
      store.by(model, "key");
    });
  });

  describe("#foreign", () => {
    const response = { data: [{ id: "id#0" }] };

    beforeEach(() => {
      store.http.get.mockReturnValue(Promise.resolve(response));
    });

    it("returns a list of model instances", async () => {
      const result = await store.foreign(Model, "id");
      expect(result).toBeInstanceOf(Array);
      expect(result[0]).toBeInstanceOf(Model);
      expect(result[0].key).toEqual("id#0");
    });

    it("builds url", () => {
      const options = jest.fn() as any;
      store.foreign(Model, "id", options);
      expect(buildUrl).toHaveBeenCalledWith(options, "id/specs");
    });
  });

  describe("#act", () => {
    it("calls requested method with given url", () => {
      const options = { url: "url", data: { key: "value" }, method: "delete" };
      store.act(options);
      expect(store.http.delete).toHaveBeenCalledWith("url", { key: "value" });
    });

    it("returns promise from http call", () => {
      const result = jest.fn();
      store.http.post.mockReturnValue(result);
      expect(store.act()).toBe(result);
    });

    it("builds url", () => {
      const options = jest.fn() as any;
      store.act(options);
      expect(buildUrl).toHaveBeenCalledWith(options);
    });
  });
});
