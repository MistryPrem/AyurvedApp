import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Doctor } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAppState } from '../../context/AppStateContext';
import { useNetwork } from '../../context/NetworkContext';
import { useToast } from '../../context/ToastContext';
import { offlineSync } from '../../services/offlineSync';
import { FallbackImage } from '../../components/common/FallbackImage';

export const DoctorDetailScreen: React.FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const { doctor } = route.params as { doctor: Doctor };
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { addBooking, bookings } = useAppState();
  const { isOnline } = useNetwork();
  const { showToast } = useToast();

  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // Check double booking attempts
  const isSlotBooked = (slot: string) => {
    return bookings.some(
      (b) => b.doctorId === doctor.id && b.slot === slot && b.status !== 'CANCELLED'
    );
  };

  const handleBookSlot = () => {
    if (!selectedSlot) {
      showToast('Please select an available slot first.', 'warning');
      return;
    }

    if (isSlotBooked(selectedSlot)) {
      showToast('Double booking error: You already have a booking for this slot!', 'error');
      return;
    }

    if (!isOnline) {
      // Offline queued booking handling
      offlineSync.enqueueAction('BOOK_CONSULTATION', {
        doctorId: doctor.id,
        doctorName: doctor.name,
        slot: selectedSlot,
      });
      addBooking(
        {
          doctorId: doctor.id,
          doctorName: doctor.name,
          doctorSpecialty: doctor.specialty,
          slot: selectedSlot,
          bookingDate: new Date().toISOString().split('T')[0],
          fee: doctor.consultationFee,
        },
        true
      );
      showToast('Offline Mode: Booking queued for auto-sync!', 'info');
      navigation.navigate('UpcomingConsultations');
      return;
    }

    addBooking({
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialty,
      slot: selectedSlot,
      bookingDate: new Date().toISOString().split('T')[0],
      fee: doctor.consultationFee,
    });

    showToast('Consultation Booked Successfully!', 'success');
    navigation.navigate('UpcomingConsultations');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.topHeader, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack ? navigation.goBack() : navigation.navigate('DoctorList')}>
          <Text style={[styles.backBtnText, { color: colors.primary }]}>← {t('back')}</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
          {doctor.name}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.profileHeader, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <FallbackImage
            source={{ uri: doctor.avatarUrl }}
            fallbackType="avatar"
            iconSize={40}
            style={styles.avatar}
          />
          <Text style={[styles.name, { color: colors.text }]}>{doctor.name}</Text>
          <Text style={[styles.specialty, { color: colors.primary }]}>{doctor.specialty}</Text>
          <Text style={[styles.hospital, { color: colors.textSecondary }]}>{doctor.hospital}</Text>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: colors.secondary }]}>★ {doctor.rating}</Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>Rating</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: colors.text }]}>{doctor.experienceYears} Yrs</Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>Experience</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: colors.primary }]}>₹{doctor.consultationFee}</Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>Fee</Text>
            </View>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Select Available Slot</Text>

        <View style={styles.slotsGrid}>
          {doctor.availableSlots.map((slot) => {
            const booked = isSlotBooked(slot);
            const isSelected = selectedSlot === slot;

            return (
              <TouchableOpacity
                key={slot}
                disabled={booked}
                style={[
                  styles.slotChip,
                  {
                    backgroundColor: booked
                      ? colors.border
                      : isSelected
                      ? colors.primary
                      : colors.surface,
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => setSelectedSlot(slot)}>
                <Text
                  style={[
                    styles.slotText,
                    {
                      color: booked
                        ? colors.textMuted
                        : isSelected
                        ? '#FFFFFF'
                        : colors.text,
                    },
                  ]}>
                  {slot} {booked ? '(Booked)' : ''}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[styles.bookButton, { backgroundColor: colors.primary }]}
          onPress={handleBookSlot}>
          <Text style={styles.bookButtonText}>Confirm & Book Consultation</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    paddingRight: 12,
  },
  backBtnText: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    flex: 1,
  },
  content: {
    padding: 16,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
  },
  specialty: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  hospital: {
    fontSize: 13,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8E5',
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  slotChip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
  },
  slotText: {
    fontSize: 13,
    fontWeight: '600',
  },
  bookButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
