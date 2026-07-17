import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Virar_to_dhanu_trains_data } from "../constants/Trainslistdata[Virar-Dahanu].js";
import TrainCard from '@/components/TrainCard';
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import TrainFilter from "@/components/TrainFilter";

function getOnlyFasttrain(){
  const trainData = Virar_to_dhanu_trains_data
  const onlyFastTrain = trainData.filter(trainData => trainData.train_type === "SLOW")
  return onlyFastTrain
}
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
          router.push({
            pathname:"/TrainRouteScreen",
            params:{
              train_no:item.train_no,
              route : item.route,
              type:item.train_type,
              time:item.departure_time
            }
          })
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#171717" }} edges={["top"]}>
      <TrainFilter borderColorAll="#1e3a5f" borderColorFast="#1e3a5f" borderColorSlow="white"/>
      <FlatList
        data={getOnlyFasttrain()}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.train_no}-${index}`}
        initialNumToRender={13}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={50}
        contentContainerStyle={{ paddingVertical: 8 }}
      />
    </SafeAreaView>
  );
};

export default TrainList;