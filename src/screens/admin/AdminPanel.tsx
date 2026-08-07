import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useDoctors } from '../../context/DoctorContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { Doctor } from '../../types';

export const AdminPanel: React.FC = () => {
  const { colors } = useTheme();
  const { showToast } = useToast();
  const { doctors, addDoctor, updateDoctor, deleteDoctor } = useDoctors();
  const { users, addDoctorCredentials, updateDoctorPassword, deleteUser } = useAuth();

  const [activeSegment, setActiveSegment] = useState<'doctors' | 'users'>('doctors');
  
  // Modal visibility states
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isResetModalVisible, setIsResetModalVisible] = useState(false);

  // Doctor form state
  const [docName, setDocName] = useState('');
  const [docSpecialty, setDocSpecialty] = useState('Kayachikitsa (Internal Medicine)');
  const [docFee, setDocFee] = useState('500');
  const [docExp, setDocExp] = useState('5');
  const [docHospital, setDocHospital] = useState('Amrutam Ayurvedic Wellness Center');
  const [docEmail, setDocEmail] = useState('');
  const [docPassword, setDocPassword] = useState('');

  // Edit / Reset password states
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [resettingUser, setResettingUser] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');

  const specialtiesList = [
    'Kayachikitsa (Internal Medicine)',
    'Panchakarma (Detoxification)',
    'Shalya Tantra (Surgery)',
    'Kaumarbhritya (Pediatrics)',
    'Shalakya Tantra (ENT & Ophthalmology)',
  ];

  const validateEmail = (emailStr: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(emailStr);
  };

  const handleAddDoctor = () => {
    const trimmedEmail = docEmail.trim();
    if (!docName.trim() || !trimmedEmail || !docPassword) {
      showToast('Please fill in Name, Email, and Password fields', 'warning');
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      showToast('Please enter a valid email address', 'warning');
      return;
    }

    const emailExists = users.some(u => u.email.toLowerCase() === trimmedEmail.toLowerCase());
    if (emailExists) {
      showToast('Email address already registered!', 'error');
      return;
    }

    // Add doctor to Doctor list
    const addedDoctor = addDoctor({
      name: docName.trim(),
      specialty: docSpecialty,
      consultationFee: parseFloat(docFee) || 500,
      experienceYears: parseInt(docExp, 10) || 5,
      hospital: docHospital.trim(),
      rating: 4.8,
      avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&q=80',
      availableSlots: ['09:00 AM', '11:00 AM', '03:00 PM'],
    });

    // Register credentials
    addDoctorCredentials(
      trimmedEmail,
      docPassword,
      docName.trim(),
      addedDoctor.id
    );

    showToast(`Doctor ${docName} added successfully!`, 'success');
    
    // Clear inputs and close modal
    setDocName('');
    setDocEmail('');
    setDocPassword('');
    setIsAddModalVisible(false);
  };

  const handleUpdateDoctor = () => {
    if (!editingDoctor) return;
    updateDoctor(editingDoctor);
    showToast('Doctor details updated!', 'success');
    setEditingDoctor(null);
    setIsEditModalVisible(false);
  };

  const handleResetPassword = () => {
    if (!resettingUser || !newPassword) return;
    const success = updateDoctorPassword(resettingUser, newPassword);
    if (success) {
      showToast(`Password updated for ${resettingUser}!`, 'success');
      setResettingUser(null);
      setNewPassword('');
      setIsResetModalVisible(false);
    } else {
      showToast('Failed to update password', 'error');
    }
  };

  const handleDeleteDoctor = (id: string, name: string) => {
    Alert.alert(
      'Delete Doctor',
      `Are you sure you want to delete ${name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const docUser = users.find(u => u.role === 'doctor' && u.doctorId === id);
            if (docUser) {
              deleteUser(docUser.email);
            }
            deleteDoctor(id);
            showToast('Doctor deleted', 'info');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={{ paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
      <Text style={[styles.title, { color: colors.text }]}>Admin Dashboard</Text>

      {/* Segment Selector */}
      <View style={[styles.segmentContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.segmentBtn, activeSegment === 'doctors' && { backgroundColor: colors.primary }]}
          onPress={() => setActiveSegment('doctors')}
        >
          <Text style={[styles.segmentText, { color: activeSegment === 'doctors' ? '#fff' : colors.textSecondary }]}>
            🌿 Doctors
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.segmentBtn, activeSegment === 'users' && { backgroundColor: colors.primary }]}
          onPress={() => setActiveSegment('users')}
        >
          <Text style={[styles.segmentText, { color: activeSegment === 'users' ? '#fff' : colors.textSecondary }]}>
            👥 Registered Users
          </Text>
        </TouchableOpacity>
      </View>

      {activeSegment === 'doctors' ? (
        <View>
          {/* Header Row with Registry Title and Add button in top-right */}
          <View style={styles.headerRow}>
            <Text style={[styles.sectionHeader, { color: colors.text, marginTop: 0 }]}>Doctors Registry ({doctors.length})</Text>
            <TouchableOpacity 
              style={[styles.addDoctorBtn, { backgroundColor: colors.primary }]}
              onPress={() => setIsAddModalVisible(true)}
            >
              <Text style={styles.addDoctorBtnText}>+ Add Doctor</Text>
            </TouchableOpacity>
          </View>

          {/* List Doctors */}
          {doctors.map(doc => {
            const correspondingUser = users.find(u => u.role === 'doctor' && u.doctorId === doc.id);
            return (
              <View key={doc.id} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, marginBottom: 8 }]}>
                <Text style={[styles.docNameText, { color: colors.text }]}>{doc.name}</Text>
                <Text style={{ color: colors.textSecondary, fontSize: 13 }}>{doc.specialty}</Text>
                <Text style={{ color: colors.textMuted, fontSize: 12 }}>Hospital: {doc.hospital}</Text>
                <Text style={{ color: colors.textMuted, fontSize: 12 }}>Fee: ₹{doc.consultationFee}</Text>
                {correspondingUser && (
                  <Text style={{ color: colors.primary, fontSize: 12, fontWeight: '600', marginTop: 4 }}>
                    Email: {correspondingUser.email}
                  </Text>
                )}

                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: colors.primaryLight }]}
                    onPress={() => {
                      setEditingDoctor(doc);
                      setIsEditModalVisible(true);
                    }}
                  >
                    <Text style={styles.actionBtnText}>✏️ Edit</Text>
                  </TouchableOpacity>

                  {correspondingUser && (
                    <TouchableOpacity
                      style={[styles.actionBtn, { backgroundColor: colors.chipBackground }]}
                      onPress={() => {
                        setResettingUser(correspondingUser.email);
                        setIsResetModalVisible(true);
                      }}
                    >
                      <Text style={[styles.actionBtnText, { color: colors.text }]}>🔑 Password</Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: colors.error }]}
                    onPress={() => handleDeleteDoctor(doc.id, doc.name)}
                  >
                    <Text style={styles.actionBtnText}>🗑️ Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      ) : (
        <View>
          <Text style={[styles.sectionHeader, { color: colors.text, marginTop: 0 }]}>All Registered Accounts</Text>
          {users.map(u => (
            <View key={u.email} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, marginBottom: 8 }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text style={[styles.docNameText, { color: colors.text }]}>{u.fullName}</Text>
                  <Text style={{ color: colors.textSecondary, fontSize: 13 }}>Email: {u.email}</Text>
                  <Text style={{ color: colors.textMuted, fontSize: 12, fontWeight: '700', marginTop: 4 }}>
                    Role: {u.role.toUpperCase()}
                  </Text>
                </View>
                {u.role !== 'admin' && (
                  <TouchableOpacity
                    style={[styles.deleteMiniBtn, { backgroundColor: colors.error }]}
                    onPress={() => {
                      Alert.alert('Delete Account', `Are you sure you want to delete user ${u.email}?`, [
                        { text: 'Cancel', style: 'cancel' },
                        {
                          text: 'Delete',
                          style: 'destructive',
                          onPress: () => {
                            if (u.role === 'doctor' && u.doctorId) {
                              deleteDoctor(u.doctorId);
                            }
                            deleteUser(u.email);
                            showToast('Account deleted', 'info');
                          }
                        }
                      ]);
                    }}
                  >
                    <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>Remove</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>
      )}

      {/* 1. ADD DOCTOR MODAL */}
      <Modal visible={isAddModalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View style={styles.modalOverlay}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} keyboardShouldPersistTaps="handled">
              <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Add New Doctor</Text>
                
                <TextInput
                  style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
                  placeholder="Doctor Name"
                  placeholderTextColor={colors.textMuted}
                  value={docName}
                  onChangeText={setDocName}
                />

                <View style={styles.pickerContainer}>
                  <Text style={[styles.label, { color: colors.textSecondary }]}>Specialty</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 8 }}>
                    {specialtiesList.map(spec => (
                      <TouchableOpacity
                        key={spec}
                        style={[
                          styles.chip,
                          { backgroundColor: colors.background },
                          docSpecialty === spec && { backgroundColor: colors.primary }
                        ]}
                        onPress={() => setDocSpecialty(spec)}
                      >
                        <Text style={{ color: docSpecialty === spec ? '#fff' : colors.text }}>
                          {spec.split(' ')[0]}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                <TextInput
                  style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
                  placeholder="Consultation Fee (₹)"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                  value={docFee}
                  onChangeText={setDocFee}
                />

                <TextInput
                  style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
                  placeholder="Experience Years"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                  value={docExp}
                  onChangeText={setDocExp}
                />

                <TextInput
                  style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
                  placeholder="Hospital/Clinic name"
                  placeholderTextColor={colors.textMuted}
                  value={docHospital}
                  onChangeText={setDocHospital}
                />

                <Text style={[styles.sectionSubtitle, { color: colors.primary }]}>Login Credentials</Text>

                <TextInput
                  style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
                  placeholder="Email Address"
                  placeholderTextColor={colors.textMuted}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={docEmail}
                  onChangeText={setDocEmail}
                />

                <TextInput
                  style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
                  placeholder="Password"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry
                  autoCapitalize="none"
                  value={docPassword}
                  onChangeText={setDocPassword}
                />

                <View style={styles.modalBtnRow}>
                  <TouchableOpacity style={[styles.modalBtn, { backgroundColor: colors.border }]} onPress={() => setIsAddModalVisible(false)}>
                    <Text style={{ color: colors.text }}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.modalBtn, { backgroundColor: colors.primary }]} onPress={handleAddDoctor}>
                    <Text style={{ color: '#fff', fontWeight: '700' }}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* 2. EDIT DOCTOR MODAL */}
      <Modal visible={isEditModalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
              {editingDoctor && (
                <>
                  <Text style={[styles.modalTitle, { color: colors.text }]}>Edit: {editingDoctor.name}</Text>
                  
                  <TextInput
                    style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
                    placeholder="Doctor Name"
                    value={editingDoctor.name}
                    onChangeText={txt => setEditingDoctor({ ...editingDoctor, name: txt })}
                  />
                  <TextInput
                    style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
                    placeholder="Hospital"
                    value={editingDoctor.hospital}
                    onChangeText={txt => setEditingDoctor({ ...editingDoctor, hospital: txt })}
                  />
                  <TextInput
                    style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
                    placeholder="Fee"
                    keyboardType="numeric"
                    value={String(editingDoctor.consultationFee)}
                    onChangeText={txt => setEditingDoctor({ ...editingDoctor, consultationFee: parseFloat(txt) || 0 })}
                  />

                  <View style={styles.modalBtnRow}>
                    <TouchableOpacity style={[styles.modalBtn, { backgroundColor: colors.border }]} onPress={() => setIsEditModalVisible(false)}>
                      <Text style={{ color: colors.text }}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.modalBtn, { backgroundColor: colors.primary }]} onPress={handleUpdateDoctor}>
                      <Text style={{ color: '#fff', fontWeight: '700' }}>Save Changes</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* 3. RESET PASSWORD MODAL */}
      <Modal visible={isResetModalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Reset Password for {resettingUser}</Text>
              <TextInput
                style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
                placeholder="New Password"
                placeholderTextColor={colors.textMuted}
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <View style={styles.modalBtnRow}>
                <TouchableOpacity style={[styles.modalBtn, { backgroundColor: colors.border }]} onPress={() => setIsResetModalVisible(false)}>
                  <Text style={{ color: colors.text }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalBtn, { backgroundColor: colors.primary }]} onPress={handleResetPassword}>
                  <Text style={{ color: '#fff', fontWeight: '700' }}>Reset</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  segmentContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    padding: 4,
    marginBottom: 16,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '700',
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
  pickerContainer: {
    marginBottom: 10,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  sectionSubtitle: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 10,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  docNameText: {
    fontSize: 15,
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  actionBtn: {
    flex: 0.31,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  deleteMiniBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addDoctorBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addDoctorBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
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
  modalBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  modalBtn: {
    flex: 0.48,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
});
