const DIContainer = require("./di-container");

describe("DIContainer", () => {
  describe("GIVEN registered factories and dependencies", () => {
    let testContext = {};
    describe("WHEN .get", () => {
      beforeAll(() => {
        prepareTestContext(testContext);
        DIContainer.get("ChildClass");
      });
      it("SHOULD call the class dependency1Spy once", function () {
        expect(testContext.dependency1Spy).toBe(1);
      });
      it("SHOULD call the class dependency2Spy once", function () {
        expect(testContext.dependency2Spy).toBe(1);
      });
      it("SHOULD call the class parentSpy once", function () {
        expect(testContext.parentSpy).toBe(1);
      });
      it("SHOULD call the class childSpy once", function () {
        expect(testContext.childSpy).toBe(1);
      });
    });
  });
});

function prepareTestContext(testContext) {
  testContext.simpleObject = { attribute: "ok" };
  testContext.dependency1Spy = 0;
  testContext.dependency2Spy = 0;
  testContext.parentSpy = 0;
  testContext.childSpy = 0;
  class Dependency1 {
    constructor() {
      testContext.dependency1Spy++;
    }
  }
  class Dependency2 {
    constructor() {
      testContext.dependency2Spy++;
    }
  }
  class ParentClass {
    static dependencies = ["Dependency1"];
    constructor() {
      testContext.parentSpy++;
    }
  }
  class ChildClass extends ParentClass {
    static dependencies = ["Dependency2"];
    constructor(...args) {
      super(...args);
      testContext.childSpy++;
    }
  }
  DIContainer.register("Dependency1", Dependency1);
  DIContainer.register("Dependency2", Dependency2);
  DIContainer.register({ ChildClass });
}
