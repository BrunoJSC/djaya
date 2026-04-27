// Mock for next/config — used by Storybook's preview.js
// Next.js 15.6 canary doesn't export this module in a Vite-compatible way

export function setConfig(_config: any) {
  // noop
}

export function getConfig() {
  return {
    publicRuntimeConfig: {},
    serverRuntimeConfig: {},
  };
}

export default { setConfig, getConfig };
