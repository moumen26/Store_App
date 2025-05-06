import React from "react";
import { StyleSheet } from "react-native";

import { ArrowLeftIcon } from "react-native-heroicons/outline";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const BackButton = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity style={styles.BackButton} onPress={navigation.goBack}>
      <ArrowLeftIcon color="#63BBF5" size={18} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  BackButton: {
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

export default BackButton;
