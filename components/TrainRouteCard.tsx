import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

interface TrainInfoCardProps {
  train_no: string;
}

const TrainRouteCard = ({ train_no }: TrainInfoCardProps) => {
  const params = useLocalSearchParams<{ train_no: string }>();
  const resolvedTrainNo = params.train_no ?? train_no;

  return (
    <View>
      <Text className="mt-10 text-2xl text-amber-50">hhh{resolvedTrainNo}</Text>
    </View>
  );
};

export default TrainRouteCard;
