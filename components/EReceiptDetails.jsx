import { View, Text, StyleSheet } from "react-native";
import React from "react";
import {
  orderStatusTextDisplayer,
  formatDate,
} from '../app/util/useFullFunctions';

const EReceiptDetails = ({
  OrderStoreName,
  OrderID,
  OrderType,
  OrderDeliveryAddress,
  OrderDate,
  OrderSubTotal,
  OrderDeliveryCharge,
  OrderStatus,
  OrderDiscount,
}) => {
  return (
    <View>
      <View style={styles.commandeContainer}>
        <View className="flex-row items-center justify-between w-full">
          <Text style={styles.text}>Store</Text>
          <Text style={styles.textDescription}>{OrderStoreName}</Text>
        </View>
        <View className="flex-row items-center justify-between w-full">
          <Text style={styles.text}>Order ID</Text>
          <Text style={styles.textDescription}>{OrderID}</Text>
        </View>
        <View className="flex-row items-center justify-between w-full">
          <Text style={styles.text}>Order Type</Text>
          <Text style={styles.textDescription}>{OrderType}</Text>
        </View>
        {OrderDeliveryAddress &&
          <View className="flex-row items-center justify-between w-full">
            <Text style={styles.text}>Delivery Address</Text>
            <Text style={styles.textDescription}>{OrderDeliveryAddress}</Text>
          </View>
        }
        <View className="flex-row items-center justify-between w-full">
          <Text style={styles.text}>Order Date</Text>
          <Text style={styles.textDescription}>{formatDate(OrderDate)}</Text>
        </View>
        <View className="flex-row items-center justify-between w-full">
          <Text style={styles.text}>Order Status</Text>
          <Text style={styles.textDescription}>{orderStatusTextDisplayer(OrderStatus, OrderType)}</Text>
        </View>
      </View>
      <View style={styles.commandeContainer}>
        <View className="flex-row items-center justify-between w-full">
          <Text style={styles.text}>Sub Total</Text>
          <Text style={styles.textDescription}>DA {OrderSubTotal}</Text>
        </View>
        <View className="flex-row items-center justify-between w-full">
          <Text style={styles.text}>Delivery Charge</Text>
          <Text style={styles.textDescription}>+ DA {OrderDeliveryCharge}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  gapColumn: {
    flexDirection: "column",
    gap: 4,
  },
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
  },
  commandeContainer: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: "column",
    gap: 4,
    borderColor: "#F7F7F7",
  },
});

export default EReceiptDetails;
