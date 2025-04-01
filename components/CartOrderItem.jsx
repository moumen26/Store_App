import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { ChevronRightIcon } from "react-native-heroicons/outline";
import {
  orderStatusTextDisplayer,
  formatDate,
} from "../app/util/useFullFunctions";
import { useNavigation } from "expo-router";

const CartOrderItem = ({
  OrderStoreName,
  OrderID,
  OrderType,
  OrderDeliveryAddress,
  OrderDate,
  OrderStatus,
  OrderSubTotal,
}) => {
  const navigation = useNavigation();

  function capitalizeFirstLetters(text) {
    if (!text) return "";
    return text
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }
  return (
    <View style={styles.cartOrderItem}>
      <View style={styles.cartItem}>
        <Text style={styles.text}>Magasin</Text>
        <Text style={styles.textDescription}>{OrderStoreName}</Text>
      </View>
      <View style={styles.cartItem}>
        <Text style={styles.text}>Numéro de commande</Text>
        <Text style={styles.textDescription}>{OrderID}</Text>
      </View>
      <View style={styles.cartItem}>
        <Text style={styles.text}>Type de commande</Text>
        <Text style={styles.textDescription}>
          {capitalizeFirstLetters(OrderType)}
        </Text>
      </View>
      {OrderDeliveryAddress && (
        <View style={styles.cartItem}>
          <Text style={styles.text}>Adresse de livraison</Text>
          <Text style={styles.textDescription}>{OrderDeliveryAddress}</Text>
        </View>
      )}
      <View style={styles.cartItem}>
        <Text style={styles.text}>Date de commande</Text>
        <Text style={styles.textDescription}>{formatDate(OrderDate)}</Text>
      </View>
      <View style={styles.cartItem}>
        <Text style={styles.text}>Statut</Text>
        <Text style={styles.textDescription}>
          {orderStatusTextDisplayer(OrderStatus, OrderType)}
        </Text>
      </View>
      <View style={styles.cartItem}>
        <Text style={styles.text}>Sous-total</Text>
        <Text style={styles.textDescription}>DA {OrderSubTotal}</Text>
      </View>
      <View
        style={styles.cartItemMoreDetails}
        className="flex-row justify-end pr-[15] w-full"
      >
        <TouchableOpacity
          className="flex-row items-center space-x-1 mt-2"
          onPress={() => navigation.navigate("E-Receipt/index", { OrderID })}
        >
          <Text style={styles.text}>Plus de détails</Text>
          <ChevronRightIcon size={11} color="#888888" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 11,
    color: "#888888",
    fontFamily: "Montserrat-Regular",
  },
  textDescription: {
    fontSize: 11,
    fontFamily: "Montserrat-Medium",
  },
  cartOrderItem: {
    minHeight: 200,
    height: "fit-content",
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderColor: "#C9E4EE",
    borderWidth: 1,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  cartItem: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 15,
    justifyContent: "space-between",
  },
  cartItemMoreDetails: {
    width: "100%",
    justifyContent: "flex-end",
    paddingHorizontal: 15,
    marginTop: 5,
  },
});

export default CartOrderItem;
