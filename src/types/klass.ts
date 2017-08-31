/**
 * Represents for a class type
 */
export default interface Klass<T> extends Function { new (...args: any[]): T; }