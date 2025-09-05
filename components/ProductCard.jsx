import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";
import { formatNumber } from "../app/util/useFullFunctions";

const ProductCard = ({
  imgUrl,
  ProductName,
  ProductBrand,
  ProductPrice,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.row}>
      <Image source={{ uri: imgUrl || "" }} style={styles.image} />
      <View
        style={{
          flex: 1,
          paddingRight: 10,
          paddingLeft: 10,
        }}
      >
        <Text style={styles.textName}>{ProductName}</Text>
        <Text style={styles.textBrand} numberOfLines={1} ellipsizeMode="tail">
          {ProductBrand}
        </Text>
        <Text style={styles.textPrice} numberOfLines={1} ellipsizeMode="tail">
          DA {formatNumber(ProductPrice)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    height: 100,
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginBottom: 4,
  },
  image: {
    width: 80,
    height: 80,
    // objectFit: "contain",
    resizeMode: "contain",
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
