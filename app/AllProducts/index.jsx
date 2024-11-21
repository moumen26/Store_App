import { View, Text, ScrollView } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "../../components/BackButton";
import { StyleSheet } from "react-native";
import ProductCard from "../../components/ProductCard";
import { useNavigation } from "expo-router";

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

const AllProductsScreen = () => {
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
        //   onPress={() => navigation.navigate("ProductScreen")}
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
    <SafeAreaView className="bg-white pt-5 pb-2 relative h-full">
      <View className="mx-5 mb-[20] flex-row items-center justify-between">
        <BackButton />
        <Text className="text-center" style={styles.titleScreen}>
          All Product
        </Text>
        <View style={styles.Vide} onPress={navigation.goBack}></View>
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
    justifyContent: "space-centre",
  },
});

export default AllProductsScreen;
