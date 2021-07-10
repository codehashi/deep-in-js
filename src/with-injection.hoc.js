function withInjection(classWithDependencies) {
  console.assert(classWithDependencies, "withInjection: null input");
  const newClass = class extends classWithDependencies {
    constructor(...args) {
      super(...args);
      classWithDependencies.dependencies?.forEach((fieldName, index) => {
        this[fieldName] = args[index];
      });
    }
  };
  return newClass;
}

module.exports = withInjection;
