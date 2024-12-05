import { Image, TouchableOpacity } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";

const BrandsCard = ({ imgUrl, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.imageClass}
      className="mr-1"
    >
      <Image source={{uri: `${imgUrl || ''}`}} style={styles.image} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  imageClass: {
    width: 101,
    height: 42,
    borderRadius: 20,
    borderColor: "#C9E4EE",
    borderWidth: 0.5,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    resizeMode: "contain",
    width: 90,
    height: 30,
  },
});

export default BrandsCard;
