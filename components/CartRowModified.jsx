import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { MinusIcon, PlusIcon } from "react-native-heroicons/outline";

const CartRowModified = ({
  id,
  ProductName,
  ProductBrand,
  initialQuantity,
  ProductImage,
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Image source={ProductImage} style={styles.image} />
        <View style={styles.details}>
          <Text style={styles.productName}>{ProductName}</Text>
          <Text style={styles.productDescription}>
            {ProductBrand} | Qty.: {quantity}
          </Text>
          <TouchableOpacity>
            <Text style={styles.removeText}>Remove</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.actions} className="space-x-3">
          <TouchableOpacity style={styles.touchMinus} disabled={quantity === 1}>
            <MinusIcon size={20} color={quantity === 1 ? "#888888" : "#000"} />
          </TouchableOpacity>
          <Text>{quantity}</Text>
          <TouchableOpacity style={styles.touchPlus}>
            <PlusIcon size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
