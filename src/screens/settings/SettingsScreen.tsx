import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Switch, ScrollView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

export const SettingsScreen: React.FC = () => {
  const { mode, toggleTheme, colors } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { showToast } = useToast();
  const { logout, userProfile } = useAuth();

  const handleLanguageToggle = () => {
    const next = language === 'en' ? 'hi' : 'en';
    setLanguage(next);
    showToast(`Language switched to ${next === 'en' ? 'English' : 'Hindi'}`, 'info');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <Text style={[styles.title, { color: colors.text }]}>{t('settings')}</Text>

        {/* User Profile Card Header */}
        {userProfile && (
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, marginBottom: 16 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={[styles.profileAvatar, { backgroundColor: colors.primary }]}>
                <Text style={styles.profileAvatarText}>
                  {userProfile.fullName ? userProfile.fullName.charAt(0).toUpperCase() : 'U'}
                </Text>
              </View>
              <View style={{ marginLeft: 16 }}>
                <Text style={[styles.profileName, { color: colors.text }]}>{userProfile.fullName}</Text>
                <Text style={[styles.profileMeta, { color: colors.textSecondary }]}>
                  {userProfile.email} • {userProfile.role.toUpperCase()}
                </Text>
              </View>
            </View>
          </View>
        )}

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.text }]}>Dark Mode</Text>
            <Switch value={mode === 'dark'} onValueChange={toggleTheme} trackColor={{ false: '#767577', true: colors.primary }} />
          </View>

          <View style={[styles.row, { borderTopWidth: 1, borderTopColor: colors.border }]}>
            <Text style={[styles.label, { color: colors.text }]}>Language / भाषा</Text>
            <TouchableOpacity
              style={[styles.langBtn, { backgroundColor: colors.primary }]}
              onPress={handleLanguageToggle}>
              <Text style={styles.langText}>{language === 'en' ? 'English' : 'हिंदी'}</Text>
            </TouchableOpacity>
          </View>
        </View>



        <Text style={[styles.sectionHeader, { color: colors.text }]}>Account</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.text }]}>
              Active Session
            </Text>
            <TouchableOpacity
              style={[styles.logoutBtn, { backgroundColor: colors.error }]}
              onPress={() => {
                logout();
                showToast('Logged out successfully', 'info');
              }}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 10,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
  },
  langBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  langText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  logoutBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  logoutText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  flagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  flagKey: {
    fontSize: 14,
    fontWeight: '600',
  },
  flagValStatus: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileAvatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
  },
  profileMeta: {
    fontSize: 13,
    marginTop: 2,
  },
});
