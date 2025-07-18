import React, { useState, useCallback, memo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { MinusIcon, PlusIcon } from "react-native-heroicons/outline";

const CartRowModified = memo(
  ({
    id,
    ProductName,
    ProductBrand,
    initialQuantity,
    ProductImage,
    buyingMathode,
    boxItems,
    handleQuantityChange,
    handleRemoveItem,
  }) => {
    const [quantity, setQuantity] = useState(initialQuantity);

    const incrementAmount = buyingMathode === "box" ? boxItems : 1;
    const minQuantity = buyingMathode === "box" ? boxItems : 1;
    const displayedQuantity =
      buyingMathode === "box" ? quantity / boxItems : quantity;

    const handleIncrease = useCallback(() => {
      const newQuantity = quantity + incrementAmount;
      setQuantity(newQuantity);
      handleQuantityChange(id, newQuantity);
    }, [quantity, incrementAmount, id, handleQuantityChange]);

    const handleDecrease = useCallback(() => {
      const newQuantity = quantity - incrementAmount;
      if (newQuantity >= minQuantity) {
        setQuantity(newQuantity);
        handleQuantityChange(id, newQuantity);
      }
    }, [quantity, incrementAmount, minQuantity, id, handleQuantityChange]);

    const handleRemove = useCallback(() => {
      handleRemoveItem(id);
    }, [id, handleRemoveItem]);

    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <Image source={{ uri: ProductImage }} style={styles.image} />
          <View style={styles.details}>
            <Text style={styles.productName}>{ProductName}</Text>
            <Text style={styles.productDescription}>
              {ProductBrand} | Qty.: {displayedQuantity}
            </Text>
            <Text style={styles.productDescription}>
              Méthode d'achat: {buyingMathode}
            </Text>
            <TouchableOpacity onPress={handleRemove}>
              <Text style={styles.removeText}>Supprimer</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity
              onPress={handleDecrease}
              style={styles.touchMinus}
              disabled={quantity === minQuantity}
            >
              <MinusIcon
                size={20}
                color={quantity === minQuantity ? "#888888" : "#000"}
              />
            </TouchableOpacity>
            <View style={styles.quantityCLass}>
              <Text>{displayedQuantity}</Text>
            </View>
            <TouchableOpacity onPress={handleIncrease} style={styles.touchPlus}>
              <PlusIcon size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  quantityCLass: {
    width: 18,
    alignItems: "center",
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
    objectFit: "contain",
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
    backgroundColor: "#19213D",
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
