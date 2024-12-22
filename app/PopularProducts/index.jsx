import { View, Text, ScrollView, Dimensions } from "react-native";
import React, { useLayoutEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import BackButton from "../../components/BackButton";
import { StyleSheet } from "react-native";
import ProductCard from "../../components/ProductCard";

const Elio = require("../../assets/images/Elio.png");

const COLUMN_COUNT = 1;
const DATA = [
  { id: "1", ProductName: "Item 1" },
  { id: "2", ProductName: "Item 2" },
  { id: "3", ProductName: "Item 3" },
  { id: "4", ProductName: "Item 4" },
  { id: "5", ProductName: "Item 5" },
  { id: "6", ProductName: "Item 6" },
  { id: "7", ProductName: "Item 7" },
];

const PopularProductScreen = () => {
  const navigation = useNavigation();
  const renderGridItems = () => {
    const items = [];

    for (let i = 0; i < DATA.length; i += COLUMN_COUNT) {
      const rowItems = DATA.slice(i, i + COLUMN_COUNT).map((item) => (
        <ProductCard
          key={item.id}
          ProductName={item.ProductName}
          ProductBrand="Cevital"
          ProductPrice="120.00"
          imgUrl={Elio}
          onPress={() => navigation.navigate("ProductScreen")}
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
    <SafeAreaView className="bg-white pt-3 relative h-full">
      <View className="mx-5 mb-[20] flex-row items-center justify-between">
        <BackButton />
        <Text className="text-center" style={styles.titleScreen}>
          Popular Product
        </Text>
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
  titleCategory: {
    fontSize: 18,
    fontFamily: "Montserrat-Regular",
    textAlign: "center",
  },
  titleScreen: {
    fontSize: 20,
    fontFamily: "Montserrat-Regular",
    textAlign: "center",
  },
  Vide: {
    width: 40,
    height: 40,
  },
  container: {
    flexGrow: 1,
    justifyContent: "space-between",
    flexDirection: "column",
  },
  row: {
    flexDirection: "row",
    justifyContent: "centre",
  },
});

export default PopularProductScreen;
