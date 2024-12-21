import { View, Text, StyleSheet, Dimensions } from "react-native";

import React from "react";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";

const Brands = () => {
  return (
    <View>
      <View style={styles.sliderContainer}>
        <ShimmerPlaceholder style={styles.sliderImage} />
        <ShimmerPlaceholder style={styles.sliderImage} />
        <ShimmerPlaceholder style={styles.sliderImage} />
        <ShimmerPlaceholder style={styles.sliderImage} />
        <ShimmerPlaceholder style={styles.sliderImage} />
        <ShimmerPlaceholder style={styles.sliderImage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sliderImage: {
    width: 101,
    height: 42,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  sliderContainer: {
    flexDirection: "row",
    overflow: "hidden",
  },
  text: {
    width: 100,
    borderRadius: 5,
  },
});

export default Brands;
