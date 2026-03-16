const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

const platform = isBrowser ? navigator.platform : '';
const ua = isBrowser ? navigator.userAgent : '';

const isMac = isBrowser && /Mac/.test(platform);
const isIOS = isBrowser && /iPhone|iPad|iPod/.test(platform) && !(window as any).MSStream;

export const hasNativeSupport = isIOS || (isMac && /Safari/.test(ua) && !/Chrome/.test(ua));
export const isAppleDevice = isIOS || isMac;
