import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FavoriteButton from "../../components/FavoriteButton";
import { useNavigation, useRoute } from "@react-navigation/native";
import Config from "../config";

const LaveSol = require("../../assets/images/LaveSol.png");
const BoxIcon = require("../../assets/icons/CartDark.png");

const Product = () => {
  const route = useRoute();
  const { data } = route.params;
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
      className="bg-white pt-5 relative h-full"
    >
      <View className="mb-[20] mx-5 flex-row justify-end">
        {/* <BackButton /> */}
        <FavoriteButton />
      </View>
      <View className="w-full mb-[20] items-center h-[35%]">
        <Image style={styles.image} source={{uri: `${`${Config.API_URL.replace('/api', '')}/files/${data?.product?.image}` || ''}`}} />
      </View>
      <View style={styles.productDetails} className="flex-col mx-5 mb-[20]">
        <Text style={styles.ProductNameText}>
          {data?.product?.brand?.name + ' ' + data?.product?.name + ' ' + data?.product?.size}
        </Text>
        <Text style={styles.PriceText}>Price per unit: DA {data?.selling}</Text>
        <View
          style={styles.boxClass}
          className="flex-row space-x-2 items-center"
        >
          <View
            style={styles.boxClass}
            className="w-fit h-[20] flex-row items-center justify-center bg-[#EDEDED] rounded-xl pl-3 pr-3"
          >
            <Text style={styles.BoxText}>{data?.quantity}</Text>
            <Text style={styles.BoxText}>/</Text>
            <Image style={styles.boxIcon} source={BoxIcon} />
          </View>
        </View>
      </View>
      {/* <ProductPer /> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
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

export default Product;
