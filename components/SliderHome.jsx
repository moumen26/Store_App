import { View, StyleSheet, Image, FlatList, Dimensions } from "react-native";
import React from "react";

const SpecialForYouCardImg1 = require("../assets/images/SpecialForYouBingo.jpg");
const SpecialForYouCardImg2 = require("../assets/images/SpecialForYouAigle.jpg");
const SpecialForYouCardImg3 = require("../assets/images/SpecialForYouAmir.jpg");

const SliderHome = () => {
  const cards = [
    { image: SpecialForYouCardImg1 },
    { image: SpecialForYouCardImg2 },
    { image: SpecialForYouCardImg3 },
  ];

  return (
    <View style={styles.sliderContainer}>
      <FlatList
        data={cards}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View>
            <Image source={item.image} style={styles.sliderImage} />
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
});

export default SliderHome;
