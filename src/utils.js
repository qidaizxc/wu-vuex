export function assert (condition, msg) {
  if (!condition) throw new Error(`[store] ${msg}`)
}

export function forEachValue (obj, fn) {
  Object.keys(obj).forEach(key => fn(obj[key], key))
}

export function isObject(obj) {
  return obj !== null && typeof obj === 'object';
}

