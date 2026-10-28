import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { colors, styles } from "@/theme";
import { getGreeting } from "@/i18n";
import { APP_TABS } from "@/constants";

interface SearchHeaderProps {
  activeTab: string;
  onTabPress: (tabId: string) => void;
}

function TabIcon({ lib, name, size, color }: { lib: string; name: any; size: number; color: string }) {
  return lib === "MCI" ? (
    <MaterialCommunityIcons name={name} size={size} color={color} />
  ) : (
    <Ionicons name={name} size={size} color={color} />
  );
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({ activeTab, onTabPress }) => {
  return (
    <LinearGradient
      colors={[colors.navyDeep, colors.navyPanel, colors.crimsonDeep]}
      locations={[0, 0.45, 1.4]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.header}
    >
      <View style={styles.headerTopRow}>
        <View>
          <Text style={styles.eyebrow}>ON TRACK · ON TIME</Text>
          <Text style={styles.title}>RAIL TRACKER</Text>
          <Text style={styles.greeting}>{getGreeting()}</Text>
        </View>
        <View style={styles.bellWrap}>
          <Ionicons
            name="notifications-outline"
            size={20}
            color={colors.ivory}
          />
          <View style={styles.bellDot} />
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {APP_TABS.map((tab) => {
          const active = tab.id === activeTab;
          return (
            <Pressable
              key={tab.id}
              onPress={() => onTabPress(tab.id)}
              style={({ pressed }) => [
                styles.tabItem,
                active && styles.tabItemActive,
                pressed && { opacity: 0.85 },
              ]}
            >
              <View
                style={[
                  styles.tabIconWrap,
                  active && styles.tabIconWrapActive,
                ]}
              >
                <TabIcon
                  lib={tab.lib}
                  name={tab.icon}
                  size={20}
                  color={active ? colors.navyDeep : colors.ivory}
                />
              </View>
              <Text
                style={[styles.tabLabel, active && styles.tabLabelActive]}
                numberOfLines={2}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </LinearGradient>
  );
};
