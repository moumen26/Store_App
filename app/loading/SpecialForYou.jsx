import { View, Text, StyleSheet, Dimensions, FlatList } from "react-native";

import React from "react";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";

const SpecialForYou = () => {
  return (
    <View>
      <ShimmerPlaceholder style={styles.text} />

      <View style={styles.sliderContainer}>
        <ShimmerPlaceholder style={styles.sliderImage} />
        <ShimmerPlaceholder style={styles.sliderImage} />
        <ShimmerPlaceholder style={styles.sliderImage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sliderImage: {
    width: Dimensions.get("screen").width * 0.8,
    height: 156,
    borderRadius: 20,
    marginRight: 15,
  },
  sliderContainer: {
    flexDirection: "row",
    marginTop: 15,
    overflow: "hidden",
  },
  text: {
    width: 200,
    borderRadius: 5,
  },
});

export default SpecialForYou;
