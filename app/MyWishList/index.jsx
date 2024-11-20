import { Image, View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import PopularProductCard from "../../components/PopularProductCard";
import BackButton from "../../components/BackButton";

const LaveSolImg = require("../../assets/images/LaveSol.png");

const COLUMN_COUNT = 2;
const DATA = [
  { id: "1", ProductName: "Item 1" },
  { id: "2", ProductName: "Item 2" },
  { id: "3", ProductName: "Item 3" },
  { id: "4", ProductName: "Item 4" },
  { id: "5", ProductName: "Item 5" },
  { id: "6", ProductName: "Item 6" },
  { id: "7", ProductName: "Item 7" },
];

const MyWishListScreen = () => {
  const navigation = useNavigation();

  const renderGridItems = () => {
    const items = [];

    for (let i = 0; i < DATA.length; i += COLUMN_COUNT) {
      const rowItems = DATA.slice(i, i + COLUMN_COUNT).map((item) => (
        <PopularProductCard
          key={item.id}
          ProductName={item.ProductName}
          imgUrl={LaveSolImg}
        />
      ));
      items.push(
        <View className="mb-4" key={i} style={styles.row}>
          {rowItems}
        </View>
      );
    }

    return items;
  };

  return (
    <SafeAreaView className="bg-white pt-5 pb-1 relative h-full">
      <View className="mx-5 mb-[20] flex-row items-center justify-between">
        <BackButton />
        <Text style={styles.titleScreen}>My Wishlist</Text>
        <View style={styles.Vide}></View>
      </View>
      <ScrollView
        className="mx-5"
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {renderGridItems()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  Vide: {
    width: 40,
    height: 40,
  },
  titleScreen: {
    fontSize: 20,
    fontFamily: "Montserrat-Regular",
  },
  text: {
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
  },
  titleCategory: {
    fontSize: 18,
    fontFamily: "Montserrat-Regular",
  },
  container: {
    flexGrow: 1,
    justifyContent: "space-between",
    flexDirection: "column",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  navigationClass: {
    borderColor: "#888888",
    borderWidth: 0.5,
    backgroundColor: "#fff",
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  navigationText: {
    fontSize: 10,
    fontFamily: "Montserrat-Regular",
  },
});

export default MyWishListScreen;
