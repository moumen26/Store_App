import { View, StyleSheet } from "react-native";
import React from "react";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";

const EReceiptDetailsShimmer = () => {
  return (
    <View className="">
      <View style={styles.commandeContainer}>
        {[...Array(6)].map((_, index) => (
          <View key={index} className="flex-row items-center justify-between w-full">
            <ShimmerPlaceholder style={styles.textPlaceholderLeft} />
            <ShimmerPlaceholder style={styles.textPlaceholderRight} />
          </View>
        ))}
      </View>

      <View style={styles.commandeContainer}>
        {[...Array(2)].map((_, index) => (
          <View key={index} className="flex-row items-center justify-between w-full">
            <ShimmerPlaceholder style={styles.textPlaceholderLeft} />
            <ShimmerPlaceholder style={styles.textPlaceholderRight} />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textPlaceholderLeft: {
    width: 110,
    height: 10,
    borderRadius: 2,
  },
  textPlaceholderRight: {
    width: 150,
    height: 10,
    borderRadius: 2,
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

export default EReceiptDetailsShimmer;
