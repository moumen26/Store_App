import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FavoriteButton from "../../components/FavoriteButton";
import { useNavigation, useRoute } from "@react-navigation/native";
import Config from "../config";
import ProductPer from "../../components/ProductPer";
import useAuthContext from "../hooks/useAuthContext";
import BackButton from "../../components/BackButton";

const BoxIcon = require("../../assets/icons/CartDark.png");

const Product = () =>
  // { data, storeId }
  {
    const route = useRoute();
    const { data } = route.params;
    const { dispatch } = useAuthContext();
    const [Product, setProduct] = useState(null);
    const handleProductOnChange = (val) => {
      setProduct(val);
    };

    const handleApplyPress = () => {
      if (data.quantity == 0) {
        //Toast msg out of stock
        alert("This product is out of stock.");
        return;
      }
      if (Product == null || Product.quantity == 0) {
        //Toast msg to select quantity
        alert("Please select a valid product quantity.");
        return;
      }
      //add stock id to Product
      const updatedProduct = {
        store: storeId,
        ...Product,
        stock: data?._id,
        product: {
          image: `${
            `${Config.API_URL.replace("/api", "")}/files/${
              data?.product?.image
            }` || ""
          }`,
          name: data?.product?.name + " " + data?.product?.size,
          brand: data?.product?.brand?.name,
        },
      };
      dispatch({ type: "ADD_TO_CART", payload: updatedProduct });
      setProduct(null);
      onclose();
    };

    return (
      <SafeAreaView
        style={styles.Container}
        className="bg-white pt-5 relative h-full"
      >
        <View className="mx-5 flex-row justify-between">
          <BackButton
          //  handleCloseModal={onclose}
          />
          <FavoriteButton />
        </View>
        <View className="w-full mb-[20] items-center h-[35%]">
          <Image
            style={styles.image}
            source={{
              uri: `${
                `${Config.API_URL.replace("/api", "")}/files/${
                  data?.product?.image
                }` || ""
              }`,
            }}
          />
        </View>
        <View style={styles.productDetails} className="flex-col mx-5 mb-[20]">
          <Text style={styles.ProductNameText}>
            {data?.product?.brand?.name +
              " " +
              data?.product?.name +
              " " +
              data?.product?.size}
          </Text>
          <Text style={styles.PriceText}>
            Price per unit: DA {data?.selling}
          </Text>
          <Text style={styles.PriceText}>
            Price per box: DA {data?.selling * data?.product?.boxItems}
          </Text>
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
          handleProductOnChange={handleProductOnChange}
        />
        <View className="w-full absolute bottom-8 flex-row justify-center mt-[20]">
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleApplyPress}
          >
            <Text style={styles.loginButtonText}>Apply</Text>
          </TouchableOpacity>
        </View>
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
});

export default Product;
