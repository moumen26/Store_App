import { View, Text, StyleSheet, Dimensions, FlatList } from "react-native";

import React from "react";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";

const SpecialForYou = () => {
  return (
    <View>
      <View style={styles.row}>
        <ShimmerPlaceholder style={styles.text} />
        <ShimmerPlaceholder style={styles.smallText} />
      </View>
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
    width: Dimensions.get("screen").width * 0.44,
    height: 233,
    borderRadius: 20,
    borderColor: "#C9E4EE",
    borderWidth: 0.5,
    alignItems: "center",
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
  smallText: {
    width: 70,
    borderRadius: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default SpecialForYou;
