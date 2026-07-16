import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'

const {train_no} = useLocalSearchParams<{
    train_no:string
}>();

interface TrainInfoCardProps {
    train_no:string
}

const TrainRouteCard = ({train_no}:TrainInfoCardProps) => {
  return (
    <View>
      <Text className='mt-10 text-2xl text-amber-50'>hhh{train_no}</Text>
    </View>
  )
}

export default TrainRouteCard