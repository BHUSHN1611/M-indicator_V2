import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from "expo-router";
import { FilterCategory } from "../types";
import { colors } from "@/theme";

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
  const activeColor = "white";
  const inactiveBorder = colors.borderNavy;

  const fastBorder = onSelectFilter
    ? (selectedFilter === 'FAST' ? activeColor : inactiveBorder)
    : (borderColorFast ?? inactiveBorder);

  const slowBorder = onSelectFilter
    ? (selectedFilter === 'SLOW' ? activeColor : inactiveBorder)
    : (borderColorSlow ?? inactiveBorder);

  const allBorder = onSelectFilter
    ? (selectedFilter === 'ALL' ? activeColor : inactiveBorder)
    : (borderColorAll ?? activeColor);

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
          backgroundColor: colors.navyDeep,
          paddingHorizontal: 10,
          marginRight: 10,
          borderRadius: 5,
          borderColor: fastBorder,
          borderWidth: 1,
        }}
      >
        <Text style={{ color: colors.ivory, fontWeight: 'bold' }}>FAST</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handlePress('SLOW', '/SlowTrainListScreen')}
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          height: 40,
          width: 100,
          backgroundColor: colors.navyDeep,
          paddingHorizontal: 10,
          marginRight: 10,
          borderRadius: 5,
          borderColor: slowBorder,
          borderWidth: 1,
        }}
      >
        <Text style={{ color: colors.ivory, fontWeight: 'bold' }}>SLOW</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handlePress('ALL', '/AllTrainListScreen')}
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          height: 40,
          width: 100,
          backgroundColor: colors.navyDeep,
          paddingHorizontal: 10,
          marginRight: 10,
          borderRadius: 5,
          borderColor: allBorder,
          borderWidth: 1,
        }}
      >
        <Text style={{ color: colors.ivory, fontWeight: 'bold' }}>ALL</Text>
      </TouchableOpacity>
    </View>
  );
}
