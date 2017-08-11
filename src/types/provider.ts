export interface Type<T> extends Function { new (...args: any[]): T; }

export interface ValueProvider {
  /**
   * Injection token.
   */
  provide: any;

  /**
   * Value to be injected.
   */
  useValue: any;

  /**
   * when provided value is an object, we could directly spread object,
   * it can be used in configurations or multiple injections.
   */
  spread: boolean;
}

export interface StaticClassProvider {
  /**
   * Injection token.
   */
  provide: any;

  /**
   * Class to instantiate for the token.
   */
  useClass: Type<any>;

  /**
   * Inject dependencies to class constructor manually.
   */
  deps: any[];
}