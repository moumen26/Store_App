import { View, StyleSheet, Image, FlatList, Dimensions } from "react-native";
import React from "react";
import { API_URL } from "@env";
import { ActivityIndicator, Text } from "react-native";

const SpecialForYouCardImg1 = require("../assets/images/SpecialForYouCevital.jpg");
const SpecialForYouCardImg2 = require("../assets/images/SpecialForYouMama.jpg");
const SpecialForYouCardImg3 = require("../assets/images/SpecialForYouLesieur.jpg");

const SliderStore = ({
  data,
  error,
  isLoading,
}) => {
  //--------------------------------------------RENDERING--------------------------------------------
  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>Oops! Something went wrong. Please try again later.</Text>
        <Text style={styles.errorText}>{error?.message}</Text>
      </View>
    );
  }

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
              source={{ uri: `${API_URL.replace(
                "/api",
                ""
              )}/files/${item.image}` }}
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