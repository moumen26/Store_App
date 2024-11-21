import { View, Text, ScrollView } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";

import BackButton from "../../components/BackButton";
import SearchItem from "../../components/SearchItem";
import RecentSearchItem from "../../components/RecentSearchItem";
import ProductCard from "../../components/ProductCard";
import { useNavigation } from "expo-router";

const LaveVitre = require("../../assets/images/LaveVitre.png");

const COLUMN_COUNT = 1;
const DATARECENTSEARCH = [
  { id: "1", ProductName: "Lave Vitre" },
  { id: "2", ProductName: "Lave Vitre" },
  { id: "3", ProductName: "Lave Vitre" },
  { id: "4", ProductName: "Lave Vitre" },
  { id: "5", ProductName: "Lave Vitre" },
  { id: "6", ProductName: "Lave Vitre" },
  { id: "7", ProductName: "Lave Vitre" },
];

const DATARECENTVIEW = [
  {
    id: "1",
    ProductName: "Lave Vitre",
    ProductBrand: "AMIR Clean",
    ProductPrice: "165.00",
    imgUrl: LaveVitre,
  },
  {
    id: "2",
    ProductName: "Lave Vitre",
    ProductBrand: "AMIR Clean",
    ProductPrice: "165.00",
    imgUrl: LaveVitre,
  },
  {
    id: "3",
    ProductName: "Lave Vitre",
    ProductBrand: "AMIR Clean",
    ProductPrice: "165.00",
    imgUrl: LaveVitre,
  },
  {
    id: "4",
    ProductName: "Lave Vitre",
    ProductBrand: "AMIR Clean",
    ProductPrice: "165.00",
    imgUrl: LaveVitre,
  },
  {
    id: "5",
    ProductName: "Lave Vitre",
    ProductBrand: "AMIR Clean",
    ProductPrice: "165.00",
    imgUrl: LaveVitre,
  },
  {
    id: "6",
    ProductName: "Lave Vitre",
    ProductBrand: "AMIR Clean",
    ProductPrice: "165.00",
    imgUrl: LaveVitre,
  },
];

const SearchScreen = () => {
  const navigation = useNavigation();

  const renderRecentSearchItems = () => {
    const items = [];

    for (let i = 0; i < DATARECENTSEARCH.length; i += COLUMN_COUNT) {
      const rowItems = DATARECENTSEARCH.slice(i, i + COLUMN_COUNT).map(
        (item) => (
          <RecentSearchItem key={item.id} ProductName={item.ProductName} />
        )
      );
      items.push(
        <View key={i} style={styles.row}>
          {rowItems}
        </View>
      );
    }

    return items;
  };

  const renderRecentViewItems = () => {
    const items = [];

    for (let i = 0; i < DATARECENTVIEW.length; i += COLUMN_COUNT) {
      const rowItems = DATARECENTVIEW.slice(i, i + COLUMN_COUNT).map((item) => (
        <ProductCard
          key={item.id}
          ProductName={item.ProductName}
          ProductBrand={item.ProductBrand}
          ProductPrice={item.ProductPrice}
          imgUrl={item.imgUrl}
          //   onPress={() => navigation.navigate("ProductScreen")}
        />
      ));
      items.push(
        <View key={i} style={styles.row}>
          {rowItems}
        </View>
      );
    }

    return items;
  };

  return (
    <SafeAreaView className="bg-white pt-5 relative h-full">
      <View className="flex-row items-center mx-5 justify-between mb-[20]">
        <BackButton />
        <SearchItem placeholder="Search by Product.." />
      </View>
      <View className="mx-5 h-[250] mb-[20]">
        <Text className="mb-[12]" style={styles.titleCategory}>
          Recent Search
        </Text>
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 0, paddingTop: 0 }}
          vertical
          s
          showsVerticalScrollIndicator={false}
        >
          {renderRecentSearchItems()}
        </ScrollView>
      </View>
      <Text className="mb-[12] mx-5" style={styles.titleCategory}>
        Recent View
      </Text>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 0, paddingTop: 0 }}
        vertical
        showsVerticalScrollIndicator={false}
        className="mx-5 pb-5"
      >
        {renderRecentViewItems()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  titleCategory: {
    fontSize: 18,
    fontFamily: "Montserrat-Regular",
  },
});

export default SearchScreen;
