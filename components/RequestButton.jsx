import { TouchableOpacity } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";
import {
  ClipboardDocumentIcon,
} from "react-native-heroicons/outline";
import { useNavigation } from "expo-router";

const RequestButton = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.BackButton}
      onPress={() => navigation.navigate("RequestStores/index")}
    >
      <ClipboardDocumentIcon size={24} color="#26667E" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  BackButton: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    borderColor: "#3E9CB9",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RequestButton;
