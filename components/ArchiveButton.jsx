import { TouchableOpacity } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";
import {
  ArchiveBoxIcon,
  DocumentMagnifyingGlassIcon,
} from "react-native-heroicons/outline";
import { useNavigation } from "expo-router";

const ArchiveButton = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.BackButton}
      onPress={() => navigation.navigate("ArchiveOrders/index")}
    >
      <ArchiveBoxIcon size={20} color="#26667E" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  BackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderColor: "#3E9CB9",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ArchiveButton;
