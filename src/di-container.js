const DIContainer = {
  classes: {},
  dependencies: {},

  /**
   * Register a class in the injection container.
   *
   * @param {Object|String} key name of the class, or an object containing a set of key/values to register
   * @param {*} value the class to be instantiated
   */
  register(hashOrKey, value) {
    if (typeof hashOrKey === "object") {
      Object.keys(hashOrKey).forEach((k) => this.register(k, hashOrKey[k]));
    } else {
      this.classes[hashOrKey] = value;
    }
  },

  inject(registeredClass, name) {
    const dependencies = this.getRecursiveDependencies(registeredClass, []);
    if (registeredClass.constructor) {
      return new registeredClass(...dependencies);
    }
    const typeOfFactory = typeof registeredClass;
    if (typeOfFactory !== "function") {
      throw new Error(
        `Could not inject dependency: "${name}" (type=${typeOfFactory})`
      );
    }
    return registeredClass(...dependencies);
  },

  getRecursiveDependencies(klass, deps) {
    if (!klass) return deps;
    let newDeps = deps;
    if (klass.constructor) {
      const parentClass = Object.getPrototypeOf(klass);
      if (parentClass) {
        newDeps = this.getRecursiveDependencies(parentClass, deps);
      }
    }
    const thisDeps = klass.dependencies
      ? klass.dependencies.map((arg) => this.get(arg))
      : [];
    newDeps.push(...thisDeps);
    return newDeps;
  },

  get(name) {
    if (!this.dependencies[name]) {
      const registeredClass = this.classes[name];
      if (registeredClass) {
        try {
          // console.log(`Injecting ${name}`);
          this.dependencies[name] = this.inject(registeredClass, name);
        } catch (error) {
          console.warn({
            message: `Error loading class: ${name}; dependencies=${registeredClass.dependencies}`,
          });
          console.error(error);
          throw error;
        }
      } else {
        throw new Error("No class registered with key " + name);
      }
    }
    return this.dependencies[name];
  },
};

module.exports = DIContainer;
