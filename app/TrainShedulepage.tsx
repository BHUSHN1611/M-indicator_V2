// TrainList.tsx
import React from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Virar_to_dhanu_trains_data } from "../constants/Trainsdata[Virar-Dahanu].js";
import TrainCard from "./TrainCard";

interface TrainData {
  departure_time: string;
  departure_period: string;
  destination: string;
  train_type?: string;
  train_no: string;
  route: string;
}

const TrainList: React.FC = () => {
  const renderItem = ({ item }: { item: TrainData }) => (
    <View>
      <TouchableOpacity
        onPress={() => {
          console.log(`button clicked ${item.train_no}`);
        }}
      >
        <TrainCard
          departure_time={item.departure_time}
          departure_period={item.departure_period}
          destination={item.destination}
          train_type={item.train_type}
          train_no={item.train_no}
          route={item.route}
          platform={4}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <FlatList
        data={Virar_to_dhanu_trains_data}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.train_no}-${index}`}
        initialNumToRender={13}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={50}
      />
    </SafeAreaView>
  );
};

export default TrainList;
