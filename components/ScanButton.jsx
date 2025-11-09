import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Scan } from "lucide-react-native";

const ScanButton = ({ onScanComplete }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate("ScanBarCode/index", {
      onScanComplete,
    });
  };

  return (
    <TouchableOpacity style={styles.scanButton} onPress={handlePress}>
      <Scan color="#19213D" size={20} />
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
    borderColor: "#E3EFFF",
    borderWidth: 1,
  },
});

export default ScanButton;
