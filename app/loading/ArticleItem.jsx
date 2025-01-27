import { View, StyleSheet } from "react-native";
import React from "react";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";

const ArticleItem = () => {
  return (
    <View className="flex-row items-center justify-between w-full h-[90]">
      <View style={styles.flex}>
        <ShimmerPlaceholder style={styles.Image} />

        <View style={styles.flexCol}>
          <ShimmerPlaceholder style={styles.textPlaceholder} />
          <ShimmerPlaceholder style={styles.sousTextPlaceholder} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  Image: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
  textPlaceholder: {
    width: 120,
    height: 10,
    borderRadius: 2,
  },
  sousTextPlaceholder: {
    width: 80,
    height: 8,
    borderRadius: 2,
  },
  flex: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    
  },
  flexCol: {
    flexDirection: "column",
    gap: 8,
  },
});

export default ArticleItem;
