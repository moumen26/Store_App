import React, { useState, useCallback, memo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
} from "react-native";
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

  // Get screen dimensions
  const { width, height } = useWindowDimensions();

  // Calculate responsive values
  const isSmallScreen = width < 375;
  const isMediumScreen = width >= 375 && width < 768;
  const isLargeScreen = width >= 768;

  // Responsive spacing calculations
  const horizontalPadding = width * 0.05;
  const imageSize = {
    width: isSmallScreen ? 120 : isLargeScreen ? 180 : 150,
    height: isSmallScreen ? 160 : isLargeScreen ? 240 : 200,
  };
  const buttonWidth = width * 0.85;

  const handleProductOnChange = useCallback((val) => {
    setProduct(val);
  }, []);

  const handleApplyPress = useCallback(() => {
    if (data.quantity === 0) {
      setSnackbarType("error");
      setSnackbarMessage("Ce produit est en rupture de stock.");
      setSnackbarKey((prevKey) => prevKey + 1);
      return;
    }
    if (!product || product.quantity === 0) {
      setSnackbarType("error");
      setSnackbarMessage(
        "Veuillez sélectionner une quantité de produit valide."
      );
      setSnackbarKey((prevKey) => prevKey + 1);
      return;
    }

    const updatedProduct = {
      store: storeId,
      ...product,
      stock: data?._id,
      product: {
        image: `${Config.API_URL.replace("/api", "")}/files/${
          data?.product?.image
        }`,
        name: `${data?.product?.name} ${data?.product?.size}`,
        brand: data?.product?.brand?.name,
      },
    };

    dispatch({ type: "ADD_TO_CART", payload: updatedProduct });
    setProduct(null);
    navigator.goBack();
  }, [data, product, storeId, dispatch, navigator]);

  const imageUri = `${Config.API_URL.replace("/api", "")}/files/${
    data?.product?.image
  }`;

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
      <View style={[styles.header, { marginHorizontal: horizontalPadding }]}>
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
        <Image style={[styles.image, imageSize]} source={{ uri: imageUri }} />
      </View>
      <View
        style={[styles.productDetails, { marginHorizontal: horizontalPadding }]}
      >
        <Text
          style={[
            styles.productNameText,
            { fontSize: isSmallScreen ? 14 : isLargeScreen ? 17 : 15 },
          ]}
        >
          {`${data?.product?.brand?.name} ${data?.product?.name} ${data?.product?.size}`}
        </Text>
        <Text
          style={[
            styles.priceText,
            { fontSize: isSmallScreen ? 11 : isLargeScreen ? 14 : 12 },
          ]}
        >
          Prix par unité: {data?.selling} DA
        </Text>
        <Text
          style={[
            styles.priceText,
            { fontSize: isSmallScreen ? 11 : isLargeScreen ? 14 : 12 },
          ]}
        >
          Prix par boîte: {data?.selling * data?.product?.boxItems} DA
        </Text>
        <View style={styles.boxContainer}>
          <View
            style={[
              styles.boxContent,
              {
                borderRadius: isSmallScreen ? 10 : 12,
                paddingHorizontal: isSmallScreen ? 10 : 12,
                paddingVertical: isSmallScreen ? 3 : 4,
              },
            ]}
          >
            <Text
              style={[
                styles.boxText,
                { fontSize: isSmallScreen ? 11 : isLargeScreen ? 14 : 12 },
              ]}
            >
              {data?.product?.boxItems}
            </Text>
            <Text
              style={[
                styles.boxText,
                { fontSize: isSmallScreen ? 11 : isLargeScreen ? 14 : 12 },
              ]}
            >
              /
            </Text>
            <Image
              style={[
                styles.boxIcon,
                {
                  width: isSmallScreen ? 13 : isLargeScreen ? 17 : 15,
                  height: isSmallScreen ? 13 : isLargeScreen ? 17 : 15,
                },
              ]}
              source={BoxIcon}
            />
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
      <View
        style={[
          styles.applyButtonContainer,
          { bottom: Platform.OS === "ios" ? 30 : 20 },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.loginButton,
            {
              width: buttonWidth,
              height: isSmallScreen ? 45 : isLargeScreen ? 55 : 50,
              borderRadius: isSmallScreen ? 8 : 10,
            },
          ]}
          onPress={handleApplyPress}
        >
          <Text
            style={[
              styles.loginButtonText,
              { fontSize: isSmallScreen ? 14 : isLargeScreen ? 18 : 16 },
            ]}
          >
            Ajouter au panier
          </Text>
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
  },
  imageContainer: {
    width: "100%",
    height: "35%",
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    resizeMode: "contain",
  },
  productDetails: {
    marginBottom: 20,
    gap: 5,
  },
  productNameText: {
    fontFamily: "Montserrat-SemiBold",
  },
  priceText: {
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
    gap: 2,
  },
  boxText: {
    fontFamily: "Montserrat-Medium",
    color: "#63BBF5",
  },
  boxIcon: {
    resizeMode: "contain",
  },
  loginButton: {
    backgroundColor: "#63BBF5",
    justifyContent: "center",
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontFamily: "Montserrat-Regular",
  },
  applyButtonContainer: {
    position: "absolute",
    width: "100%",
    alignItems: "center",
  },
});

export default Product;
