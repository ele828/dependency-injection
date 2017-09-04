import { Provider, ValueProvider, StaticClassProvider, ExistingProvider, FactoryProvider, ConstructorProvider, ClassProvider } from "../types/provider";

export function isObject(x: any): x is Object {
  return typeof x === 'object';
}

export function isFunction (x: any): x is Function {
  return typeof x === 'function';
}

export function isArray (x: any): x is Array<any> {
  return !!Array.isArray
    ? Array.isArray(x)
    : Object.prototype.toString.call(x).slice(8, -1) === 'Array';
}

/**
 * Provider type guard functions
 */
const USE_VALUE = 'useValue';
export function isValueProvider(provider: Provider): provider is ValueProvider {
  return USE_VALUE in provider;
}

export function isStaticClassProvider(provider: Provider): provider is StaticClassProvider {
  return (<StaticClassProvider>provider).useClass !== undefined;
}

export function isExistingProvider(provider: Provider): provider is ExistingProvider {
  return (<ExistingProvider>provider).useExisting !== undefined;
}

export function isFactoryProvider(provider: Provider): provider is FactoryProvider {
  return (<FactoryProvider>provider).useFactory !== undefined;
}

export function isConstructorProvider(provider: Provider): provider is ConstructorProvider {
  return (<ConstructorProvider>provider).provide !== undefined;
}

export function isClassProvider(provider: Provider): provider is ClassProvider {
  return isFunction(provider);
}