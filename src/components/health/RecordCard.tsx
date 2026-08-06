import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { HealthRecord } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { FallbackImage } from '../common/FallbackImage';

interface Props {
  record: HealthRecord;
  onPress: () => void;
}

export const RecordCard = React.memo<Props>(({ record, onPress }) => {
  const { colors } = useTheme();

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Lab Report':
        return '#0288D1';
      case 'Prescription':
        return '#7B1FA2';
      case 'Consultation':
        return '#388E3C';
      case 'Vaccination':
        return '#E65100';
      case 'Allergy':
        return '#D32F2F';
      default:
        return colors.primary;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`Record ${record.title}, ${record.type}`}>
      <FallbackImage source={{ uri: record.thumbnailUrl }} fallbackType="record" iconSize={24} style={styles.thumbnail} />
      <View style={styles.content}>
        <View style={styles.typeBadgeRow}>
          <Text style={[styles.typeBadge, { backgroundColor: getTypeColor(record.type) }]}>
            {record.type}
          </Text>
          <Text style={[styles.dateText, { color: colors.textMuted }]}>{record.date}</Text>
        </View>

        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {record.title}
        </Text>
        <Text style={[styles.facility, { color: colors.textSecondary }]} numberOfLines={1}>
          {record.facility} • {record.doctorName}
        </Text>

        <View style={styles.tagsRow}>
          {record.tags.map((tag) => (
            <Text
              key={tag}
              style={[styles.tag, { backgroundColor: colors.chipBackground, color: colors.primary }]}>
              #{tag}
            </Text>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 1,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  typeBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  dateText: {
    fontSize: 11,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },
  facility: {
    fontSize: 12,
    marginTop: 2,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 6,
  },
  tag: {
    fontSize: 10,
    fontWeight: '600',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
});
