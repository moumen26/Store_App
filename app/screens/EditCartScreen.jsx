import React, { memo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
import CartRowModified from "../../components/CartRowModified";
import useAuthContext from "../hooks/useAuthContext";

const EditCartScreen = memo(({ data, storeId, onClose }) => {
  const { dispatch } = useAuthContext();

  // Handle quantity change
  const handleQuantityChange = useCallback(
    (id, newQuantity) => {
      const itemToUpdate = data.find((item) => item.stock === id);
      if (!itemToUpdate) return; // Handle case where item is not found

      const updatedPrice = (itemToUpdate.price * newQuantity) / itemToUpdate.quantity;

      dispatch({
        type: "UPDATE_CART",
        payload: { stock: id, quantity: newQuantity, price: updatedPrice, storeId },
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
    <Animated.View style={styles.modalView}>
      <Text style={styles.titleCategory}>Order Details</Text>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {renderProductItems()}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.loginButton} onPress={onClose}>
          <Text style={styles.loginButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  modalView: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    maxHeight: "90%",
  },
  titleCategory: {
    fontSize: 18,
    fontFamily: "Montserrat-Regular",
    marginBottom: 10,
  },
  container: {
    flexGrow: 1,
  },
  buttonContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
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

export default EditCartScreen;