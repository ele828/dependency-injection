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

// TODO: Refactor to use class instead of ENUM to determine Provider Type
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
  private static container = new Container();
  private static moduleRegistry = new ModuleRegistry();
  private static providerRegistry = new ProviderRegistry<Provider[]>();
  private static universalProviders = new Map<Token, UniversalProvider>();

  static resolveModuleProvider (provider: UniversalProvider, pending: Set<String> = new Set()) {
    const container = this.container;
    if (this.container.has(provider.token)) return;
    if (provider.type === ProviderType.Value) {
      container.set(provider.token, {
        value: provider.value,
        spread: provider.spread
      });
    } else if (provider.type === ProviderType.Factory) {
      const dependencies = this.resolveDependencies(provider.deps, pending);
      const factoryProvider = provider.func.apply(null, dependencies);
      container.set(provider.token, factoryProvider);
    } else if (provider.type === ProviderType.Class) {
      const moduleMetadata = this.moduleRegistry.get(provider.token);
      if (!moduleMetadata) throw new Error(`{${provider.token}} is not an valid Module`);
      const deps = moduleMetadata.deps;
      const klass = <Klass<any>>provider.func;
      if (!deps || deps.length === 0) {
        this.container.set(provider.token, (new klass));
        return;
      }
      const dependencies = this.resolveDependencies(deps, pending);
      const instance = new klass(dependencies);
      this.container.set(provider.token, instance);
    }
  }

  static resolveDependencies(deps, pending) {
    let dependencies = {};
    for (const dep of deps) {
      if (!this.container.has(dep)) {
        const dependentModuleProvider = this.universalProviders.get(dep);
        this.resolveModuleProvider(dependentModuleProvider, pending);
        if (!this.container.has(dep)) throw new Error(`Instance of {${dep}} is not found`);
      }
      const dependentModule = this.container.get(dep);
      // Value dependency and use spread, in this case, value object needs to be spreaded
      if ((<any>dependentModule).value !== undefined && (<any>dependentModule).spread) {
        dependencies = { ...dependencies, ...(<any>dependentModule).value }
      } else {
        dependencies[<any>dep] = dependentModule;
      }
    }
    return dependencies;
  }

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
    const universalProviders = this.universalProviders;
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
      const provider = providerQueue.shift();
      if (!container.has(provider.token)) {
        this.resolveModuleProvider(provider);
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
    // TODO: validate module providers
    // useValue should be object or number or string, etc.
    // spread can only be used if useValue is an object.
    this.providerRegistry.set(moduleFactoryName, metadata.providers);
  }
 
}