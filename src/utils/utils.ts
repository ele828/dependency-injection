import Klass from "../types/Klass";

export function isEmpty(param) {
  return !param || param.length === 0;
}

export function isAnonymousFunction(param) {
  return param && param === 'Function';
}

export function getParentClass<T>(klass: Klass<T>) {
  return (klass as any).__proto__;
}