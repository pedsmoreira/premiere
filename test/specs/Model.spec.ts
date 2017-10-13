import Model from "../../src/premiere/Model";
import Store from "../../src/premiere/Store";

class SpecModel extends Model {
  mockedSelf: any;

  get self() {
    return this.mockedSelf || this.constructor;
  }

  mockSelfMethod(name: string, returnValue: any) {
    this.mockedSelf = { [name]: jest.fn().mockReturnValue(returnValue) };
  }

  mockGetMethod(name, returnValue?: any) {
    Object.defineProperty(this, name, {
      get: jest.fn().mockReturnValue(returnValue || jest.fn()),
      set: jest.fn()
    });
  }
}

describe("Model", () => {
  let model: SpecModel;
  let ForeignModel;
  const store = jest.fn() as any;
  const options = jest.fn() as any;
  const promise = jest.fn() as any;

  beforeEach(() => {
    model = new SpecModel();
    ForeignModel = {};
  });

  describe("#self", () => {
    it("returns constructor", () => {
      const instance = new Model();
      expect(instance.self).toBe(Model);
    });
  });

  describe(".reflector", () => {
    context("with existing instance", () => {
      it("returns existing instance", () => {
        const instance = Model.reflector;
        expect(Model.reflector).toBe(instance);
      });
    });

    context("without existing instance", () => {
      beforeEach(() => {
        Model["_reflector"] = null;
      });

      it("creates a new instance", () => {
        expect(Model.reflector).toBeInstanceOf(Model);
      });

      context("with Model._reflector set", () => {
        class ReflectorModel extends Model {}

        it("ignores instances that not the current class", () => {
          const existing = Model.reflector;
          expect(ReflectorModel.reflector).not.toBe(existing);
          expect(ReflectorModel.reflector).toBeInstanceOf(ReflectorModel);
        });
      });
    });
  });

  describe("#store", () => {
    it("returns store from constructor", () => {
      Model.store = store;
      expect(model.store).toBe(store);
    });
  });

  describe(".hasStore", () => {
    context("without store", () => {
      beforeEach(() => {
        Model.store = null;
      });

      it("returns false", () => {
        expect(Model.hasStore).toBeFalsy();
      });
    });

    context("with store", () => {
      beforeEach(() => {
        Model.store = store;
      });

      it("returns true", () => {
        expect(Model.hasStore).toBeTruthy();
      });
    });
  });

  describe(".store", () => {
    context("without existing store", () => {
      beforeEach(() => {
        Model.store = null;
      });

      it("creates a new store", () => {
        const result = Model.store;
        expect(result).toBeInstanceOf(Store);
        expect(result).not.toBe(store);
      });
    });

    context("with existing store", () => {
      beforeEach(() => {
        Model.store = store;
      });

      it("returns existing store", () => {
        expect(Model.store).toBe(store);
      });
    });
  });

  describe(".store=", () => {
    it("sets null", () => {
      Model.store = null;
      expect(Model["_store"]).toBe(null);
    });

    it("sets value", () => {
      Model.store = store;
      expect(Model["_store"]).toBe(store);
    });
  });

  describe("#key", () => {
    beforeEach(() => {
      model.keyColumn = "property";
      model["property"] = "value";
    });

    it("returns value from key column", () => {
      expect(model.key).toEqual("value");
    });
  });

  describe("#key=", () => {
    beforeEach(() => {
      model.keyColumn = "property";
      model.key = "new value";
    });

    it("sets key property value", () => {
      expect(model["property"]).toEqual("new value");
    });
  });

  describe(".key", () => {
    context("given an empty value", () => {
      it("throws an error", () => {
        expect(() => Model.key(null)).toThrowError();
      });
    });

    context("given an object", () => {
      it("tries to get key property", () => {
        expect(Model.key({ key: "uid" })).toEqual("uid");
      });
    });

    context("given a primitive value", () => {
      it("returns the value", () => {
        expect(Model.key(1)).toEqual(1);
        expect(Model.key("yes")).toEqual("yes");
        expect(Model.key(true)).toEqual(true);
      });
    });
  });

  describe("#singular", () => {
    beforeEach(() => {
      model.path = "tables";
    });

    context("with singular set", () => {
      beforeEach(() => {
        model.singular = "user";
      });

      it("returns existing value", () => {
        expect(model.singular).toEqual("user");
      });
    });

    context("without singular set", () => {
      beforeEach(() => {
        model.singular = null;
      });

      it("guesses singular", () => {
        expect(model.singular).toEqual("table");
      });
    });
  });

  describe("#singular=", () => {
    beforeEach(() => {
      model["singular"] = "unique_singular";
    });

    it("sets singular value", () => {
      expect(model.singular).toEqual("unique_singular");
    });
  });

  describe("#foreignName", () => {
    beforeEach(() => {
      model.singular = "table";
      model.keyColumn = "uid";
    });

    it("returns singular and keyColumn combination", () => {
      expect(model.foreignName).toEqual("table_uid");
    });
  });

  describe("#foriegnKey", () => {
    class User extends Model {
      singular = "user";
    }

    beforeEach(() => {
      model["user_id"] = 33;
    });

    it("returns key value for foreign model", () => {
      expect(model.foreignKey(User)).toEqual(33);
    });
  });

  describe("#map", () => {
    beforeEach(() => {
      model["property"] = "value";
      model["denormalizeProperty"] = value => "denormalized " + value;
    });

    it("returns normalized values", () => {
      expect(model.map).toEqual({ property: "denormalized value" });
    });

    it("does not return include objects", () => {
      model["object"] = store;
      expect(model.map).not.toContain("object");
    });

    it("does not include functions", () => {
      model["fn"] = () => true;
      expect(model.map).not.toContain("fn");
    });
  });

  describe("#normalized", () => {
    context("with underscore_function", () => {
      beforeEach(() => {
        model["normalize_surname"] = surname => surname + " normalized";
      });

      it("returns normalized", () => {
        expect(model.normalized("surname", "Jane Doe")).toEqual("Jane Doe normalized");
      });
    });

    context("with camelCaseFunction", () => {
      beforeEach(() => {
        model["normalizeName"] = name => "camelCase normalized " + name;
      });

      it("returns normalized", () => {
        expect(model.normalized("name", "John Doe")).toEqual("camelCase normalized John Doe");
      });
    });

    context("without function", () => {
      it("returns incoming value", () => {
        expect(model.normalized("attribute", "value")).toEqual("value");
      });
    });
  });

  describe("#denormalized", () => {
    context("with underscore_function", () => {
      beforeEach(() => {
        model["denormalize_base_price"] = price => price + 1;
      });

      it("returns denormalized", () => {
        expect(model.denormalized("base_price", 1)).toEqual(2);
      });
    });

    context("with camelCaseFunction", () => {
      beforeEach(() => {
        model["denormalizeDayInMonth"] = day => day * 2;
      });

      it("returns denormalized", () => {
        expect(model.denormalized("dayInMonth", 15)).toEqual(30);
      });
    });

    context("without function", () => {
      it("returns incoming value", () => {
        expect(model.denormalized("none", "value")).toEqual("value");
      });
    });
  });

  describe("#set", () => {
    beforeEach(() => {
      model["normalizeProperty"] = value => "normalized " + value;
    });

    beforeEach(() => {
      model.set({ property: "value" });
    });

    it("sets not normalized property", () => {
      model.set({ property: "value" });
      expect(model["property"]).toEqual("normalized value");
    });
  });

  describe("#duplicate", () => {
    beforeEach(() => {
      model.key = "key value";
      model["property"] = "value";
    });

    it("returns duplicate without key", () => {
      const duplicate = model.duplicate();
      expect(duplicate.key).toBeUndefined();
      expect(duplicate["property"]).toEqual("value");
    });
  });

  describe(".make", () => {
    class User extends Model {
      name: string;

      normalizeName(name: string) {
        return "normalized " + name;
      }
    }

    it("returns instance of itself", () => {
      const instance = User.make({});
      expect(instance).toBeInstanceOf(User);
    });

    it("sets normalized values", () => {
      const instance = User.make({ name: "John Doe" });
      expect(instance["name"]).toEqual("normalized John Doe");
    });
  });

  describe(".makeArray", () => {
    beforeEach(() => {
      Model.make = jest.fn().mockReturnValue("make") as any;
    });

    it("returns array responses from .make", () => {
      expect(Model.makeArray([{ name: "John doe" }])).toEqual(["make"]);
    });
  });

  describe("#reload", () => {
    beforeEach(() => {
      model.mockSelfMethod("find", promise);
      model.key = "uid";
    });

    it("calls .find and returns its promise", () => {
      expect(model.reload()).toBe(promise);
      expect(model.self.find).toHaveBeenCalledWith("uid");
    });
  });

  describe(".find", () => {
    beforeEach(() => {
      Model.store = { get: jest.fn().mockReturnValue(promise) } as any;
    });

    it("calls Store#get and returns its promise", () => {
      expect(Model.find("uid", options)).toBe(promise);
      expect(Model.store.get).toHaveBeenCalledWith("uid", options);
    });
  });

  describe(".all", () => {
    beforeEach(() => {
      Model.store = { index: jest.fn().mockReturnValue(promise) } as any;
    });

    it("calls Store#all and returns its promise", () => {
      expect(Model.all(options)).toBe(promise);
      expect(Model.store.index).toHaveBeenCalledWith(options);
    });
  });

  describe("#create", () => {
    beforeEach(() => {
      model.mockGetMethod("map");
      model.mockSelfMethod("create", promise);
    });

    it("calls .create returns its promise", () => {
      expect(model.create(options)).toBe(promise);
      expect(model.self.create).toHaveBeenCalledWith(model.map, options);
    });
  });

  describe(".create", () => {
    beforeEach(() => {
      Model.store = { create: jest.fn().mockReturnValue(promise) } as any;
    });

    it("calls Store#get and returns its promise ", () => {
      expect(Model.create("values" as any, options)).toBe(promise);
      expect(Model.store.create).toHaveBeenCalledWith("values", options);
    });
  });

  describe("#update", () => {
    beforeEach(() => {
      model.mockGetMethod("map");
      model.mockSelfMethod("update", promise);
      model.key = "uid";
    });

    it("calls .update and returns its promise", () => {
      expect(model.update(options)).toBe(promise);
      expect(model.self.update).toHaveBeenCalledWith("uid", model.map, options);
    });
  });

  describe(".update", () => {
    beforeEach(() => {
      Model.store = { update: jest.fn().mockReturnValue(promise) } as any;
    });

    it("calls Store#update and returns its promise", () => {
      expect(Model.update("uid", "values" as any, options)).toBe(promise);
      expect(Model.store.update).toHaveBeenCalledWith("uid", "values", options);
    });
  });

  describe("#save", () => {
    beforeEach(() => {
      model.mockGetMethod("map");
      model.mockSelfMethod("save", promise);
    });

    it("calls .save and returns its promise", () => {
      expect(model.save(options)).toBe(promise);
      expect(model.self.save).toHaveBeenCalledWith(model.map, options);
    });
  });

  describe(".save", () => {
    context("without key", () => {
      beforeEach(() => {
        Model.store = { create: jest.fn().mockReturnValue(promise) } as any;
      });

      it("calls Store#create and returns its promise", () => {
        const values = {
          name: "John Doe"
        };

        expect(Model.save(values, options)).toBe(promise);
        expect(Model.store.create).toHaveBeenCalledWith(values, options);
      });
    });

    context("with key", () => {
      beforeEach(() => {
        Model.store = { update: jest.fn().mockReturnValue(promise) } as any;
      });

      it("calls Store#update and returns its promise", () => {
        const values = {
          [model.keyColumn]: "uid",
          name: "John Doe"
        };

        expect(Model.save(values, options)).toBe(promise);
        expect(Model.store.update).toHaveBeenCalledWith("uid", values, options);
      });
    });
  });

  describe("#destroy", () => {
    beforeEach(() => {
      model.mockSelfMethod("destroy", promise);
      model.key = "uid";
    });

    it("calls .destroy and returns its promise", () => {
      expect(model.destroy(options)).toBe(promise);
      expect(model.self.destroy).toHaveBeenCalledWith("uid", options);
    });
  });

  describe(".destroy", () => {
    beforeEach(() => {
      Model.store = { destroy: jest.fn().mockReturnValue(promise) } as any;
    });

    it("calls Store#destroy and returns its promise", () => {
      expect(Model.destroy("uid", options)).toBe(promise);
      expect(Model.store.destroy).toHaveBeenCalledWith("uid", options);
    });
  });

  describe("#belongsTo", () => {
    beforeEach(() => {
      model.foreignKey = jest.fn().mockReturnValue("fk");
      ForeignModel.find = jest.fn().mockReturnValue("finding");
    });

    it("calls ForeignModel.find and returns its promise", () => {
      expect(model.belongsTo(ForeignModel, options)).toEqual("finding");
      expect(model.foreignKey).toHaveBeenCalledWith(ForeignModel);
      expect(ForeignModel.find).toHaveBeenCalledWith("fk", options);
    });
  });

  describe("#belongsToMany", () => {
    beforeEach(() => {
      model.foreignKey = jest.fn().mockReturnValue("fk");
      model.mockSelfMethod("belongsToMany", promise);
    });

    it("calls .belongsToMany and returns its promise", () => {
      expect(model.belongsToMany(ForeignModel, options)).toBe(promise);
      expect(model.foreignKey).toHaveBeenCalledWith(ForeignModel);
      expect(model.self.belongsToMany).toHaveBeenCalledWith(ForeignModel, "fk", options);
    });
  });

  describe(".belongsToMany", () => {
    beforeEach(() => {
      ForeignModel.hasMany = jest.fn().mockReturnValue(promise);
    });

    it("calls ForeignModel.hasMany and returns its promise", () => {
      expect(Model.belongsToMany(ForeignModel, "uid", options)).toBe(promise);
      expect(ForeignModel.hasMany).toHaveBeenCalledWith(Model, "uid", options);
    });
  });

  describe("#hasOne", () => {
    beforeEach(() => {
      model.mockSelfMethod("hasOne", promise);
      model.key = "uid";
    });

    it("calls .hasOne and returns its promise", () => {
      expect(model.hasOne(ForeignModel, options)).toBe(promise);
      expect(model.self.hasOne).toHaveBeenCalledWith(ForeignModel, "uid", options);
    });
  });

  describe(".hasOne", () => {
    beforeEach(() => {
      Model.store = { foreign: jest.fn().mockReturnValue(jest.fn()) } as any;
    });

    it("calls Store#foreign", () => {
      Model.hasOne(ForeignModel, "uid", options);
      expect(Model.store.foreign).toHaveBeenCalledWith(ForeignModel, "uid", options);
    });

    context("with at least one element in the response array", () => {
      beforeEach(() => {
        const result = ["having many", "something else"];
        Model.store = {
          foreign: jest.fn().mockReturnValue(Promise.resolve(result))
        } as any;
      });

      it("returns first element of the array", () => {
        expect(Model.hasOne(ForeignModel, "uid", options)).resolves.toEqual("having many");
      });
    });

    context("with empty response", () => {
      beforeEach(() => {
        const result = [];
        Model.store = {
          foreign: jest.fn().mockReturnValue(Promise.resolve(result))
        } as any;
      });

      it("returns null", () => {
        expect(Model.hasOne(ForeignModel, "uid", options)).resolves.toBeNull();
      });
    });
  });

  describe("#hasMany", () => {
    beforeEach(() => {
      model.mockSelfMethod("hasMany", promise);
      model.key = "uid";
    });

    it("calls .hasMany and returns its promise", () => {
      expect(model.hasMany(ForeignModel, options)).toBe(promise);
      expect(model.self.hasMany).toHaveBeenCalledWith(ForeignModel, "uid", options);
    });
  });

  describe(".hasMany", () => {
    beforeEach(() => {
      Model.store = { foreign: jest.fn().mockReturnValue(promise) } as any;
    });

    it("calls Store#hasMany and returns its promise", () => {
      expect(Model.hasMany(ForeignModel, "uid", options)).toBe(promise);
      expect(Model.store.foreign).toHaveBeenCalledWith(ForeignModel, "uid", options);
    });
  });

  describe("#act", () => {
    beforeEach(() => {
      model.mockSelfMethod("act", promise);
      model.key = "uid";
    });

    it("returns .act promise", () => {
      expect(model.act()).toEqual(promise);
    });

    context("without options", () => {
      it("calls .act with key as url", () => {
        model.act();
        expect(model.self.act).toHaveBeenCalledWith({ url: "uid" });
      });
    });

    context("without options.url", () => {
      it("calls .act with key as url", () => {
        model.act({});
        expect(model.self.act).toHaveBeenCalledWith({ url: "uid" });
      });
    });

    context("with options.url", () => {
      it("calls Store#act with given options", () => {
        const options = { url: "url" };
        model.act(options);
        expect(model.self.act).toHaveBeenCalledWith(options);
      });
    });
  });

  describe(".act", () => {
    beforeEach(() => {
      Model.store = { act: jest.fn().mockReturnValue(promise) } as any;
    });

    it("calls Store#hasMany and returns its promise", () => {
      expect(Model.act(options)).toBe(promise);
      expect(Model.store.act).toHaveBeenCalledWith(options);
    });
  });
});
