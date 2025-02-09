import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const ScanButton = ({ onScanComplete }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate("ScanBarCode/index", {
      onScanComplete,
    });
  };

  return (
    <TouchableOpacity style={styles.scanButton} onPress={handlePress}>
      <AntDesign name="scan1" color="#26667E" size={20} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  scanButton: {
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