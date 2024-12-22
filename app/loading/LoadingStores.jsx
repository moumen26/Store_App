import { View, StyleSheet } from "react-native";

import React from "react";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";

const LoadingStores = () => {
  return (
    <View style={styles.column}>
      <ShimmerPlaceholder style={styles.StoreItem} />
      <ShimmerPlaceholder style={styles.StoreItem} />
      <ShimmerPlaceholder style={styles.StoreItem} />
      <ShimmerPlaceholder style={styles.StoreItem} />
      <ShimmerPlaceholder style={styles.StoreItem} />
      <ShimmerPlaceholder style={styles.StoreItem} />
      <ShimmerPlaceholder style={styles.StoreItem} />
      <ShimmerPlaceholder style={styles.StoreItem} />
      <ShimmerPlaceholder style={styles.StoreItem} />
      <ShimmerPlaceholder style={styles.StoreItem} />
      <ShimmerPlaceholder style={styles.StoreItem} />
    </View>
  );
};

const styles = StyleSheet.create({
  StoreItem: {
    width: "100%",
    height: 60,
    borderRadius: 15,
    marginBottom: 16,
  },
});

export default LoadingStores;
