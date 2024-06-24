import {
  AssetDefinition,
  AssetResult,
  DesignUnit,
  _RequiredConfiguration
} from '@cesdk/cesdk-js';
import { ContentJSON } from './lib/loadAssetSourceFromContentJSON';
import { caseAssetPath } from './util';

export const pageFormatI18n = (formats: PageFormatAsset[]) => {
  return Object.fromEntries([
    ['libraries.pageFormats.label', 'Formats'],
    ...formats.map((format) => [`document.${format.id}`, format.label])
  ]);
};

export const PAGE_FORMATS_INSERT_ENTRY = {
  id: 'pageFormats',
  sourceIds: ['pageFormats'],

  previewLength: 3,
  gridColumns: 3,
  gridItemHeight: 'auto',

  previewBackgroundType: 'contain',
  gridBackgroundType: 'cover',
  cardLabel: (assetResult: AssetResult) => assetResult.label,
  cardLabelStyle: () => ({
    height: '24px',
    color: '#fff',
    width: '72px',
    left: '4px',
    right: '4px',
    bottom: '-32px',
    padding: '0',
    background: 'transparent',
    overflow: 'hidden',
    textOverflow: 'unset',
    whiteSpace: 'unset',
    fontSize: '10px',
    lineHeight: '12px',
    letterSpacing: '0.02em',
    textAlign: 'center',
    pointerEvents: 'none',
    pointer: 'default'
  }),
  cardStyle: () => ({
    height: '80px',
    width: '80px',
    marginBottom: '40px',
    overflow: 'visible'
  }),
  icon: () => caseAssetPath('/page-sizes-large-icon.svg'),
  title: ({ group }: { group: string }) => {
    if (group) {
      return `libraries.pageSizes.${group}.label`;
    }
    return undefined;
  }
};

export const formatAssetsToPresets = (
  contentJSON: ContentJSON
): PageFormatsDefinition => {
  const formatPresets = Object.entries(contentJSON.assets).map(
    ([_key, asset]) => {
      const { id } = asset;
      const { unit, formatWidth, formatHeight } = (asset as PageFormatAsset)
        .meta;

      const pageFormat: PageFormatsDefinition[string] = {
        width: formatWidth,
        height: formatHeight,
        unit,
        default: !!asset.meta!.default
      };
      return [id, pageFormat];
    }
  );
  return Object.fromEntries(formatPresets);
};

interface PageFormatAsset extends AssetDefinition {
  meta: {
    formatWidth: number;
    formatHeight: number;
    height: number;
    width: number;
    unit: DesignUnit;
    thumbUri: string;
  };
}
type PageFormatsDefinition = NonNullable<
  _RequiredConfiguration['ui']['pageFormats']
>;
