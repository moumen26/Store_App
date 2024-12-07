import { View, Text, StyleSheet, Dimensions } from "react-native";

import React from "react";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";

const Brands = () => {
  return (
    <View>
      <ShimmerPlaceholder style={styles.sliderImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  sliderImage: {
    width: "100%",
    height: 50,
    borderRadius: 30,
  },
});

export default Brands;
