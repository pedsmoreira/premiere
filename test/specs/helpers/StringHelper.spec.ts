import { camelize } from "../../../src/premiere/helpers/StringHelper";

describe("#camelize", () => {
  it("camelizes by dashes and underscores", () => {
    expect(camelize("some_function-value")).toEqual("SomeFunctionValue");
  });

  it("camelizes without dashes and underscores", () => {
    expect(camelize("fn")).toEqual("Fn");
  });
});
