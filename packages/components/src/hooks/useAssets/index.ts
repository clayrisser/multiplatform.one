import type { StaticImageData } from 'next/dist/client/image';

export function useAssets(modules: any | any[]): (StaticImageData | undefined)[] {
  const modulesArr: (StaticImageData | undefined)[] = (Array.isArray(modules) ? modules : [modules]).map(
    (module: any) => {
      if (typeof module.default !== 'undefined') return module.default;
      return module;
    },
  );
  return modulesArr;
}
