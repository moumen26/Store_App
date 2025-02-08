import React, { useState, useCallback, memo } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import FavoriteButton from "../../components/FavoriteButton";
import ProductPer from "../../components/ProductPer";
import BackButton from "../../components/BackButton";
import Snackbar from "../../components/Snackbar.jsx";
import useAuthContext from "../hooks/useAuthContext";
import Config from "../config";

const BoxIcon = require("../../assets/icons/CartDark.png");

const Product = memo(() => {
  const route = useRoute();
  const navigator = useNavigation();
  const { data, storeId } = route.params;
  const { user, dispatch } = useAuthContext();
  const [product, setProduct] = useState(null);
  const [snackbarKey, setSnackbarKey] = useState(0);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("");

  const handleProductOnChange = useCallback((val) => {
    setProduct(val);
  }, []);

  const handleApplyPress = useCallback(() => {
    if (data.quantity === 0) {
      setSnackbarType("error");
      setSnackbarMessage("This product is out of stock.");
      setSnackbarKey((prevKey) => prevKey + 1);
      return;
    }
    if (!product || product.quantity === 0) {
      setSnackbarType("error");
      setSnackbarMessage("Please select a valid product quantity.");
      setSnackbarKey((prevKey) => prevKey + 1);
      return;
    }

    const updatedProduct = {
      store: storeId,
      ...product,
      stock: data?._id,
      product: {
        image: `${Config.API_URL.replace("/api", "")}/files/${data?.product?.image}`,
        name: `${data?.product?.name} ${data?.product?.size}`,
        brand: data?.product?.brand?.name,
      },
    };

    dispatch({ type: "ADD_TO_CART", payload: updatedProduct });
    setProduct(null);
    navigator.goBack();
  }, [data, product, storeId, dispatch, navigator]);

  const imageUri = `${Config.API_URL.replace("/api", "")}/files/${data?.product?.image}`;

  return (
    <SafeAreaView style={styles.container}>
      {snackbarKey !== 0 && (
        <Snackbar
          key={snackbarKey}
          message={snackbarMessage}
          duration={2000}
          snackbarType={snackbarType}
        />
      )}
      <View style={styles.header}>
        <BackButton />
        <FavoriteButton
          user={user}
          storeId={storeId}
          productId={data?._id}
          isFavorite={data?.isFavorite}
          setSnackbarKey={setSnackbarKey}
          setSnackbarMessage={setSnackbarMessage}
          setSnackbarType={setSnackbarType}
        />
      </View>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{ uri: imageUri }} />
      </View>
      <View style={styles.productDetails}>
        <Text style={styles.productNameText}>
          {`${data?.product?.brand?.name} ${data?.product?.name} ${data?.product?.size}`}
        </Text>
        <Text style={styles.priceText}>Price per unit: DA {data?.selling}</Text>
        <Text style={styles.priceText}>
          Price per box: DA {data?.selling * data?.product?.boxItems}
        </Text>
        <View style={styles.boxContainer}>
          <View style={styles.boxContent}>
            <Text style={styles.boxText}>{data?.product?.boxItems}</Text>
            <Text style={styles.boxText}>/</Text>
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
      <View style={styles.applyButtonContainer}>
        <TouchableOpacity style={styles.loginButton} onPress={handleApplyPress}>
          <Text style={styles.loginButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
  },
  imageContainer: {
    width: "100%",
    height: "35%",
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 150,
    height: 200,
    resizeMode: "contain",
  },
  productDetails: {
    marginHorizontal: 20,
    marginBottom: 20,
    gap: 5,
  },
  productNameText: {
    fontSize: 15,
    fontFamily: "Montserrat-SemiBold",
  },
  priceText: {
    fontSize: 12,
    fontFamily: "Montserrat-Medium",
    color: "#888888",
  },
  boxContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  boxContent: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EDEDED",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  boxText: {
    fontSize: 12,
    fontFamily: "Montserrat-Medium",
    color: "#3E9CB9",
  },
  boxIcon: {
    width: 15,
    height: 15,
    resizeMode: "contain",
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
  applyButtonContainer: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    alignItems: "center",
  },
});

export default Product;