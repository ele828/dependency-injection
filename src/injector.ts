import Token from './types/token';
import Klass from './types/Klass';
import ModuleRegistry from './registry/module_registry';
import ProviderRegistry from './registry/provider_registry';
import { ModuleFactoryMetadata, ModuleMetadata } from './types/metadata';
import * as Errors from './errors';
import { isFunction, isObject, isArray } from './utils/is_type';

export class Record<T> extends Map<Token, T> {}

export default class Injector {
  private static Record = new Record();
  private static moduleRegistry = new ModuleRegistry();
  private static providerRegistry = new ProviderRegistry();

  // Entrypoint of the framework
  static bootstrap<T>(klass: Klass<T>) {
    const entryClassName = klass.name;
    console.log('bootstraping', entryClassName);
    const entryClassMetadata = this.providerRegistry.get(entryClassName);
    console.log('entryClassMetadata', entryClassMetadata);
  }
  
  static registerModule<T extends Klass<T>>(constructor: T, metadata: ModuleMetadata = {}) {
    const moduleName = constructor.name;
    if (!constructor || !isFunction(constructor)) {
      throw Errors.InvalidModuleTypeError;
    }
    if (metadata && !isObject(metadata)) {
      throw Errors.InvalidModuleParameterError;
    }
    this.moduleRegistry.set(moduleName, metadata);
  }

  static registerModuleProvider<T extends Klass<T>>(constructor: T, metadata: ModuleFactoryMetadata) {
    const moduleFactoryName = constructor.name;
    if (!constructor || !isFunction(constructor)) {
      throw Errors.InvalidModuleFactoryTypeError;
    } 
    if (metadata && !isObject(metadata)) {
      throw Errors.InvalidModuleFactoryParameterError;
    }
    if (!isArray(metadata.providers)) {
      throw Errors.InvalidProviderTypeError;
    }
    if (!metadata.providers) {
      throw Errors.NoProvidersFoundError;
    }
    this.providerRegistry.set(moduleFactoryName, metadata.providers);
  }
 
}