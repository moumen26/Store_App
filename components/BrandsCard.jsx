import { Image, TouchableOpacity } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const BrandsCard = ({ imgUrl, onPress }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate(onPress)}
      style={styles.imageClass}
      className="mr-1"
    >
      <Image source={imgUrl} style={styles.image} />
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
