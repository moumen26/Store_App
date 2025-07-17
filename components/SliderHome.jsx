import { View, StyleSheet, Image, FlatList, Dimensions } from "react-native";
import React from "react";
import Config from "../app/config";


const SliderHome = ({PublicPublicitiesData}) => {
  return (
    <View style={styles.sliderContainer}>
      <FlatList
        data={PublicPublicitiesData}
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
});

export default SliderHome;
