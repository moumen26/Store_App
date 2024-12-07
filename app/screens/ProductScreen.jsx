import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import FavoriteButton from "../../components/FavoriteButton";
import ProductPer from "../../components/ProductPer";
import Config from "../config";

const LaveSol = require("../../assets/images/LaveSol.png");
const BoxIcon = require("../../assets/icons/CartDark.png");

const ProductScreen = ({ data, onclose }) => {
  const [isCheckedUnit, setIsCheckedUnit] = useState(false);

  const toggleCheckboxUnit = () => {
    setIsCheckedUnit((previousState) => !previousState);
  };

  const [isCheckedBox, setIsCheckedBox] = useState(false);

  const toggleCheckboxBox = () => {
    setIsCheckedBox((previousState) => !previousState);
  };

  const handleApplyPress = () => {
    onclose(); // Close modal on Apply button press
  };

  return (
    <Animated.View style={styles.modalView}>
      <View className="mb-[20] mx-5 flex-row justify-end">
        <FavoriteButton />
      </View>
      <View
        style={styles.imageContainer}
        className="w-full items-center h-[35%]"
      >
        <Image style={styles.image} source={{uri: `${`${Config.API_URL.replace('/api', '')}/files/${data?.product?.image}` || ''}`}} />
      </View>
      <View style={styles.productDetails} className="flex-col mx-5 mb-[20]">
        <Text style={styles.ProductNameText}>
          {data?.product?.brand?.name + ' ' + data?.product?.name + ' ' + data?.product?.size}
        </Text>
        <Text style={styles.PriceText}>Price per unit: DA {data?.selling}</Text>
        <Text style={styles.PriceText}>Price per box: DA {data?.selling * data?.product?.boxItems}</Text>
        <View
          style={styles.boxClass}
          className="flex-row space-x-2 items-center"
        >
          <View
            style={styles.boxClass}
            className="w-fit h-[20] flex-row items-center justify-center bg-[#EDEDED] rounded-xl pl-3 pr-3"
          >
            <Text style={styles.BoxText}>{data?.product?.boxItems}</Text>
            <Text style={styles.BoxText}>/</Text>
            <Image style={styles.boxIcon} source={BoxIcon} />
          </View>
        </View>
      </View>
      <ProductPer 
        selling={data?.selling}
        quantity={data?.quantity}
        buyingMathode={data?.buyingMathode}
        boxItems={data?.product?.boxItems}
        quantityLimit={data?.quantityLimit}
      />
      <View className="w-full absolute bottom-8 flex-row justify-center mt-[20]">
        <TouchableOpacity style={styles.loginButton} onPress={handleApplyPress}>
          <Text style={styles.loginButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  loginButton: {
    backgroundColor: "#26667E",
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    width: 340,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Montserrat-Regular",
  },
  imageContainer: {
    marginBottom: 30,
  },
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
  modalView: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    height: "80%",
  },
});

export default ProductScreen;
