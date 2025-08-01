import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";

const StoreCard = ({ title, sousTitle, buttonText, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.StoreItem}
      className="h-[60] w-full flex-row items-center justify-between pr-[20] pl-[20]"
    >
      <View>
        <Text style={styles.text}>{title}</Text>
        <Text style={styles.subText}>{sousTitle}</Text>
      </View>
      <View style={styles.shopItem}>
        <Text style={styles.textItem}>{buttonText}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 13,
    fontFamily: "Montserrat-Regular",
  },
  subText: {
    fontSize: 10,
    fontFamily: "Montserrat-Regular",
    color: "#888888",
  },
  textItem: {
    fontSize: 10,
    fontFamily: "Montserrat-SemiBold",
  },
  StoreItem: {
    padding: 15,
    height: 60,
    borderRadius: 15,
    backgroundColor: "#fff",
    borderColor: "#E3EFFF",
    borderWidth: 1,
    marginBottom: 15,
  },
  shopItem: {
    width: 80,
    height: 25,
    borderRadius: 15,
    paddingInline: 8,
    borderColor: "#000",
    borderWidth: 0.3,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default StoreCard;
