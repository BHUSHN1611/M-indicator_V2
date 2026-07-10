// TrainList.tsx
import React from 'react';
import { ScrollView,View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TrainCard from './TrainCard'
import { Virar_to_dhanu_trains_data } from '../constants/Trainsdata[Virar-Dahanu].js';

interface TrainData {
  departure_time: string;
  departure_period: string;
  destination: string;
  train_type?: string;
  train_no: string;
  route: string;
}

const TrainList: React.FC = () => {
  const navigation = useNavigation();

  return (
    <ScrollView>
      {Virar_to_dhanu_trains_data.map((data: TrainData, index: number) => (
        <View key={index}>
          <TouchableOpacity
            onPress={() => {
              console.log(`button clicked ${data.train_no}`);
            }}
          >
            <TrainCard
              departure_time={data.departure_time}
              departure_period={data.departure_period}
              destination={data.destination}
              train_type={data.train_type}
              train_no={data.train_no}
              route={data.route}
              platform={4}
            />
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

export default TrainList;
