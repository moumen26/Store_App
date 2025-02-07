import { View, StyleSheet } from "react-native";

import React from "react";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";

const NotificationsLoading = () => {
  return (
    <View style={styles.column}>
      <View style={styles.columnNotif}>
        <ShimmerPlaceholder style={styles.textScreenToday} />
        <ShimmerPlaceholder style={styles.StoreItem} />
        <ShimmerPlaceholder style={styles.StoreItem} />
      </View>
      <View style={styles.columnNotif}>
        <ShimmerPlaceholder style={styles.textScreenYesterday} />
        <ShimmerPlaceholder style={styles.StoreItem} />
      </View>
      <View style={styles.columnNotif}>
        <ShimmerPlaceholder style={styles.textScreen} />
        <ShimmerPlaceholder style={styles.StoreItem} />
        <ShimmerPlaceholder style={styles.StoreItem} />
        <ShimmerPlaceholder style={styles.StoreItem} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  StoreItem: {
    width: "100%",
    height: 80,
    borderRadius: 15,
    marginTop: 12,
  },
  textScreenToday: {
    width: 100,
  },
  textScreenYesterday: {
    width: 150,
  },
  textScreen: {
    width: 200,
  },
  columnNotif: {
    marginBottom: 20,
    flexDirection: "column",

    // gap: 12,
  },
});

export default NotificationsLoading;
