export const isObject = p => typeof p === 'object';

export const isFunction = p => typeof p === 'function';

export const isArray = p =>
  !!Array.isArray
  ? Array.isArray(p)
  : Object.prototype.toString.call(p).slice(8, -1) === 'Array';