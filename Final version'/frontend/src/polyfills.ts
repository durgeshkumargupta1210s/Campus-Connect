// Polyfill for module in browser environment
if (typeof globalThis.module === 'undefined') {
  globalThis.module = {
    exports: {}
  };
}

if (typeof globalThis.exports === 'undefined') {
  globalThis.exports = {};
}

export default {};
