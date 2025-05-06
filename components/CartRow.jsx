import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React, { useState } from "react";

const CartRow = ({
  id,
  ProductName,
  ProductBrand,
  ProductQuantity,
  ProductImage,
}) => {
  return (
    <>
      <TouchableOpacity className="flex-row items-center justify-between w-full bg-red-300 h-[90] p-0">
        <View className="flex-row items-center">
          <Image style={styles.Image} source={{ uri: ProductImage }} />

          <View className="flex-col space-y-[1.5]">
            <Text style={styles.textProductName}>{ProductName}</Text>
            <Text style={styles.textProductDescription}>
              {ProductBrand} | Qty.: {ProductQuantity}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  Image: {
    width: 80,
    height: 80,
    objectFit: "contain",
  },
  touchPlus: {
    width: 25,
    height: 25,
    borderRadius: 5,
    backgroundColor: "#63BBF5",
    alignItems: "center",
    justifyContent: "center",
  },
  touchMinus: {
    width: 25,
    height: 25,
    borderRadius: 5,
    backgroundColor: "#F7F7F7",
    alignItems: "center",
    justifyContent: "center",
  },
  textProductName: {
    fontSize: 13,
    fontFamily: "Montserrat-Regular",
  },
  textProductDescription: {
    fontSize: 11,
    fontFamily: "Montserrat-Regular",
    color: "#888888",
  },
  textRemove: {
    fontSize: 10,
    fontFamily: "Montserrat-Regular",
    color: "#FF0000",
    textDecorationLine: "underline",
  },
});

export default CartRow;
