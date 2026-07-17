import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { router } from "expo-router";

interface borderColorProp {
  borderColorFast : string
  borderColorSlow : string
  borderColorAll : string
}

export default function TrainFilter({borderColorFast,borderColorAll,borderColorSlow}:borderColorProp) {
  return (
    <View className='ml-2 mt-2'
    style={{ flexDirection: 'row', marginBottom: 1 }}>

      <TouchableOpacity 
        onPress={()=>router.push("/FastTrainListScreen")}
        style={{
        flexDirection: "row",   
        justifyContent: "center",
        alignItems: "center",  
        height: 40,
        width: 100,
        backgroundColor: "#0a1628",
        paddingHorizontal: 10,  // more precise padding
        marginRight: 10,
        borderRadius: 5,
        borderColor: borderColorFast,
        borderWidth: 1,}}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>FAST</Text>
     </TouchableOpacity>

     <TouchableOpacity 
        onPress={()=>router.push("/SlowTrainListScreen")}
        style={{
        flexDirection: "row",   
        justifyContent: "center",
        alignItems: "center",  
        height: 40,
        width: 100,
        backgroundColor: "#0a1628",
        paddingHorizontal: 10,  // more precise padding
        marginRight: 10,
        borderRadius: 5,
        borderColor: borderColorSlow,
        borderWidth: 1,}}>
      <Text style={{ color: 'white', fontWeight: 'bold' }}>SLOW</Text>   
    </TouchableOpacity>

    <TouchableOpacity 
        onPress={()=>router.push("/AllTrainListScreen")}
        style={{
        flexDirection: "row",   
        justifyContent: "center",
        alignItems: "center",  
        height: 40,
        width: 100,
        backgroundColor: "#0a1628",
        paddingHorizontal: 10,  // more precise padding
        marginRight: 10,
        borderRadius: 5,
        borderColor: borderColorAll,
        borderWidth: 1,}}>
      <Text style={{ color: 'white', fontWeight: 'bold' }}>ALL</Text>   
    </TouchableOpacity>
    </View>
  );
}
