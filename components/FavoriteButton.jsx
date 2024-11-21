import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { HeartIcon as OutlineHeartIcon } from "react-native-heroicons/outline";
import { HeartIcon as SolidHeartIcon } from "react-native-heroicons/solid";

const FavoriteButton = () => {
  const [favorited, setFavorited] = useState(false);

  const toggleFavorite = () => {
    setFavorited(!favorited);
  };

  return (
    <TouchableOpacity style={styles.BackButton} onPress={toggleFavorite}>
      {favorited ? (
        <SolidHeartIcon color="#26667E" size={18} />
      ) : (
        <OutlineHeartIcon color="#26667E" size={18} />
      )}
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
    borderColor: "#26667E",
    borderWidth: 1,
  },
});

export default FavoriteButton;
