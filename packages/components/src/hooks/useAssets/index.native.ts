import type { Asset } from "expo-asset";
import { useAssets as expoUseAssets } from "expo-asset";

const logger = console;

type StaticImageData = any;

export function useAssets(
  modules: any | any[],
): (StaticImageData | undefined)[] {
  const modulesArr = (Array.isArray(modules) ? modules : [modules]).map(
    (module: any) => {
      if (typeof module.default !== "undefined") return module.default;
      return module;
    },
  );
  const [assets, err] = expoUseAssets(modulesArr);
  if (err) logger.error(err);
  if (!assets) return new Array(modulesArr.length);
  return assets.map((asset: Asset) => ({
    height: asset.height!,
    src: asset.uri,
    width: asset.width!,
  }));
}
