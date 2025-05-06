import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

const WilayaDropdown = ({ data, dropDownTitle, onSelect }) => {
  const [value, setValue] = useState(null);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Dropdown
      style={[styles.dropdown, isFocused && { borderColor: "#63BBF5" }]}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      data={data}
      search
      maxHeight={200}
      labelField="label"
      valueField="value"
      placeholder={dropDownTitle}
      searchPlaceholder="Search..."
      value={value}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onChange={(item) => {
        setValue(item.value);
        onSelect(item.value);
        setIsFocused(false);
      }}
    />
  );
};

export default WilayaDropdown;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
  dropdown: {
    width: 170,
    height: 50,
    borderColor: "#63BBF5",
    borderWidth: 0.5,
    borderRadius: 10,
    paddingHorizontal: 16,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
  },
  placeholderStyle: {
    fontSize: 12,
    fontFamily: "Montserrat-Regular",
  },
  selectedTextStyle: {
    fontSize: 12,
    fontFamily: "Montserrat-Regular",
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 12,
    fontFamily: "Montserrat-Regular",
  },
});
