import React from "react";
import { StyleSheet } from "react-native";

import { TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";

const ScanButton = () => {

  return (
    <TouchableOpacity style={styles.ScanButton} 
    // sonPress={}
    
    >
      <AntDesign name="scan1" color="#26667E" size={20} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  ScanButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#26667E",
    borderWidth: 1,
  },
});

export default ScanButton;
