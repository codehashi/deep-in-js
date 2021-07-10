const withInjection = require("./with-injection");

class BaseModule extends withInjection(Object) {
  constructor(...args) {
    super(...args);
    if (this.constructor.proxied)
      this.defineProxiedAttributes(this, this.constructor.proxied);
  }

  defineProxiedAttributes(target, childMethods) {
    Object.keys(childMethods).forEach((childName) => {
      childMethods[childName].forEach((methodName) => {
        const source = target[childName][methodName];
        if (typeof source === "function") {
          target[methodName] = (...args) => source(...args);
        } else {
          target[methodName] = source;
        }
      });
    });
  }
}

module.exports = BaseModule;
