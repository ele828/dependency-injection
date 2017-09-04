import Token from './types/token';
import Klass from './types/Klass';
import Container from './container';
import ModuleRegistry from './registry/module_registry';
import ProviderRegistry from './registry/provider_registry';
import { ModuleFactoryMetadata, ModuleMetadata } from './types/metadata';
import * as Errors from './errors';
import { isFunction, isObject, isArray, isValueProvider, isStaticClassProvider, isExistingProvider, isFactoryProvider, isConstructorProvider, isClassProvider } from './utils/is_type';
import { isEmpty, isAnonymousFunction, getParentClass } from './utils/utils';
import { Provider, ClassProvider, StaticClassProvider, ExistingProvider, FactoryProvider, ConstructorProvider, ValueProvider } from './types/provider';

export enum ProviderType {
  Class,
  Value,
  Factory
}

export class UniversalProvider {
  constructor(
    public token: Token,
    public type: ProviderType,
    public func: Klass<any> | Function = null,
    public deps: any[] = [],
    public value: any = null,
    public spread: boolean = false
  ) {}
}

export default class Injector {
  private static container = new Container<Klass<any>>();
  private static moduleRegistry = new ModuleRegistry();
  private static providerRegistry = new ProviderRegistry<Provider>();

  // Entrypoint of the framework
  static bootstrap<T>(klass: Klass<T>) {
    const entryClassName = klass.name;
    const entryClassMetadata = this.providerRegistry.get(entryClassName);

    // Combine providers of all ancestors modules
    let providerMetadata: Provider[] = [];
    for (
      let currentClass = klass;
      !isEmpty(currentClass.name);
      currentClass = getParentClass(currentClass)
    ) {
      const currentProviderMetadata = this.providerRegistry.get(currentClass.name);
      providerMetadata = providerMetadata.concat(currentProviderMetadata)
    }

    // Iterate through all provider metadata
    // Discard providers in parent class overwritten by children
    const universalProviders = new Map<Token, UniversalProvider>();
    for (const provider of providerMetadata) {
      if (isValueProvider(provider)) {
        if (!universalProviders.has(provider.provide)) {
          universalProviders.set(
            provider.provide,
            new UniversalProvider(provider.provide, ProviderType.Value, null, null, provider.useValue, provider.spread)
          );
        }
      } else if (isStaticClassProvider(provider)) {
        if (!universalProviders.has(provider.provide)) {
          universalProviders.set(
            provider.provide,
            new UniversalProvider(provider.provide, ProviderType.Class, provider.useClass, provider.deps)
          );
        }
      } else if (isExistingProvider(provider)) {
        if (!universalProviders.has(provider.provide)) {
          universalProviders.set(
            provider.provide,
            new UniversalProvider(provider.provide, ProviderType.Class, provider.useExisting)
          );
        }
      } else if (isFactoryProvider(provider)) {
        if (!universalProviders.has(provider.provide)) {
          universalProviders.set(
            provider.provide,
            new UniversalProvider(provider.provide, ProviderType.Factory, provider.useFactory, provider.deps)
          );
        }
      } else if (isConstructorProvider(provider)) {
        if (!universalProviders.has(provider.provide.name)) {
          universalProviders.set(
            provider.provide.name,
            new UniversalProvider(provider.provide.name, ProviderType.Class, provider.provide, provider.deps)
          );
        }
      } else if (isClassProvider(provider)) {
        if (!universalProviders.has(provider.name)) {
          universalProviders.set(
            provider.name,
            new UniversalProvider(provider.name, ProviderType.Class, provider)
          );
        }
      } else {
        throw new Error('Invalid provider format');
      }
    }

    // Resolve dependencies and create instances of provides
    const container = this.container;
    const providerQueue = Array.from(universalProviders.values());
    while (providerQueue.length > 0) {
      const provider = providerQueue.pop();
      if (provider.type === ProviderType.Value) {
        container.set(provider.token, provider.value);
      } else if (provider.type === ProviderType.Class) {
        const moduleMetadata = this.moduleRegistry.get(provider.token);
        // TODO
      }
    }
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