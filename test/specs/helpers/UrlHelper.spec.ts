import {
  buildEncodedQueryParams,
  buildUrl,
  trailUrl
} from "../../../src/premiere/helpers/UrlHelper";

describe("#buildUrl", () => {
  context("with url option", () => {
    context("with defaultUrl", () => {
      it("returns url option", () => {
        expect(buildUrl({ url: "url" }, "defaultUrl")).toEqual("url");
      });
    });

    context("without defaultUrl", () => {
      it("returns url option", () => {
        expect(buildUrl({ url: "url" })).toEqual("url");
      });
    });
  });

  context("without url option", () => {
    context("with defaultUrl", () => {
      it("returns the default url", () => {
        expect(buildUrl({}, "defaultUrl")).toEqual("defaultUrl");
      });
    });

    context("without defaultUrl", () => {
      it("returns an empty string", () => {
        expect(buildUrl({})).toEqual("");
      });
    });
  });

  context("with queryParams option", () => {
    context("with url option", () => {
      it("appends query params to url", () => {
        expect(buildUrl({ url: "url", queryParams: "extra" })).toEqual(
          "url?extra"
        );
      });
    });

    context("with defaultUrl", () => {
      it("appends query params to url", () => {
        expect(buildUrl({ queryParams: "extra" }, "defaultUrl")).toEqual(
          "defaultUrl?extra"
        );
      });
    });
  });
});

describe("#buildEncodedQueryParams", () => {
  context("given a string", () => {
    it("returns the given queryParams", () => {
      const queryParams = "str";
      expect(buildEncodedQueryParams(queryParams)).toBe(queryParams);
    });
  });

  context("given a hash", () => {
    it("encodes and maps keys and values", () => {
      const queryParams = { name: '"John"', '"quote"': true };

      // %22 == "
      const expectedResult = "name=%22John%22" + "&" + "%22quote%22=true";
      expect(buildEncodedQueryParams(queryParams)).toEqual(expectedResult);
    });
  });
});

describe("#trailUrl", () => {
  context("given a url ending with /", () => {
    it("returns the given url", () => {
      const url = "url/";
      expect(trailUrl(url)).toBe(url);
    });
  });

  context("given a url not ending with /", () => {
    it("appends /", () => {
      expect(trailUrl("url")).toEqual("url/");
    });
  });
});
