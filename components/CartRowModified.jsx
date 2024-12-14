import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { MinusIcon, PlusIcon } from "react-native-heroicons/outline";

const CartRowModified = ({
  id,
  ProductName,
  ProductBrand,
  initialQuantity,
  ProductImage,
  handleQuantityChange,
  handleRemoveItem,
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);

  const handleIncrease = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    handleQuantityChange(id, newQuantity);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      handleQuantityChange(id, newQuantity);
    }
  };

  const handleRemove = () => {
    handleRemoveItem(id);
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Image source={{ uri: ProductImage }} style={styles.image} />
        <View style={styles.details}>
          <Text style={styles.productName}>{ProductName}</Text>
          <Text style={styles.productDescription}>
            {ProductBrand} | Qty.: {quantity}
          </Text>
          <TouchableOpacity onPress={handleRemove}>
            <Text style={styles.removeText}>Remove</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={handleDecrease}
            style={styles.touchMinus}
            disabled={quantity === 1}
          >
            <MinusIcon size={20} color={quantity === 1 ? "#888888" : "#000"} />
          </TouchableOpacity>
          <View style={styles.quantityCLass}>
            <Text>{quantity}</Text>
          </View>
          <TouchableOpacity onPress={handleIncrease} style={styles.touchPlus}>
            <PlusIcon size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  quantityCLass: {
    width: 18,
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  container: {
    backgroundColor: "white",
    marginBottom: 12,
    borderRadius: 8,
    paddingRight: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 10,
  },
  details: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  productName: {
    fontSize: 13,
    fontFamily: "Montserrat-Regular",
  },
  productDescription: {
    fontSize: 11,
    fontFamily: "Montserrat-Regular",
    color: "#888888",
  },
  removeText: {
    fontSize: 10,
    fontFamily: "Montserrat-Regular",
    color: "#FF0000",
    textDecorationLine: "underline",
  },
  actions: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  touchPlus: {
    width: 25,
    height: 25,
    borderRadius: 5,
    backgroundColor: "#3E9CB9",
    alignItems: "center",
    justifyContent: "center",
  },
  touchMinus: {
    width: 25,
    height: 25,
    borderRadius: 5,
    backgroundColor: "#F7F7F7",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CartRowModified;
