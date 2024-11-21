import { Image, TouchableOpacity, Text, View } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";
import { useNavigation } from "expo-router";

const PopularProductCard = ({ imgUrl, ProductName, onPress }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.productItem}
      onPress={onPress}
      // onPress={() => navigation.navigate(onPress)}
    >
      <View
        style={styles.imageClass}
        className="flex-row items-center justify-center"
      >
        <Image source={imgUrl} style={styles.image} />
      </View>
      <View className="h-[53px] w-full flex-row items-center justify-center">
        <Text style={styles.text}>{ProductName}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  productItem: {
    width: 165,
    height: 233,
    borderRadius: 20,
    borderColor: "#C9E4EE",
    borderWidth: 0.5,
    alignItems: "center",
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
