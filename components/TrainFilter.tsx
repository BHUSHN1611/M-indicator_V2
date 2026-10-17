import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from "expo-router";

export type FilterCategory = 'ALL' | 'FAST' | 'SLOW';

interface TrainFilterProps {
  selectedFilter?: FilterCategory;
  onSelectFilter?: (filter: FilterCategory) => void;
  borderColorFast?: string;
  borderColorSlow?: string;
  borderColorAll?: string;
}

export default function TrainFilter({
  selectedFilter,
  onSelectFilter,
  borderColorFast,
  borderColorAll,
  borderColorSlow,
}: TrainFilterProps) {
  // If controlled via onSelectFilter, active button is white and others are #1e3a5f
  const fastBorder = onSelectFilter
    ? (selectedFilter === 'FAST' ? 'white' : '#1e3a5f')
    : (borderColorFast ?? '#1e3a5f');

  const slowBorder = onSelectFilter
    ? (selectedFilter === 'SLOW' ? 'white' : '#1e3a5f')
    : (borderColorSlow ?? '#1e3a5f');

  const allBorder = onSelectFilter
    ? (selectedFilter === 'ALL' ? 'white' : '#1e3a5f')
    : (borderColorAll ?? 'white');

  const handlePress = (target: FilterCategory, routeFallback: string) => {
    if (onSelectFilter) {
      onSelectFilter(target);
    } else {
      router.push(routeFallback as any);
    }
  };

  return (
    <View className="ml-2 mt-2" style={{ flexDirection: 'row', marginBottom: 1 }}>
      <TouchableOpacity
        onPress={() => handlePress('FAST', '/FastTrainListScreen')}
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          height: 40,
          width: 100,
          backgroundColor: '#0a1628',
          paddingHorizontal: 10,
          marginRight: 10,
          borderRadius: 5,
          borderColor: fastBorder,
          borderWidth: 1,
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>FAST</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handlePress('SLOW', '/SlowTrainListScreen')}
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          height: 40,
          width: 100,
          backgroundColor: '#0a1628',
          paddingHorizontal: 10,
          marginRight: 10,
          borderRadius: 5,
          borderColor: slowBorder,
          borderWidth: 1,
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>SLOW</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handlePress('ALL', '/AllTrainListScreen')}
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          height: 40,
          width: 100,
          backgroundColor: '#0a1628',
          paddingHorizontal: 10,
          marginRight: 10,
          borderRadius: 5,
          borderColor: allBorder,
          borderWidth: 1,
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>ALL</Text>
      </TouchableOpacity>
    </View>
  );
}
