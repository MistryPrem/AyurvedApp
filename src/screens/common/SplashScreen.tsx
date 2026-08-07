import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, StatusBar } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

const { width } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const { colors, mode } = useTheme();
  const { t } = useLanguage();

  // Animation values
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(30)).current;
  const loaderWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sequence of animations
    Animated.sequence([
      // Fade in and scale logo
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 10,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
      // Fade in and slide up text
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(textTranslateY, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      // Animate progress bar loader
      Animated.timing(loaderWidth, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false, // width cannot use native driver
      }),
    ]).start(() => {
      // Small buffer after animation finishes
      setTimeout(() => {
        onFinish();
      }, 500);
    });
  }, [logoScale, logoOpacity, textOpacity, textTranslateY, loaderWidth, onFinish]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} />
      
      <View style={styles.centerContainer}>
        {/* Animated Leaf Logo Background / Glow */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              backgroundColor: mode === 'dark' ? 'rgba(77, 182, 172, 0.1)' : 'rgba(0, 77, 64, 0.05)',
              borderColor: colors.primary,
              transform: [{ scale: logoScale }],
              opacity: logoOpacity,
            },
          ]}
        >
          <Text style={styles.logoEmoji}>🌿</Text>
        </Animated.View>

        {/* Brand Text & Tagline */}
        <Animated.View
          style={{
            opacity: textOpacity,
            transform: [{ translateY: textTranslateY }],
            alignItems: 'center',
          }}
        >
          <Text style={[styles.title, { color: colors.primary }]}>Amrutam</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {t('app_tagline') || 'Your Personal Ayurvedic Wellness Guide'}
          </Text>
        </Animated.View>
      </View>

      {/* Modern Slim Loader Bar at Bottom */}
      <View style={styles.loaderContainer}>
        <View style={[styles.loaderBackground, { backgroundColor: colors.border }]}>
          <Animated.View
            style={[
              styles.loaderBar,
              {
                backgroundColor: colors.secondary,
                width: loaderWidth.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  logoContainer: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  logoEmoji: {
    fontSize: 60,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  loaderContainer: {
    position: 'absolute',
    bottom: 80,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  loaderBackground: {
    height: 4,
    width: width * 0.6,
    borderRadius: 2,
    overflow: 'hidden',
  },
  loaderBar: {
    height: '100%',
    borderRadius: 2,
  },
});
