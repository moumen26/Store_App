import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";
import { ArrowRightIcon } from "react-native-heroicons/outline";

const SavedStoreItem = ({ StoreName, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      className="w-full flex-row items-center justify-between"
    >
      <Text style={styles.textItemRegular}>{StoreName}</Text>
      <ArrowRightIcon color="#26667E" size={18} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  textItemRegular: {
    fontSize: 13,
    fontFamily: "Montserrat-Regular",
  },
  settingItem: {
    height: 45,
    borderBottomWidth: 0.5,
    borderColor: "#3E9CB9",
  },
});

export default SavedStoreItem;
