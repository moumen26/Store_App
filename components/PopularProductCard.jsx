import { Image, TouchableOpacity, Text, View, Dimensions } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";

const PopularProductCard = ({ imgUrl, ProductName, onPress }) => {
  return (
    <TouchableOpacity style={styles.productItem} onPress={onPress}>
      <View
        style={styles.imageClass}
        className="flex-row items-center justify-center"
      >
        <Image source={{ uri: `${imgUrl || ""}` }} style={styles.image} />
      </View>
      <View
        className="h-[53px] w-full flex-row items-center justify-center"
        style={{ paddingHorizontal: 10 }}
      >
        <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
          {ProductName}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  productItem: {
    // width: 165,
    width: Dimensions.get("screen").width * 0.44,

    height: 233,
    borderRadius: 20,
    borderColor: "#C9E4EE",
    borderWidth: 0.5,
    alignItems: "center",
    marginRight: 15,
  },
  imageClass: {
    width: 165,
    height: 180,
    borderRadius: 20,
  },
  image: {
    resizeMode: "contain",
    width: 140,
    height: 150,
  },
  text: {
    fontSize: 13,
    fontFamily: "Montserrat-Regular",
    color: "#000",
    textAlign: "center",
  },
});

export default PopularProductCard;
