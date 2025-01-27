import { View, Text, StyleSheet, Dimensions } from "react-native";

import React from "react";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";

const StoreCart = () => {
  return (
    <View style={styles.containerScroll}>
      <View style={styles.cartOrderItemView}></View>
      <ShimmerPlaceholder style={styles.cartOrderItem} />
      <ShimmerPlaceholder style={styles.cartOrderItem} />
      <ShimmerPlaceholder style={styles.cartOrderItem} />
      <ShimmerPlaceholder style={styles.cartOrderItem} />
      <ShimmerPlaceholder style={styles.cartOrderItem} />
      <ShimmerPlaceholder style={styles.cartOrderItem} />
      <ShimmerPlaceholder style={styles.cartOrderItem} />
      <ShimmerPlaceholder style={styles.cartOrderItem} />
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
    height: 1,
    borderRadius: 20,
    width: "100%",
  },
  cartOrderItemView: {
    // height: 45,
    borderRadius: 20,
    width: "100%",
  },

  containerScroll: {
    width: "100%",
    flexDirection: "column",
    gap: 55,
  },
});

export default StoreCart;
