import React, { useState } from "react";
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

const Elio = require("../../assets/images/Elio.png");

const EditCartScreen = ({ 
  data,
  storeId,
  onClose 
}) => {
  const { dispatch } = useAuthContext();

  const handleQuantityChange = (id, newQuantity) => {
    const itemToUpdate = data.find(item => item.stock === id);
    const updatedPrice = (itemToUpdate.price * newQuantity) / itemToUpdate.quantity;

    dispatch({
      type: "UPDATE_CART",
      payload: { stock: id, quantity: newQuantity, price: updatedPrice, storeId: storeId },
    });
  };
  
  const handleRemoveItem = (id) => {
    dispatch({
      type: "REMOVE_FROM_CART",
      payload: { stock: id, storeId: storeId },
    });
  };
  const handleClosePress = () => {
    onClose();
  };

  const renderProductItems = () => {
    return data?.map((item, index) => (
      <CartRowModified
        key={item.stock}
        id={item.stock}
        ProductName={item?.product?.name}
        ProductBrand={item?.product?.brand}
        initialQuantity={item?.quantity}
        ProductImage={item?.product?.image}
        handleQuantityChange={handleQuantityChange}
        handleRemoveItem={handleRemoveItem}
      />
    ));
  };

  return (
    <Animated.View style={styles.modalView}>
      <Text style={styles.titleCategory}>Order Details</Text>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {renderProductItems()}
      </ScrollView>
      <View className="w-full flex-row justify-center mt-[20]">
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleClosePress}
        >
          <Text style={styles.loginButtonText}>Close</Text>
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
  titleCategory: {
    fontSize: 18,
    fontFamily: "Montserrat-Regular",
    marginBottom: 10,
  },
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
});

export default EditCartScreen;
