import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base design reference (standard mobile screen width 375px e.g., iPhone 11/13/14)
const baseWidth = 375;
const baseHeight = 812;

export const scaleWidth = (size: number): number => {
  return Math.round((SCREEN_WIDTH / baseWidth) * size);
};

export const scaleHeight = (size: number): number => {
  return Math.round((SCREEN_HEIGHT / baseHeight) * size);
};

export const scaleFont = (size: number): number => {
  const scale = SCREEN_WIDTH / baseWidth;
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

export const isTablet = (): boolean => {
  return SCREEN_WIDTH >= 768;
};

export const getGridColumns = (): number => {
  if (SCREEN_WIDTH >= 1024) return 4;
  if (SCREEN_WIDTH >= 768) return 3;
  return 2;
};

export const layoutDimensions = {
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,
  isTablet: isTablet(),
  gridColumns: getGridColumns(),
};
