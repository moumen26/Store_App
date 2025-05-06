import React, { memo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  useWindowDimensions,
  Platform,
} from "react-native";
import CartRowModified from "../../components/CartRowModified";
import useAuthContext from "../hooks/useAuthContext";

const EditCartScreen = memo(({ data, storeId, onClose }) => {
  const { dispatch } = useAuthContext();

  // Get screen dimensions
  const { width, height } = useWindowDimensions();

  // Calculate responsive values
  const isSmallScreen = width < 375;
  const isMediumScreen = width >= 375 && width < 768;
  const isLargeScreen = width >= 768;

  // Responsive spacing calculations
  const horizontalPadding = width * 0.05;
  const borderRadius = isSmallScreen ? 15 : 20;
  const buttonWidth = width * 0.85;
  const buttonHeight = isSmallScreen ? 45 : isLargeScreen ? 55 : 50;
  const modalMaxHeight = height * 0.9;

  // Handle quantity change
  const handleQuantityChange = useCallback(
    (id, newQuantity) => {
      const itemToUpdate = data.find((item) => item.stock === id);
      if (!itemToUpdate) return; // Handle case where item is not found

      const updatedPrice =
        (itemToUpdate.price * newQuantity) / itemToUpdate.quantity;

      dispatch({
        type: "UPDATE_CART",
        payload: {
          stock: id,
          quantity: newQuantity,
          price: updatedPrice,
          storeId,
        },
      });
    },
    [data, dispatch, storeId]
  );

  // Handle item removal
  const handleRemoveItem = useCallback(
    (id) => {
      dispatch({
        type: "REMOVE_FROM_CART",
        payload: { stock: id, storeId },
      });
    },
    [dispatch, storeId]
  );

  // Render product items
  const renderProductItems = useCallback(
    () =>
      data?.map((item) => (
        <CartRowModified
          key={item.stock}
          id={item.stock}
          ProductName={item?.product?.name}
          ProductBrand={item?.product?.brand}
          initialQuantity={item?.quantity}
          ProductImage={item?.product?.image}
          buyingMathode={item?.buyingMathode}
          boxItems={item?.boxItems}
          handleQuantityChange={handleQuantityChange}
          handleRemoveItem={handleRemoveItem}
        />
      )),
    [data, handleQuantityChange, handleRemoveItem]
  );

  return (
    <Animated.View
      style={[
        styles.modalView,
        {
          borderTopLeftRadius: borderRadius,
          borderTopRightRadius: borderRadius,
          padding: horizontalPadding,
          maxHeight: modalMaxHeight,
        },
      ]}
    >
      <Text
        style={[
          styles.titleCategory,
          {
            fontSize: isSmallScreen ? 16 : isLargeScreen ? 20 : 18,
            marginBottom: isSmallScreen ? 8 : 10,
          },
        ]}
      >
        Détails de la Commande
      </Text>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {renderProductItems()}
      </ScrollView>
      <View
        style={[styles.buttonContainer, { marginTop: isSmallScreen ? 15 : 20 }]}
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
          onPress={onClose}
        >
          <Text
            style={[
              styles.loginButtonText,
              { fontSize: isSmallScreen ? 14 : isLargeScreen ? 18 : 16 },
            ]}
          >
            Fermer
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  modalView: {
    backgroundColor: "#fff",
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
  titleCategory: {
    fontFamily: "Montserrat-Regular",
  },
  container: {
    flexGrow: 1,
  },
  buttonContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
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
});

export default EditCartScreen;
