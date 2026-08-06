import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Doctor } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { isTablet, scaleFont, scaleWidth } from '../../utils/responsive';
import { FallbackImage } from '../common/FallbackImage';

interface Props {
  doctor: Doctor;
  onPress: () => void;
}

export const DoctorCard = React.memo<Props>(({ doctor, onPress }) => {
  const { colors } = useTheme();
  const tablet = isTablet();

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          padding: tablet ? 18 : 12,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={`Doctor ${doctor.name}, ${doctor.specialty}`}>
      <FallbackImage
        source={{ uri: doctor.avatarUrl }}
        fallbackType="avatar"
        iconSize={tablet ? 36 : 28}
        style={[
          styles.avatar,
          {
            width: tablet ? 84 : 70,
            height: tablet ? 84 : 70,
            borderRadius: tablet ? 42 : 35,
          },
        ]}
      />
      <View style={styles.infoContainer}>
        <Text style={[styles.name, { color: colors.text, fontSize: scaleFont(16) }]} numberOfLines={1}>
          {doctor.name}
        </Text>
        <Text style={[styles.specialty, { color: colors.primary, fontSize: scaleFont(13) }]} numberOfLines={1}>
          {doctor.specialty}
        </Text>
        <Text style={[styles.hospital, { color: colors.textSecondary, fontSize: scaleFont(12) }]} numberOfLines={1}>
          🏥 {doctor.hospital}
        </Text>
        <View style={styles.metaRow}>
          <Text style={[styles.badge, { backgroundColor: colors.chipBackground, color: colors.primary, fontSize: scaleFont(11) }]}>
            ★ {doctor.rating}
          </Text>
          <Text style={[styles.metaText, { color: colors.textMuted, fontSize: scaleFont(12) }]}>
            {doctor.experienceYears} yrs exp
          </Text>
          <Text style={[styles.feeText, { color: colors.secondary, fontSize: scaleFont(14) }]}>
            ₹{doctor.consultationFee}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  avatar: {
    backgroundColor: '#E0E0E0',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  name: {
    fontWeight: '700',
  },
  specialty: {
    fontWeight: '600',
    marginTop: 2,
  },
  hospital: {
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  badge: {
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    overflow: 'hidden',
  },
  metaText: {
    marginLeft: 10,
  },
  feeText: {
    fontWeight: '700',
    marginLeft: 'auto',
  },
});
