import { ModuleMetadata } from "../types/metadata";

export default class ModuleRegistry extends Map<String, ModuleMetadata> {
  get(module: String) {
    if (!this.has(module)) {
      throw new Error(`Can not find module {${module}} in ModuleRegistry`);
    }
    return super.get(module);
  }

  set(module: String, metadata: ModuleMetadata) {
    if (this.has(module)) {
      throw new Error(`Can only register {${module}} once`);
    }
    return super.set(module, metadata);
  }
}