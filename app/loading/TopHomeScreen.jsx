import { View, Text, StyleSheet, Dimensions, FlatList } from "react-native";

import React from "react";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";

const TopHomeScreen = () => {
  return (
    <View style={styles.row}>
      <View style={styles.column}>
        <ShimmerPlaceholder style={styles.smallText} />
        <ShimmerPlaceholder style={styles.text} />
      </View>
      <ShimmerPlaceholder style={styles.notification} />
    </View>
  );
};

const styles = StyleSheet.create({
  notification: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
  },
  text: {
    width: 170,
    borderRadius: 5,
  },
  smallText: {
    width: 80,
    borderRadius: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  column: {
    flexDirection: "column",
    gap: 4,
  },
});

export default TopHomeScreen;
