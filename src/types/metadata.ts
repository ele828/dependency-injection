import { Provider } from "./provider";
import Token from "./token";

/**
 * Valid metadata for Module decorator
 * TODO: needs to be more specific
 */
export interface ModuleMetadata extends Object {
  deps?: Array<Token>;
}

/**
 * Valid metadata for ModuleFactory decorator
 * TODO: needs to be more specific
 */
export interface ModuleFactoryMetadata extends Object {
  providers: Array<Provider>;
}