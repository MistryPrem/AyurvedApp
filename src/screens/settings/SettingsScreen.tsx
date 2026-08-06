import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Switch } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAppState } from '../../context/AppStateContext';
import { featureFlags } from '../../services/featureFlags';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';

export const SettingsScreen: React.FC = () => {
  const { mode, toggleTheme, colors } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { showToast } = useToast();
  const [flags, setFlags] = React.useState(featureFlags.getAllFlags());

  const handleLanguageToggle = () => {
    const next = language === 'en' ? 'hi' : 'en';
    setLanguage(next);
    showToast(`Language switched to ${next === 'en' ? 'English' : 'Hindi'}`, 'info');
  };

  const handleFlagToggle = (key: keyof typeof flags) => {
    const newVal = !flags[key];
    featureFlags.setFlag(key, newVal);
    setFlags(featureFlags.getAllFlags());
    showToast(`Feature "${key}" set to ${newVal ? 'ENABLED' : 'DISABLED'}`, 'info');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>{t('settings')}</Text>

      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.text }]}>Dark Mode</Text>
          <Switch value={mode === 'dark'} onValueChange={toggleTheme} color={colors.primary} />
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

      <Text style={[styles.sectionHeader, { color: colors.text }]}>Feature Flags & Remote Config</Text>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        {Object.entries(flags).map(([key, val], idx) => (
          <View
            key={key}
            style={[
              styles.flagRow,
              idx > 0 && { borderTopWidth: 1, borderTopColor: colors.border },
            ]}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={[styles.flagKey, { color: colors.text }]}>{key}</Text>
              <Text style={[styles.flagValStatus, { color: val ? colors.success : colors.error }]}>
                {val ? 'ENABLED' : 'DISABLED'}
              </Text>
            </View>
            <Switch
              value={val}
              onValueChange={() => handleFlagToggle(key as any)}
              color={colors.primary}
            />
          </View>
        ))}
      </View>
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
});
