import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

const WilayaDropdown = ({ dropDownTitle, data }) => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  return (
    <Dropdown
      style={[styles.dropdown, isFocus && { borderColor: "#3E9CB9" }]}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      inputSearchStyle={styles.inputSearchStyle}
      iconStyle={styles.iconStyle}
      data={data}
      search
      maxHeight={170}
      labelField="label"
      valueField="value"
      placeholder={!isFocus ? dropDownTitle || "Select Wilaya" : "..."}
      searchPlaceholder="Search..."
      value={value}
      onFocus={() => setIsFocus(true)}
      onBlur={() => setIsFocus(false)}
      onChange={(item) => {
        setValue(item.value);
        setIsFocus(false);
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
    width: 165,
    height: 50,
    borderColor: "#3E9CB9",
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
