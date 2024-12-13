import { View, Text, StyleSheet } from "react-native";
import React from "react";

const CommandeDetailsItem = ({ ProductName, ProductPriceTotal }) => {
  return (
    <View className="flex-row items-center justify-between w-full">
      <Text style={styles.title}>{ProductName}</Text>
      <Text style={styles.title}>DA {parseFloat(ProductPriceTotal).toFixed(2)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 11,
    fontFamily: "Montserrat-Regular",
    color: "#888888",
  },
});

export default CommandeDetailsItem;
