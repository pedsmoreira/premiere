import Store from "../../src/premiere/Store";
import Model from "../../src/premiere/Model";
import StoreFetch from "../../src/premiere/StoreFetch";
import ModelResponse from "../../src/premiere/ModelResponse";

describe("StoreFetch", () => {
  const callbackMock = jest.fn();
  const httpResult = { id: "id#0" };
  const httpMock = { get: jest.fn().mockReturnValue(Promise.resolve(httpResult)) };

  const store = new Store<Model>(Model);
  Object.defineProperty(store, "http", { get: () => httpMock });

  let storeFetch;
  beforeEach(() => {
    storeFetch = new StoreFetch<Model>(store);
  });

  describe("#fetch", () => {
    it("returns a model response with model, response and callback", async () => {
      const result: ModelResponse<Model> = await storeFetch.fetch("url", callbackMock);

      expect(result.model).toBe(Model);
      expect(result.response).toBe(httpResult);
      expect(result.callback).toBe(callbackMock);
    });

    context("given a store", () => {
      it("requests store http get", () => {
        const store = { http: { get: jest.fn() } };
        storeFetch.fetch("url", null, store);
        expect(store.http.get).toHaveBeenCalledWith("url");
      });
    });

    context("with default store", () => {
      it("requests store http get", () => {
        storeFetch.fetch("url");
        expect(httpMock.get).toHaveBeenCalledWith("url");
      });
    });
  });

  describe("#index", () => {
    it("calls #fetch with url and callback", () => {
      storeFetch.fetch = jest.fn().mockReturnValue({ asArray: jest.fn() });
      // storeFetch.index("url", callbackMock);
      // expect(storeFetch.fetch).toHaveBeenCalledWith("url", callbackMock);
    });
  });

  describe("#get", () => {
    it("calls #fetch with url and callback", () => {
      storeFetch.fetch = jest.fn().mockReturnValue({ asInstance: jest.fn() });
      storeFetch.get("url", callbackMock);
      expect(storeFetch.fetch).toHaveBeenCalledWith("url", callbackMock);
    });
  });

  describe("#foreign", () => {
    it("calls #fetch with store, url and callback", () => {
      storeFetch.fetch = jest.fn().mockReturnValue({ asArray: jest.fn() });
      const store = jest.fn();

      storeFetch.foreign(store, "url", callbackMock);
      expect(storeFetch.fetch).toHaveBeenCalledWith("url", callbackMock, store);
    });
  });
});
