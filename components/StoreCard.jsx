import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const StoreCard = ({ title, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.StoreItem}
      className="h-[59] w-full flex-row items-center justify-between pr-[17] pl-[17] mb-3"
    >
      <Text style={styles.text}>{title}</Text>
      <View style={styles.shopItem}>
        <Text style={styles.textItem}>Shop</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 13,
    fontFamily: "Montserrat-Regular",
  },
  textItem: {
    fontSize: 10,
    fontFamily: "Montserrat-SemiBold",
  },
  StoreItem: {
    padding: 15,
    marginBottom: 10,
    height: 60,
    borderRadius: 15,
    backgroundColor: "#fff",
    borderColor: "#C9E4EE",
    borderWidth: 1,
  },
  shopItem: {
    width: 70,
    height: 25,
    borderRadius: 15,
    borderColor: "#000",
    borderWidth: 0.3,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default StoreCard;
