import Klass from '../types/Klass';
import { ModuleMetadata } from '../types/metadata';
import Injector from '../injector';

/**
 * @Module() decorator
 * Used for declaring dependencies and metadata when defines a module
 */
export default function Module (metadata?: ModuleMetadata): Function {
  return function<T extends Klass<T>> (constructor: T) {
    console.log('@Module', constructor.name, metadata);
    Injector.registerModule(constructor, metadata);
  }
}