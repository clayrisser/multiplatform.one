import { Asset } from './types';

export function useAssets(modules: any | any[]): (Asset | undefined)[] {
  const modulesArr = (Array.isArray(modules) ? modules : [modules]).map((module: any) => {
    if (typeof module.default !== 'undefined' && module.__esModule === true) return module.default;
    return module;
  });
  return modulesArr.map((module: WebModule) =>
    typeof module === 'string'
      ? {
          uri: module,
        }
      : {
          uri: module.src,
          height: module.height,
          blurDataURL: module.blurDataURL,
          width: module.width,
        },
  );
}

type WebModule =
  | string
  | {
      blurDataURL?: string;
      height?: 850;
      src: string;
      width?: 1024;
    };

export { Asset };
