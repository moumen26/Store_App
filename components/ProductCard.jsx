import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";

const ProductCard = ({
  imgUrl,
  ProductName,
  ProductBrand,
  ProductPrice,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="h-[90] flex-row items-center space-x-1 mb-1"
    >
      <Image source={{uri: `${imgUrl || ''}`}} style={styles.image} />
      <View>
        <Text style={styles.textName}>{ProductName}</Text>
        <Text style={styles.textBrand}>{ProductBrand}</Text>
        <Text style={styles.textPrice}>DA {ProductPrice}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 80,
    height: 80,
  },
  textName: {
    fontSize: 13,
    fontFamily: "Montserrat-Regular",
    color: "#000",
  },
  textBrand: {
    fontSize: 11,
    fontFamily: "Montserrat-Regular",
    color: "#888888",
  },
  textPrice: {
    fontSize: 11,
    fontFamily: "Montserrat-Medium",
    color: "#000",
  },
});

export default ProductCard;
