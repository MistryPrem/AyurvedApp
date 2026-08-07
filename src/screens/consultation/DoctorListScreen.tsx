import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { DoctorCard } from '../../components/consultation/DoctorCard';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useDoctors } from '../../context/DoctorContext';
import { Doctor } from '../../types';

const SPECIALTY_FILTERS = [
  'All',
  'Kayachikitsa (Internal Medicine)',
  'Panchakarma (Detoxification)',
  'Shalya Tantra (Surgery)',
  'Kaumarbhritya (Pediatrics)',
];

export const DoctorListScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { doctors } = useDoctors();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');

  // Filter doctors cleanly with useMemo
  const filteredDoctors = useMemo(() => {
    let result = doctors;

    if (selectedSpecialty !== 'All') {
      result = result.filter((doc) => doc.specialty === selectedSpecialty);
    }

    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (doc) => doc.name.toLowerCase().includes(q) || doc.specialty.toLowerCase().includes(q)
      );
    }

    return result;
  }, [doctors, searchQuery, selectedSpecialty]);

  const renderItem = useCallback(
    ({ item }: { item: Doctor }) => (
      <DoctorCard
        doctor={item}
        onPress={() => navigation.navigate('DoctorDetail', { doctor: item })}
      />
    ),
    [navigation]
  );

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: 94,
      offset: 94 * index,
      index,
    }),
    []
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <TextInput
          style={[styles.searchInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
          placeholder={t('searchDoctor')}
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <View style={styles.filterRow}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={SPECIALTY_FILTERS}
            keyExtractor={(item) => item}
            renderItem={({ item }) => {
              const active = item === selectedSpecialty;
              return (
                <TouchableOpacity
                  style={[
                    styles.chip,
                    {
                      backgroundColor: active ? colors.primary : colors.chipBackground,
                    },
                  ]}
                  onPress={() => setSelectedSpecialty(item)}>
                  <Text
                    style={[
                      styles.chipText,
                      { color: active ? '#FFFFFF' : colors.primary },
                    ]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>

      <Text style={[styles.resultCount, { color: colors.textSecondary }]}>
        Showing {filteredDoctors.length} doctors available
      </Text>

      <FlatList
        data={filteredDoctors}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 12,
    borderBottomWidth: 1,
  },
  searchInput: {
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  filterRow: {
    marginTop: 10,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  resultCount: {
    fontSize: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    fontWeight: '500',
  },
});
