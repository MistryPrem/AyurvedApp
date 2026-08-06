import React, { useState } from 'react';
import { View, Image, ImageProps, StyleSheet, Text, StyleProp, ViewStyle, ImageStyle } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export interface FallbackImageProps extends Omit<ImageProps, 'source'> {
  source?: { uri?: string | null } | number | null;
  fallbackType?: 'avatar' | 'product' | 'record' | 'general';
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ImageStyle>;
  iconSize?: number;
}

export const FallbackImage: React.FC<FallbackImageProps> = ({
  source,
  fallbackType = 'general',
  containerStyle,
  style,
  iconSize = 24,
  ...props
}) => {
  const { colors } = useTheme();
  const [hasError, setHasError] = useState(false);

  const uri = typeof source === 'object' && source !== null ? source.uri : null;
  const isLocalSource = typeof source === 'number';
  const hasValidUri = Boolean(isLocalSource || (uri && uri.trim().length > 0));

  if (!hasValidUri || hasError) {
    let iconEmoji = '🖼️';
    if (fallbackType === 'avatar') iconEmoji = '👤';
    else if (fallbackType === 'product') iconEmoji = '🌿';
    else if (fallbackType === 'record') iconEmoji = '📄';

    return (
      <View
        style={[
          styles.fallbackContainer,
          { backgroundColor: colors.surface, borderColor: colors.border },
          style as ViewStyle,
          containerStyle,
        ]}>
        <Text style={{ fontSize: iconSize }}>{iconEmoji}</Text>
      </View>
    );
  }

  return (
    <Image
      {...props}
      source={source as ImageProps['source']}
      style={style}
      onError={() => setHasError(true)}
    />
  );
};

const styles = StyleSheet.create({
  fallbackContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    overflow: 'hidden',
  },
});
