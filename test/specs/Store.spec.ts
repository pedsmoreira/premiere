jest.mock("../../src/premiere/helpers/UrlHelper");
import { buildUrl } from "../../src/premiere/helpers/UrlHelper";

import Store from "../../src/premiere/Store";
import Model from "../../src/premiere/Model";

class SpecStore extends Store<Model> {
  get http(): any {
    return {
      get: jest.fn(),
      put: jest.fn(),
      post: jest.fn(),
      delete: jest.fn()
    };
  }

  mockCascade() {
    const cascadeMock = jest.fn(this.cache.cascade as any);
    Object.defineProperty(this.cache, "cascade", { get: () => cascadeMock });
    return cascadeMock;
  }
}

describe("Store", () => {
  let store: SpecStore;
  const options = jest.fn() as any;
  const promise = jest.fn() as any;

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
    it("cascades");
  });

  describe("#get", () => {});

  describe("#where", () => {});

  describe("#create", () => {});

  describe("#update", () => {});

  describe("#destroy", () => {});

  describe("#by", () => {});

  describe("#foreign", () => {});

  describe("#act", () => {});
});
