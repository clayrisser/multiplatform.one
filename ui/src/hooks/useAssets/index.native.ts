import type { Asset as ExpoAsset } from 'expo-asset';
import { Asset } from './types';
import { useAssets as expoUseAssets } from 'expo-asset';

const logger = console;

export function useAssets(modules: any | any[]): (Asset | undefined)[] {
  const modulesArr = (Array.isArray(modules) ? modules : [modules]).map((module: any) => {
    if (typeof module.default !== 'undefined' && module.__esModule === true) return module.default;
    return module;
  });
  const [assets, err] = expoUseAssets(modulesArr);
  if (err) logger.error(err);
  if (!assets) return new Array(modulesArr.length);
  return assets.map((asset: ExpoAsset) => ({
    type: asset.type,
    uri: asset.uri,
    width: asset.width || undefined,
    height: asset.height || undefined,
    name: asset.name,
    hash: asset.hash,
    localUri: asset.localUri,
    downloading: asset.downloading,
    downloaded: asset.downloaded,
  }));
}
