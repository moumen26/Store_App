import { View, Text, StyleSheet } from "react-native";
import React from "react";

const CommandeDetailsItem = ({ ProductName, ProductPriceTotal }) => {
  return (
    <View className="flex-row items-center justify-between w-full my-2">
      <Text style={[styles.title, styles.productName]}>{ProductName}</Text>
      <Text style={[styles.title, styles.productPrice]}>
        DA {parseFloat(ProductPriceTotal).toFixed(2)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 11,
    fontFamily: "Montserrat-Regular",
    color: "#888888",
  },
  productName: {
    flex: 2,
  },
  productPrice: {
    flex: 1,
    textAlign: "right",
  },
});

export default CommandeDetailsItem;
