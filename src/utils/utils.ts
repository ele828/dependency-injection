export function isEmpty (param) {
  return !param || param.length === 0;
}

export function isAnonymousFunction(param) {
  return param && param === 'Function';
}