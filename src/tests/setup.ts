import '@testing-library/jest-dom';

// Stub window.scrollTo and scrollIntoView for JSDOM
Object.defineProperty(window, 'scrollTo', {
  value: () => {},
  writable: true,
});

if (typeof Element !== 'undefined') {
  Element.prototype.scrollIntoView = () => {};
}

// Polyfill matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});
