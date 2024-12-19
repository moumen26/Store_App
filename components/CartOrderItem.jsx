import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { ChevronRightIcon } from "react-native-heroicons/outline";
import { orderStatusTextDisplayer, formatDate } from "../app/util/useFullFunctions";
const CartOrderItem = ({
  OrderStoreName,
  OrderID,
  OrderType,
  OrderDeliveryAddress,
  OrderDate,
  OrderStatus,
  OrderSubTotal,
}) => {
  return (
    <View style={styles.cartOrderItem}>
      <View style={styles.cartItem}>
        <Text style={styles.text}>Store</Text>
        <Text style={styles.textDescription}>{OrderStoreName}</Text>
      </View>
      <View style={styles.cartItem}>
        <Text style={styles.text}>Order ID</Text>
        <Text style={styles.textDescription}>{OrderID}</Text>
      </View>
      <View style={styles.cartItem}>
        <Text style={styles.text}>Order Type</Text>
        <Text style={styles.textDescription}>{OrderType}</Text>
      </View>
      {OrderDeliveryAddress && 
        <View style={styles.cartItem}>
          <Text style={styles.text}>Delivery Address</Text>
          <Text style={styles.textDescription}>{OrderDeliveryAddress}</Text>
        </View>
      }
      <View style={styles.cartItem}>
        <Text style={styles.text}>Order Date</Text>
        <Text style={styles.textDescription}>{formatDate(OrderDate)}</Text>
      </View>
      <View style={styles.cartItem}>
        <Text style={styles.text}>Status</Text>
        <Text style={styles.textDescription}>{orderStatusTextDisplayer(OrderStatus)}</Text>
      </View>
      <View style={styles.cartItem}>
        <Text style={styles.text}>Sub Total</Text>
        <Text style={styles.textDescription}>DA {OrderSubTotal}</Text>
      </View>
      <View
        style={styles.cartItemMoreDetails}
        className="flex-row justify-end pr-[15] w-full"
      >
        <TouchableOpacity className="flex-row items-center space-x-1 mt-2">
          <Text style={styles.text}>More Detail</Text>
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
    height: 200,
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
