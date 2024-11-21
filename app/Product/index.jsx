import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "../../components/BackButton";
import { CheckIcon } from "react-native-heroicons/outline";
import FavoriteButton from "../../components/FavoriteButton";
import ProductPer from "../../components/ProductPer";

const LaveSol = require("../../assets/images/LaveSol.png");
const BoxIcon = require("../../assets/icons/CartDark.png");

const ProductScreen = () => {
  const [isCheckedUnit, setIsCheckedUnit] = useState(false);

  const toggleCheckboxUnit = () => {
    setIsCheckedUnit((previousState) => !previousState);
  };

  const [isCheckedBox, setIsCheckedBox] = useState(false);

  const toggleCheckboxBox = () => {
    setIsCheckedBox((previousState) => !previousState);
  };

  return (
    <SafeAreaView
      style={styles.Container}
      className="bg-white pt-5 pb-1 relative h-full"
    >
      <View className="mb-[20] mx-5 flex-row justify-between">
        <BackButton />
        <FavoriteButton />
      </View>
      <View className="w-full mb-[20] items-center h-[35%]">
        <Image style={styles.image} source={LaveSol} />
      </View>
      <View style={styles.productDetails} className="flex-col mx-5 mb-[20]">
        <Text style={styles.ProductNameText}>
          Lave Sol AMIR - Fleur Blanche
        </Text>
        <Text style={styles.PriceText}>Price per unit: DA 160</Text>
        <View
          style={styles.boxClass}
          className="flex-row space-x-2 items-center"
        >
          <View
            style={styles.boxClass}
            className="w-fit h-[20] flex-row items-center justify-center bg-[#EDEDED] rounded-xl pl-3 pr-"
          >
            <Text style={styles.BoxText}>12</Text>
            <Text style={styles.BoxText}>/</Text>
            <Image style={styles.boxIcon} source={BoxIcon} />
          </View>
          <Text style={styles.BoxText}>DA 1920.00</Text>
        </View>
      </View>
      {/* <ProductPer /> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50, // Adds space at the top
    justifyContent: "center",
    alignItems: "center",
  },
  ProductNameText: {
    fontSize: 15,
    fontFamily: "Montserrat-SemiBold",
  },
  PriceText: {
    fontSize: 12,
    fontFamily: "Montserrat-Medium",
    color: "#888888",
  },
  BoxText: {
    fontSize: 12,
    fontFamily: "Montserrat-Medium",
    color: "#3E9CB9",
  },
  image: {
    width: 150,
    height: 200,
    resizeMode: "contain",
  },
  boxIcon: {
    width: 15,
    height: 15,
    resizeMode: "contain",
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 0.5,
    borderColor: "black",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 2,
    backgroundColor: "#fff",
  },
  checked: {
    backgroundColor: "#26667E",
  },
  productDetails: {
    flexDirection: "column",
    gap: 5,
  },
  boxClass: {
    flexDirection: "row",
    gap: 3,
  },
});

export default ProductScreen;
