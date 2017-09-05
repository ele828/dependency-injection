import Klass from "../types/Klass";

const STRING_CAMELIZE_REGEXP_1 = (/(\-|\_|\.|\s)+(.)?/g);
const STRING_CAMELIZE_REGEXP_2 = (/(^|\/)([A-Z])/g);

export function isEmpty(param) {
  return !param || param.length === 0;
}

export function isAnonymousFunction(param) {
  return param && param === 'Function';
}

export function getParentClass<T>(klass: Klass<T>) {
  return (klass as any).__proto__;
}

// Transfrom string to camel case, from Ember String
export function camelize(key: string | any): string {
  return key.replace(STRING_CAMELIZE_REGEXP_1, (match, separator, chr) => chr ? chr.toUpperCase() : '').replace(STRING_CAMELIZE_REGEXP_2, (match, separator, chr) => match.toLowerCase())
}