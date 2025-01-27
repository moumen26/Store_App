import { StyleSheet } from "react-native";

import React from "react";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";

const CodeBar = () => {
  return <ShimmerPlaceholder style={styles.codeBar} />;
};

const styles = StyleSheet.create({
  codeBar: {
    height: 90,
    width: "100%",
    paddingLeft: 10,
    paddingRight: 10,
  },
});

export default CodeBar;
