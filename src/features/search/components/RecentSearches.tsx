import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, styles } from "@/theme";
import { strings } from "@/i18n";
import { RecentSearchItem } from "../types";

interface RecentSearchesProps {
  searches: RecentSearchItem[];
  onSelectSearch: (item: RecentSearchItem) => void;
}

export const RecentSearches: React.FC<RecentSearchesProps> = ({ searches, onSelectSearch }) => {
  return (
    <>
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>{strings.search.recentSearchesTitle}</Text>
        <View style={styles.sectionRule} />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingLeft: 20,
          paddingRight: 8,
          gap: 12,
        }}
      >
        {searches.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => onSelectSearch(item)}
            style={({ pressed }) => [
              styles.recentCard,
              pressed && { opacity: 0.85 },
            ]}
          >
            <View style={styles.recentIconWrap}>
              <MaterialCommunityIcons
                name="train"
                size={18}
                color={colors.brass}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.recentRoute} numberOfLines={1}>
                {item.from} <Text style={{ color: colors.slate }}>→</Text> {item.to}
              </Text>
              <Text style={styles.recentDate}>
                {strings.common.lastSearched} {item.date}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </>
  );
};
