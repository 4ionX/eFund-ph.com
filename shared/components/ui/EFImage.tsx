import React from 'react';
import { Image as ExpoImage } from 'expo-image';
import type { ImageStyle, ViewProps } from 'react-native';

type Props = ViewProps & {
  style?: ImageStyle;
  source: string | number | { uri: string } | null | undefined;
  contentFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  transition?: number;
};

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

// eslint-disable-next-line react/display-name
const EFImage = React.memo(
  ({ style, source, contentFit = 'cover', transition = 200 }: Props) => {
    if (!source) return null;

    const imageSource = typeof source === 'string' ? { uri: source } : source;

    return (
      <ExpoImage
        style={style}
        source={imageSource}
        placeholder={blurhash}
        contentFit={contentFit}
        transition={transition}
      />
    );
  },
);

export default EFImage;
