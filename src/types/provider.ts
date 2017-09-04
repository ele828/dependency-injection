import Klass from './klass';
import Token from './token';

/**
 * Provides class type directly
 */
export interface ClassProvider extends Klass<any> {}

/**
 * Provides values.
 * Usually used for configuration options
 */
export interface ValueProvider {
  /**
   * Injection token.
   */
  provide: Token;

  /**
   * Value to be injected.
   */
  useValue: any;

  /**
   * when provided value is an object, we could directly spread object,
   * it can be used in configurations or multiple injections.
   */
  spread?: boolean;
}

export interface StaticClassProvider {
  /**
   * Injection token.
   */
  provide: Token;

  /**
   * Class to instantiate for the token.
   */
  useClass: Klass<any>;

  /**
   * Inject dependencies to class constructor manually.
   */
  deps?: any[];
}

export interface ConstructorProvider {
  provide: Klass<any>;
  deps?: any[];
}

export interface ExistingProvider {
  provide: any;
  useExisting: any;
}

export interface FactoryProvider {
  provide: any;
  useFactory: Function;
  deps?: any[];
}

export type Provider = ClassProvider | ValueProvider | StaticClassProvider | ConstructorProvider | ExistingProvider | FactoryProvider;