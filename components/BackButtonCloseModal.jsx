import React from "react";
import { StyleSheet } from "react-native";

import { ArrowLeftIcon } from "react-native-heroicons/outline";
import { TouchableOpacity } from "react-native";

const BackButtonCloseModal = ({ handleCloseModal }) => {
  return (
    <TouchableOpacity style={styles.BackButton} onPress={handleCloseModal}>
      <ArrowLeftIcon color="#19213D" size={18} />
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

export default BackButtonCloseModal;
