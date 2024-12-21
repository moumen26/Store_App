import { View, Text, StyleSheet, Dimensions } from "react-native";

import React from "react";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";

const Cart = () => {
  return (
    <View style={styles.containerScroll}>
      <ShimmerPlaceholder style={styles.cartOrderItem} />
      <ShimmerPlaceholder style={styles.cartOrderItem} />
      <ShimmerPlaceholder style={styles.cartOrderItem} />
      <ShimmerPlaceholder style={styles.cartOrderItem} />
      <ShimmerPlaceholder style={styles.cartOrderItem} />
      <ShimmerPlaceholder style={styles.cartOrderItem} />
    </View>
  );
};

const styles = StyleSheet.create({
  cartOrderItem: {
    height: 200,
    borderRadius: 20,
    width: "100%",
  },

  containerScroll: {
    width: "100%",
    flexDirection: "column",
    gap: 16,
  },
});

export default Cart;
