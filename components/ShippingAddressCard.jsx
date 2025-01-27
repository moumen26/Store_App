import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { ClockIcon } from "react-native-heroicons/outline";
const LocationIcon = require("../assets/icons/Location.png");

const ShippingAddressCard = ({
  index,
  AddressTitle,
  AddressPlace,
  AddressTime,
  isSelected,
  onSelect,
}) => {
  return (
    <TouchableOpacity
      onPress={() => onSelect(index)}
      style={styles.shippingItem}
    >
      <View style={styles.container}>
        <View style={styles.gapRow}>
          <Image source={LocationIcon} />

          <View style={styles.gapColumn}>
            <Text style={styles.textPlace}>{AddressTitle}</Text>
            <Text style={styles.textdescription}>{AddressPlace}</Text>
            <View style={styles.timeContainer}>
              <ClockIcon size={16} color="#888888" />
              <Text style={styles.textdescription}>{AddressTime}</Text>
            </View>
          </View>
        </View>
        <View
          style={[
            styles.checkboxContainer,
            isSelected && styles.checkedContainer,
          ]}
        >
          {isSelected && <View style={[styles.checkbox, styles.checked]} />}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  gapRow: {
    flexDirection: "row",
    gap: 4,
  },
  gapColumn: {
    flexDirection: "column",
    gap: 4,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  textPlace: {
    fontSize: 12,
    fontFamily: "Montserrat-Regular",
  },
  textdescription: {
    fontFamily: "Montserrat-Regular",
    fontSize: 11,
    color: "#888888",
  },
  shippingItem: {
    width: "100%",
    height: 70,
    borderBottomWidth: 0.2,
    borderColor: "#888888",
    paddingBottom: 18,
    paddingRight: 10,
    paddingLeft: 10,
  },
  checkboxContainer: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#888888",
    justifyContent: "center",
    alignItems: "center",
  },
  checkbox: {
    width: 12,
    height: 12,
    borderRadius: 7,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "black",
  },
  checked: {
    backgroundColor: "#26667E",
    borderWidth: 0,
  },
  checkedContainer: {
    borderColor: "#3E9CB9",
  },
});

export default ShippingAddressCard;
