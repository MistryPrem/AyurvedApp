import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useAppState } from '../../context/AppStateContext';
import { useToast } from '../../context/ToastContext';
import { generateHealthRecords } from '../../data/generators';
import { HealthRecord } from '../../types';

export const DoctorPanel: React.FC = () => {
  const { userProfile } = useAuth();
  const { colors } = useTheme();
  const { bookings, addHealthRecord, customHealthRecords, updateBookingStatus } = useAppState();
  const { showToast } = useToast();

  // Selected patient/appointment for modal interaction
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [consultationNote, setConsultationNote] = useState('');
  const [isConsultModalVisible, setIsConsultModalVisible] = useState(false);
  const [isRecordsModalVisible, setIsRecordsModalVisible] = useState(false);

  const scrollViewRef = React.useRef<ScrollView>(null);
  const [scheduleY, setScheduleY] = useState(0);
  const [patientsY, setPatientsY] = useState(0);

  // Pre-seed some mock static records for history view
  const BASE_RECORDS = useMemo(() => generateHealthRecords(20), []);

  // Pre-seeded static appointments
  const MOCK_APPOINTMENTS = [
    { id: '1', patientName: 'Aarav Sharma', slot: '10:00 AM', condition: 'Vata Imbalance & Joint Pain', status: 'CONFIRMED' },
    { id: '2', patientName: 'Priya Patel', slot: '11:30 AM', condition: 'Pitta Skin Care & Detox consultation', status: 'CONFIRMED' },
    { id: '3', patientName: 'Rohan Verma', slot: '02:30 PM', condition: 'Chronic Indigestion (Kapha)', status: 'CONFIRMED' },
  ];

  const MOCK_PATIENTS = [
    { id: 'p1', name: 'Aarav Sharma', age: 34, gender: 'Male', lastVisit: '2026-07-15' },
    { id: 'p2', name: 'Priya Patel', age: 29, gender: 'Female', lastVisit: '2026-08-01' },
    { id: 'p3', name: 'Rohan Verma', age: 45, gender: 'Male', lastVisit: '2026-07-28' },
  ];

  // Dynamic booked appointments from user side matching this doctor
  const dynamicAppointments = useMemo(() => {
    return bookings
      .filter(b => b.doctorId === userProfile?.doctorId)
      .map(b => ({
        id: b.id,
        patientName: b.patientName || 'Ayurvedic Patient',
        slot: b.slot,
        condition: 'Online Consultation Request',
        status: b.status,
      }));
  }, [bookings, userProfile]);

  // Combine dynamic bookings with mock schedule
  const allAppointments = useMemo(() => {
    return [...dynamicAppointments, ...MOCK_APPOINTMENTS];
  }, [dynamicAppointments]);

  // Handle consultation form submission
  const handleSubmitConsultation = () => {
    if (!consultationNote.trim()) {
      showToast('Please enter consultation notes', 'warning');
      return;
    }

    // Add new health record
    addHealthRecord({
      id: `hr_${Date.now()}`,
      title: `Consultation Note - ${selectedPatient}`,
      type: 'Consultation',
      date: new Date().toISOString().split('T')[0],
      doctorName: userProfile?.fullName || 'Doctor',
      facility: 'Amrutam Clinic',
      summary: consultationNote.trim(),
      tags: ['prescription', 'ayurvedic-plan'],
      thumbnailUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=200&q=80',
    });

    showToast('Consultation note saved successfully!', 'success');
    setConsultationNote('');
    setIsConsultModalVisible(false);
  };

  // Get records history for selected patient
  const patientRecords = useMemo(() => {
    if (!selectedPatient) return [];
    const allRecs = [...customHealthRecords, ...BASE_RECORDS];
    // Filter records containing patient name or matching consultation notes
    return allRecs.filter(r => 
      r.title.toLowerCase().includes(selectedPatient.toLowerCase()) ||
      r.summary.toLowerCase().includes(selectedPatient.toLowerCase()) ||
      r.doctorName?.toLowerCase().includes(selectedPatient.toLowerCase())
    );
  }, [selectedPatient, customHealthRecords, BASE_RECORDS]);

  return (
    <ScrollView
      ref={scrollViewRef}
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: 32 }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Text style={[styles.welcomeText, { color: colors.textSecondary }]}>Welcome Back,</Text>
        <Text style={[styles.doctorName, { color: colors.primary }]}>{userProfile?.fullName || 'Doctor'}</Text>
        <Text style={[styles.roleBadge, { backgroundColor: colors.chipBackground, color: colors.primary }]}>
          🧑‍⚕️ DUTY DOCTOR
        </Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <TouchableOpacity
          style={[styles.statsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={() => scrollViewRef.current?.scrollTo({ y: scheduleY, animated: true })}
        >
          <Text style={styles.statsEmoji}>📅</Text>
          <Text style={[styles.statsNumber, { color: colors.text }]}>{allAppointments.length}</Text>
          <Text style={[styles.statsLabel, { color: colors.textSecondary }]}>Appointments</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.statsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={() => scrollViewRef.current?.scrollTo({ y: patientsY, animated: true })}
        >
          <Text style={styles.statsEmoji}>👥</Text>
          <Text style={[styles.statsNumber, { color: colors.text }]}>{MOCK_PATIENTS.length}</Text>
          <Text style={[styles.statsLabel, { color: colors.textSecondary }]}>Active Patients</Text>
        </TouchableOpacity>
      </View>

      {/* Appointments List */}
      <Text
        style={[styles.sectionHeader, { color: colors.text }]}
        onLayout={e => setScheduleY(e.nativeEvent.layout.y)}
      >
        Today's Schedule
      </Text>
      {allAppointments.length === 0 ? (
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, padding: 24, alignItems: 'center' }]}>
          <Text style={{ color: colors.textMuted }}>No appointments scheduled for today</Text>
        </View>
      ) : (
        allAppointments.map(item => (
          <View key={item.id} style={[styles.itemCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.slotRow}>
              <Text style={[styles.slotTime, { color: colors.secondary }]}>⏰ {item.slot}</Text>
              <View style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    item.status === 'CONFIRMED' ? 'rgba(56, 142, 60, 0.1)' :
                    item.status === 'CANCELLED' ? 'rgba(211, 47, 47, 0.1)' : 'rgba(245, 124, 0, 0.1)'
                }
              ]}>
                <Text style={{
                  fontSize: 10,
                  fontWeight: '700',
                  color:
                    item.status === 'CONFIRMED' ? colors.success :
                    item.status === 'CANCELLED' ? colors.error : colors.warning
                }}>
                  {item.status === 'CANCELLED' ? 'REJECTED' : item.status}
                </Text>
              </View>
            </View>
            <Text style={[styles.patientNameText, { color: colors.text }]}>{item.patientName}</Text>
            <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: 2 }}>{item.condition}</Text>

            <View style={styles.actionRow}>
              {item.status === 'PENDING' ? (
                <>
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: colors.success, marginRight: 8, flex: 0.5 }]}
                    onPress={() => {
                      updateBookingStatus(item.id, 'CONFIRMED');
                      showToast('Appointment confirmed!', 'success');
                    }}
                  >
                    <Text style={styles.actionBtnText}>Confirm</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: colors.error, flex: 0.5 }]}
                    onPress={() => {
                      updateBookingStatus(item.id, 'CANCELLED');
                      showToast('Appointment rejected', 'info');
                    }}
                  >
                    <Text style={styles.actionBtnText}>Reject</Text>
                  </TouchableOpacity>
                </>
              ) : item.status === 'CONFIRMED' ? (
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: colors.primary, flex: 1 }]}
                  onPress={() => {
                    setSelectedPatient(item.patientName);
                    setIsConsultModalVisible(true);
                  }}
                >
                  <Text style={styles.actionBtnText}>Start Consultation</Text>
                </TouchableOpacity>
              ) : (
                <Text style={{ color: colors.textMuted, fontStyle: 'italic', fontSize: 13 }}>No actions available (Rejected)</Text>
              )}
            </View>
          </View>
        ))
      )}

      {/* Patient List */}
      <Text
        style={[styles.sectionHeader, { color: colors.text }]}
        onLayout={e => setPatientsY(e.nativeEvent.layout.y)}
      >
        My Patients
      </Text>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        {MOCK_PATIENTS.map((p, idx) => (
          <View key={p.id} style={[styles.patientRow, idx > 0 && { borderTopWidth: 1, borderTopColor: colors.border }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.patientName, { color: colors.text }]}>{p.name}</Text>
              <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                {p.gender}, {p.age} years old • Last Visit: {p.lastVisit}
              </Text>
            </View>
            <TouchableOpacity 
              style={[styles.viewRecordsBtn, { borderColor: colors.primary }]}
              onPress={() => {
                setSelectedPatient(p.name);
                setIsRecordsModalVisible(true);
              }}
            >
              <Text style={{ color: colors.primary, fontSize: 12, fontWeight: '700' }}>View Records</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* 1. START CONSULTATION MODAL */}
      <Modal visible={isConsultModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Consultation note for {selectedPatient}</Text>
            
            <TextInput
              style={[styles.textArea, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
              placeholder="Write prescription, diagnosis, or wellness recommendations..."
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={6}
              value={consultationNote}
              onChangeText={setConsultationNote}
            />

            <View style={styles.modalBtnRow}>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: colors.border }]} onPress={() => setIsConsultModalVisible(false)}>
                <Text style={{ color: colors.text }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: colors.primary }]} onPress={handleSubmitConsultation}>
                <Text style={{ color: '#fff', fontWeight: '700' }}>Save Consultation</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 2. VIEW RECORDS MODAL */}
      <Modal visible={isRecordsModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface, maxHeight: '80%' }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Medical Records: {selectedPatient}</Text>
            
            <ScrollView style={{ marginVertical: 12 }}>
              {patientRecords.length === 0 ? (
                <Text style={{ color: colors.textSecondary, textAlign: 'center', marginVertical: 16 }}>
                  No previous health records found for this patient.
                </Text>
              ) : (
                patientRecords.map(rec => (
                  <View key={rec.id} style={[styles.recordItem, { borderColor: colors.border }]}>
                    <View style={styles.recordHeader}>
                      <Text style={[styles.recordTitle, { color: colors.primary }]}>{rec.title}</Text>
                      <Text style={{ color: colors.textMuted, fontSize: 11 }}>{rec.date}</Text>
                    </View>
                    <Text style={[styles.recordSummary, { color: colors.text }]}>{rec.summary}</Text>
                    <Text style={{ color: colors.textSecondary, fontSize: 11, marginTop: 4 }}>
                      Facility: {rec.facility} • Doctor: {rec.doctorName}
                    </Text>
                  </View>
                ))
              )}
            </ScrollView>

            <TouchableOpacity style={[styles.closeBtn, { backgroundColor: colors.primary }]} onPress={() => setIsRecordsModalVisible(false)}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: '500',
  },
  doctorName: {
    fontSize: 26,
    fontWeight: '800',
    marginTop: 2,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statsCard: {
    flex: 0.48,
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
  },
  statsEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  statsNumber: {
    fontSize: 20,
    fontWeight: '800',
  },
  statsLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  sectionHeader: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 12,
    marginTop: 8,
  },
  itemCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  slotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  slotTime: {
    fontSize: 13,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  patientNameText: {
    fontSize: 16,
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: 12,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  patientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  patientName: {
    fontSize: 15,
    fontWeight: '600',
  },
  viewRecordsBtn: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    borderRadius: 16,
    padding: 20,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    height: 120,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  modalBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalBtn: {
    flex: 0.48,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeBtn: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  recordItem: {
    borderBottomWidth: 1,
    paddingVertical: 12,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  recordTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  recordSummary: {
    fontSize: 13,
    lineHeight: 18,
  },
});
