import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useAppState } from '../../context/AppStateContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import { Booking } from '../../types';

export const UpcomingConsultationsScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const { bookings, cancelBooking } = useAppState();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { showToast } = useToast();

  const handleCancel = (booking: Booking) => {
    Alert.alert(
      'Cancel Booking',
      `Are you sure you want to cancel your consultation with ${booking.doctorName}?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            cancelBooking(booking.id);
            showToast('Booking cancelled successfully.', 'info');
          },
        },
      ]
    );
  };

  const renderBooking = ({ item }: { item: Booking }) => {
    const isCancelled = item.status === 'CANCELLED';
    const isOffline = item.status === 'PENDING_OFFLINE';

    return (
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.headerRow}>
          <Text style={[styles.doctorName, { color: colors.text }]}>{item.doctorName}</Text>
          <Text
            style={[
              styles.statusTag,
              {
                backgroundColor: isCancelled
                  ? colors.error
                  : isOffline
                  ? colors.warning
                  : colors.success,
              },
            ]}>
            {item.status}
          </Text>
        </View>
        <Text style={[styles.specialty, { color: colors.primary }]}>{item.doctorSpecialty}</Text>
        <Text style={[styles.slotText, { color: colors.textSecondary }]}>🕒 {item.slot}</Text>
        <Text style={[styles.feeText, { color: colors.secondary }]}>Fee: ₹{item.fee}</Text>

        {!isCancelled && (
          <TouchableOpacity
            style={[styles.cancelBtn, { borderColor: colors.error }]}
            onPress={() => handleCancel(item)}>
            <Text style={[styles.cancelBtnText, { color: colors.error }]}>Cancel Booking</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.topHeader, { borderBottomColor: colors.border }]}>
        {navigation && (
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack ? navigation.goBack() : navigation.navigate('DoctorList')}>
            <Text style={[styles.backBtnText, { color: colors.primary }]}>← {t('back')}</Text>
          </TouchableOpacity>
        )}
        <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
          {t('upcomingConsultations')}
        </Text>
      </View>
      {bookings.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>
            No upcoming consultations booked yet.
          </Text>
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          renderItem={renderBooking}
          contentContainerStyle={styles.listContent}
        />
      )}
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
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  listContent: {
    padding: 16,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '700',
  },
  statusTag: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  specialty: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  slotText: {
    fontSize: 13,
    marginTop: 6,
  },
  feeText: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },
  cancelBtn: {
    marginTop: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
});
