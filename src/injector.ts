import Token from './types/token';
import Klass from './types/Klass';
import ModuleRegistry from './registry/module_registry';
import ProviderRegistry from './registry/provider_registry';
import { ModuleFactoryMetadata, ModuleMetadata } from './types/metadata';
import * as Errors from './errors';
import { isFunction, isObject, isArray } from './utils/is_type';
import { isEmpty, isAnonymousFunction } from './utils/utils';
import { Provider } from './types/provider';

export class Record<T> extends Map<Token, T> {}

function recursivelyResolveModules() {}

function getParentClass<T>(klass: Klass<T>) {
  return (klass as any).__proto__;
}

const USE_VALUE = 'useValue';

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

    // Combine providers of all ancestors modules
    let providerMetadata = [];
    for (
      let currentClass = klass;
      !isEmpty(currentClass.name);
      currentClass = getParentClass(currentClass)
    ) {
      console.log('currentClass:', currentClass);
      const currentProviderMetadata = this.providerRegistry.get(currentClass.name);
      providerMetadata = providerMetadata.concat(currentProviderMetadata)
    }
    console.log('providerMetadata:', providerMetadata);

    // Iterate through all provider metadata
    for (const metadata of providerMetadata) {
      // KlassProvider
      if (USE_VALUE in metadata) {
        
      } else if (metadata.useClass) {

      } else if (metadata.useExisting) {

      } else if (metadata.useFactory) {

      } else if (isFunction(metadata)) {

      } else {
        throw new Error();
      }
    }

    // Resolve dependencies and create instances
  }
  
  static registerModule<T extends Klass<T>>(constructor: T, metadata: ModuleMetadata) {
    if (!constructor || !isFunction(constructor)) {
      throw Errors.InvalidModuleTypeError;
    }
    const moduleName = constructor.name;
    if (isEmpty(moduleName)) {
      throw Errors.InvalidModuleTypeError;
    }
    if (isAnonymousFunction(moduleName)) {
      throw Errors.AnonymousFunctionError;
    }
    if (metadata && !isObject(metadata)) {
      throw Errors.InvalidModuleParameterError;
    }
    if (!metadata) {
      metadata = null;
    }
    this.moduleRegistry.set(moduleName, metadata);
  }

  static registerModuleProvider<T extends Klass<T>>(constructor: T, metadata: ModuleFactoryMetadata) {
    if (!constructor || !isFunction(constructor)) {
      throw Errors.InvalidModuleFactoryTypeError;
    }
    const moduleFactoryName = constructor.name;
    if (isEmpty(moduleFactoryName)) {
      throw Errors.InvalidModuleFactoryTypeError;
    }
    if (isAnonymousFunction(moduleFactoryName)) {
      throw Errors.AnonymousFunctionError;
    }
    if (metadata && !isObject(metadata)) {
      throw Errors.InvalidModuleFactoryParameterError;
    }
    if (metadata && metadata.providers && !isArray(metadata.providers)) {
      throw Errors.InvalidProviderTypeError;
    }
    if (!metadata.providers) {
      throw Errors.NoProvidersFoundError;
    }
    if (!metadata) {
      metadata = null;
    }
    this.providerRegistry.set(moduleFactoryName, metadata.providers);
  }
 
}