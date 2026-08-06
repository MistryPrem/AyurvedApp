import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Image,
} from 'react-native';
import { generateHealthRecords } from '../../data/generators';
import { RecordCard } from '../../components/health/RecordCard';
import { useTheme } from '../../context/ThemeContext';
import { useAppState } from '../../context/AppStateContext';
import { BiometricService } from '../../services/biometrics';
import { useToast } from '../../context/ToastContext';
import { HealthRecord, RecordType } from '../../types';
import { FallbackImage } from '../../components/common/FallbackImage';

const BASE_RECORDS = generateHealthRecords(10000);

const RECORD_TYPES: ('All' | RecordType)[] = [
  'All',
  'Lab Report',
  'Prescription',
  'Consultation',
  'Vaccination',
  'Allergy',
];

export const HealthTimelineScreen: React.FC = () => {
  const { colors } = useTheme();
  const { customHealthRecords } = useAppState();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'All' | RecordType>('All');
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Combine static generated 10,000 dataset with custom added records
  const allRecords = useMemo(() => {
    return [...customHealthRecords, ...BASE_RECORDS];
  }, [customHealthRecords]);

  // Filter 10,000 records & group by Month/Year
  const groupedSections = useMemo(() => {
    let filtered = allRecords;

    if (selectedType !== 'All') {
      filtered = filtered.filter((r) => r.type === selectedType);
    }

    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q)) ||
          r.facility.toLowerCase().includes(q)
      );
    }

    // Grouping logic: "August 2026", "July 2026", etc.
    const groups: { [key: string]: HealthRecord[] } = {};

    filtered.forEach((rec) => {
      const [year, monthStr] = rec.date.split('-');
      const dateObj = new Date(parseInt(year), parseInt(monthStr) - 1, 1);
      const groupKey = dateObj.toLocaleString('en-US', { month: 'long', year: 'numeric' });

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(rec);
    });

    return Object.keys(groups).map((monthYear) => ({
      title: monthYear,
      data: groups[monthYear],
    }));
  }, [allRecords, selectedType, searchQuery]);

  const handleAuthCheck = async (record: HealthRecord) => {
    const success = await BiometricService.authenticate('Access Lab Report');
    if (success) {
      setSelectedRecord(record);
    } else {
      showToast('Biometric authentication failed', 'error');
    }
  };

  const renderRecordItem = useCallback(
    ({ item }: { item: HealthRecord }) => (
      <RecordCard record={item} onPress={() => handleAuthCheck(item)} />
    ),
    []
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header Search & Filter */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <TextInput
          style={[styles.searchInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
          placeholder="Search 10,000 health records by tag, lab..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <View style={styles.filterRow}>
          {RECORD_TYPES.map((t) => {
            const active = t === selectedType;
            return (
              <TouchableOpacity
                key={t}
                style={[
                  styles.chip,
                  { backgroundColor: active ? colors.primary : colors.chipBackground },
                ]}
                onPress={() => setSelectedType(t)}>
                <Text style={[styles.chipText, { color: active ? '#FFFFFF' : colors.primary }]}>
                  {t}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Grouped Month/Year SectionList */}
      <SectionList
        sections={groupedSections}
        keyExtractor={(item) => item.id}
        renderItem={renderRecordItem}
        renderSectionHeader={({ section: { title } }) => (
          <View style={[styles.sectionHeader, { backgroundColor: colors.background }]}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>{title}</Text>
          </View>
        )}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
      />

      {/* Attachment Preview Modal */}
      <Modal
        visible={!!selectedRecord}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSelectedRecord(null)}>
        <View style={[styles.modalOverlay, { backgroundColor: colors.modalOverlay }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>{selectedRecord?.title}</Text>
            <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
              {selectedRecord?.type} • {selectedRecord?.date}
            </Text>

            <FallbackImage
              source={{ uri: selectedRecord?.thumbnailUrl }}
              fallbackType="record"
              iconSize={48}
              style={styles.previewImage}
            />

            <Text style={[styles.summaryText, { color: colors.text }]}>{selectedRecord?.summary}</Text>

            <TouchableOpacity
              style={[styles.closeBtn, { backgroundColor: colors.primary }]}
              onPress={() => setSelectedRecord(null)}>
              <Text style={styles.closeBtnText}>Close Attachment</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    fontSize: 13,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  modalSubtitle: {
    fontSize: 13,
    marginTop: 4,
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginVertical: 16,
  },
  summaryText: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 20,
  },
  closeBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  closeBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
