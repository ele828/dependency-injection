import Klass from "../types/Klass";
import { Metadata } from "../types/metadata";

/**
 * @ModuleFactory() decorator
 * Used for defining a root module of the system and also declare and import dependencies injected into the system.
 */
export default function ModuleFactory (metadata?: Metadata) {
  return function classDecorator<T extends Klass<T>>(constructor: T) {

  }
}