import { View, Text } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";

import { XMarkIcon } from "react-native-heroicons/outline";

const RecentSearchItem = ({ ProductName }) => {
  return (
    <View className="w-full flex-row items-center justify-between mb-[12]">
      <Text style={styles.text}>{ProductName}</Text>
      <XMarkIcon size={16} color="#888888" />
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 13,
    color: "#888888",
    fontFamily: "Montserrat-Regular",
  },
});

export default RecentSearchItem;
