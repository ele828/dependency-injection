import Klass from "../types/Klass";
import { ModuleFactoryMetadata } from "../types/metadata";
import Injector from "../injector";

/**
 * @ModuleFactory() decorator
 * Used for defining a root module of the system and also declare and import dependencies injected into the system.
 */
export default function ModuleFactory (metadata?: ModuleFactoryMetadata): Function {
  return function<T extends Klass<T>> (constructor: T) {
    console.log('@ModuleFactory', constructor.name, metadata);
    Injector.registerModuleProvider(constructor, metadata);
  }
}