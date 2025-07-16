import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
} from "react-native";
import React, { useState } from "react";
import FavoriteButton from "../../components/FavoriteButton";
import ProductPer from "../../components/ProductPer";
import Config from "../config";
import useAuthContext from "../hooks/useAuthContext";
import BackButtonCloseModal from "../../components/BackButtonCloseModal";
import Snackbar from "../../components/Snackbar";
const BoxIcon = require("../../assets/icons/CartDark.png");

const ProductScreen = ({ data, storeId, onclose }) => {
  const { user, dispatch } = useAuthContext();
  const [Product, setProduct] = useState(null);

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
  const imageContainerHeight = height * 0.3;
  const modalHeight = height * 0.9;
  const borderRadius = isSmallScreen ? 15 : 20;
  const buttonWidth = width * 0.85;
  const buttonHeight = isSmallScreen ? 45 : isLargeScreen ? 55 : 50;

  const handleProductOnChange = (val) => {
    setProduct(val);
  };

  const [snackbarKey, setSnackbarKey] = useState(0);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleApplyPress = () => {
    if (data.quantity == 0) {
      setSnackbarMessage("Ce produit est en rupture de stock.");
      setSnackbarKey((prevKey) => prevKey + 1);
      return;
    }
    if (Product == null || Product.quantity == 0) {
      setSnackbarMessage(
        "Veuillez sélectionner une quantité de produit valide."
      );
      setSnackbarKey((prevKey) => prevKey + 1);
      return;
    }

    const updatedProduct = {
      store: storeId,
      ...Product,
      stock: data?._id,
      product: {
        image: `${Config.FILES_URL}/${
          data?.product?.image || ""
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
    <Animated.View
      style={[
        styles.modalView,
        {
          borderTopLeftRadius: borderRadius,
          borderTopRightRadius: borderRadius,
          height: modalHeight,
        },
      ]}
    >
      {snackbarKey !== 0 && (
        <Snackbar
          key={snackbarKey}
          message={snackbarMessage}
          duration={2000}
          actionText="Fermer"
          backgroundColor="#FF0000"
          textColor="white"
          actionTextColor="yellow"
        />
      )}

      <View
        style={[
          styles.headerContainer,
          { marginHorizontal: horizontalPadding },
        ]}
      >
        <BackButtonCloseModal handleCloseModal={onclose} />
        <FavoriteButton
          user={user}
          storeId={storeId}
          productId={data?.product?._id}
          isFavorite={true}
        />
      </View>
      <View style={[styles.imageContainer, { height: imageContainerHeight }]}>
        <Image
          style={[styles.image, imageSize]}
          source={{
            uri: `${Config.FILES_URL}/${
              data?.product?.image || ""
            }`,
          }}
        />
      </View>
      <View
        style={[
          styles.productDetails,
          {
            marginHorizontal: horizontalPadding,
            marginBottom: isSmallScreen ? 15 : 20,
            gap: isSmallScreen ? 4 : 5,
          },
        ]}
      >
        <Text
          style={[
            styles.ProductNameText,
            { fontSize: isSmallScreen ? 14 : isLargeScreen ? 17 : 15 },
          ]}
        >
          {data?.product?.brand?.name +
            " " +
            data?.product?.name +
            " " +
            data?.product?.size}
        </Text>
        <Text
          style={[
            styles.PriceText,
            { fontSize: isSmallScreen ? 11 : isLargeScreen ? 14 : 12 },
          ]}
        >
          Prix par unité: {data?.selling} DA
        </Text>
        <Text
          style={[
            styles.PriceText,
            { fontSize: isSmallScreen ? 11 : isLargeScreen ? 14 : 12 },
          ]}
        >
          Prix par boîte: {data?.selling * data?.product?.boxItems} DA
        </Text>
        <View style={[styles.boxClass, { gap: isSmallScreen ? 2 : 3 }]}>
          <View
            style={[
              styles.boxContent,
              {
                borderRadius: isSmallScreen ? 10 : 12,
                paddingLeft: isSmallScreen ? 10 : 12,
                paddingRight: isSmallScreen ? 10 : 12,
                gap: isSmallScreen ? 0 : 1,
              },
            ]}
          >
            <Text
              style={[
                styles.BoxText,
                { fontSize: isSmallScreen ? 11 : isLargeScreen ? 14 : 12 },
              ]}
            >
              {data?.product?.boxItems}
            </Text>
            <Text
              style={[
                styles.BoxText,
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
          styles.buttonContainer,
          {
            bottom: Platform.OS === "ios" ? 40 : 30,
            marginTop: isSmallScreen ? 15 : 20,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.loginButton,
            {
              width: buttonWidth,
              height: buttonHeight,
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
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  loginButton: {
    backgroundColor: "#63BBF5",
    justifyContent: "center",
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontFamily: "Montserrat-Regular",
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    marginTop: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  ProductNameText: {
    fontFamily: "Montserrat-SemiBold",
  },
  PriceText: {
    fontFamily: "Montserrat-Medium",
    color: "#888888",
  },
  BoxText: {
    fontFamily: "Montserrat-Medium",
    color: "#63BBF5",
  },
  image: {
    resizeMode: "contain",
  },
  boxIcon: {
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
    backgroundColor: "#63BBF5",
  },
  productDetails: {
    flexDirection: "column",
  },
  boxClass: {
    flexDirection: "row",
  },
  boxContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EDEDED",
    height: 20,
  },
  modalView: {
    backgroundColor: "#fff",
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
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonContainer: {
    width: "100%",
    position: "absolute",
    flexDirection: "row",
    justifyContent: "center",
  },
});

export default ProductScreen;
