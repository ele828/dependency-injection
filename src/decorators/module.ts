import Klass from "../types/Klass";
import { Metadata } from "../types/metadata";

/**
 * @Module() decorator
 * Used for declaring dependencies and metadata when defines a module
 */
export default function Module (metadata?: Metadata) {
  return function (target: Klass<any>, propertyKey: string, descriptor: PropertyDescriptor) {
    
  }
}