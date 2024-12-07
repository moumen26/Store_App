import { View, Text, StyleSheet, Dimensions, } from "react-native";

import React from "react";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";

const Brands = () => {
  return (
    <View>
      <ShimmerPlaceholder style={styles.text} />

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
    borderColor: "#C9E4EE",
    borderWidth: 0.5,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  sliderContainer: {
    flexDirection: "row",
    marginTop: 15,
    overflow: "hidden",
  },
  text: {
    width: 100,
    borderRadius: 5,
  },
});

export default Brands;
