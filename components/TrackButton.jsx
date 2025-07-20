import { TouchableOpacity } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";
import { TruckIcon } from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";

const TrackButton = ({ data, OrderDataRefetch }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.BackButton}
      onPress={() =>
        navigation.navigate("TrackOrder/index", {
          recieptData: data,
          OrderDataRefetch: OrderDataRefetch,
        })
      }
    >
      <TruckIcon size={20} color="#19213D" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  BackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderColor: "#E3EFFF",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TrackButton;
