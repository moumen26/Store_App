import { View, StyleSheet, Image, FlatList, Dimensions } from "react-native";
import React from "react";
import Config from "../app/config";
import { ActivityIndicator, Text } from "react-native";

const SpecialForYouCardImg1 = require("../assets/images/SpecialForYouCevital.jpg");
const SpecialForYouCardImg2 = require("../assets/images/SpecialForYouMama.jpg");
const SpecialForYouCardImg3 = require("../assets/images/SpecialForYouLesieur.jpg");

const SliderStore = ({
  data,
}) => {
  //--------------------------------------------RENDERING--------------------------------------------
  return (
    <View style={styles.sliderContainer}>
      <FlatList
        data={data}
        horizontal
        keyExtractor={(item) => item._id.toString()}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View>
            <Image
              source={{ uri: `${Config.FILES_URL}/${item.image}` }}
              style={styles.sliderImage}
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sliderImage: {
    width: Dimensions.get("screen").width * 0.8,
    height: 156,
    borderRadius: 20,
    marginRight: 15,
  },
  sliderContainer: {
    marginTop: 15,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  errorText: {
    fontSize: 10,
    fontFamily: "Montserrat-Regular",
    color: "#888888",
  },
});

export default SliderStore;