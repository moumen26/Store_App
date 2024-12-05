import { Image, View, Text, ScrollView } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "../../components/BackButton";
import ProductCard from "../../components/ProductCard";
import { useNavigation, useRoute } from "@react-navigation/native";

const imgUrl = require("../../assets/images/Cavital.webp");
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

const BrandScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { brandId, brandIMG } = route.params;

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
    <SafeAreaView className="bg-white relative h-full">
      <View style={styles.ligne} className="relative mb-[20]">
        <View className="mx-5 h-[200]">
          <Image source={{uri: brandIMG}} style={styles.imageBrand} />
          <View className="flex-row items-center justify-between">
            <BackButton />
          </View>
        </View>
      </View>

      <Text className="mb-[12] mx-5" style={styles.titleCategory}>
        Product List
      </Text>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 0, paddingTop: 0 }}
        vertical
        showsVerticalScrollIndicator={false}
        className="mx-5"
      >
        {renderGridItems()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  imageBrand: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    resizeMode: "contain",
  },
  ligne: {
    borderBottomColor: "#888888",
    borderBottomWidth: 0.5,
  },
  titleCategory: {
    fontSize: 18,
    fontFamily: "Montserrat-Regular",
  },
});

export default BrandScreen;
