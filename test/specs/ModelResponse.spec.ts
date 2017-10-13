import ModelResponse from "../../src/premiere/ModelResponse";
import Model from "../../src/premiere/Model";

describe("ModelResponse", () => {
  const responseData = { id: 0 };
  const response = { data: responseData } as any;

  describe("#constructor", () => {
    it("sets model, response and callback", () => {
      const callback = jest.fn();
      const modelResponse = new ModelResponse(Model, response, callback);

      expect(modelResponse.model).toBe(Model);
      expect(modelResponse.response).toBe(response);
      expect(modelResponse.callback).toBe(callback);
    });
  });

  describe("#data", () => {
    context("with callback", () => {
      it("returns callback response data", () => {
        const callback = jest.fn().mockReturnValue({ data: "callback data value" });
        const modelResponse = new ModelResponse(Model, response, callback);

        expect(modelResponse.data).toBe("callback data value");
        expect(callback).toHaveBeenCalledWith(response);
      });
    });

    context("without callback", () => {
      it("returns response data", () => {
        const modelResponse = new ModelResponse(Model, response);
        expect(modelResponse.data).toBe(responseData);
      });
    });
  });

  describe("#asInstance", () => {
    it("returns an instance of the model", () => {
      const modelResponse = new ModelResponse(Model, response);
      expect(modelResponse.asInstance).toBeInstanceOf(Model);
    });
  });

  describe("#asArray", () => {
    context("given an array as response data", () => {
      const modelResponse = new ModelResponse(Model, { data: [responseData] } as any);

      const result = modelResponse.asArray;
      expect(result).toBeInstanceOf(Array);
      expect(result[0]).toBeInstanceOf(Model);
    });

    context("given an object as response data", () => {
      const modelResponse = new ModelResponse(Model, response);

      const result = modelResponse.asArray;
      expect(result).toBeInstanceOf(Array);
      expect(result[0]).toBeInstanceOf(Model);
    });
  });
});
