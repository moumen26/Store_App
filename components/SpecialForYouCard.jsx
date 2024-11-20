import { Image, View } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";

const SpecialForYouCard = ({ imgUrl }) => {
  return (
    <View>
      <Image source={imgUrl} style={styles.imageClass} />
    </View>
  );
};

const styles = StyleSheet.create({
  imageClass: {
    width: 300,
    height: 156,
    borderRadius: 20,
  },
});

export default SpecialForYouCard;
