import { View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";

import BackButton from "../../components/BackButton";
import SearchItem from "../../components/SearchItem";
import RecentSearchItem from "../../components/RecentSearchItem";
import ProductCard from "../../components/ProductCard";
import { useNavigation, useRoute } from "@react-navigation/native";
import Config from "../config";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";

const SearchScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { ProductsData, storeId } = route.params;
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProductsData, setFilteredProductsData] = useState([]);

  const renderRecentViewItems = (data) => {
    const items = [];

    for (let i = 0; i < data?.length; i += 1) {
      const rowItems = data?.slice(i, i + 1).map((item) => (
        <ProductCard
          key={item._id}
          ProductName={item?.product?.name + " " + item?.product?.size}
          ProductBrand={item?.product?.brand?.name}
          ProductPrice={item.selling}
          imgUrl={`${Config.API_URL.replace("/api", "")}/files/${
              item?.product?.image
            }`}
            onPress={() => navigation.navigate("Product/index", { 
              data: item,
              storeId: storeId,
            })}
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

  // Update filteredProductsData whenever ProductsData or searchQuery changes
  useEffect(() => {
    if (ProductsData) {
      if (searchQuery.trim() === '') {
        // If search query is empty, show all stores
        setFilteredProductsData(ProductsData);
      } else {
        // Filter stores based on search query
        const query = searchQuery.toLowerCase().trim();
        const filtered = ProductsData?.filter(item => 
          (item?.product?.name && item?.product?.name?.toLowerCase().includes(query)) || 
          (item?.product?.size && item?.product?.size?.toLowerCase().includes(query)) ||
          (item?.product?.brand?.name && item?.product?.brand?.name?.toLowerCase().includes(query)) ||
          (item?.selling && item?.selling?.toString().toLowerCase().includes(query))
        );
        setFilteredProductsData(filtered);
      }
    } else {
      setFilteredProductsData([]);
    }
  }, [ProductsData, searchQuery]);

  // Handle search clear function
  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <SafeAreaView className="bg-white pt-3 relative h-full">
      <View className="flex-row items-center mx-5 justify-between mb-[20]">
        <BackButton />
        <View style={styles.searchBar} className="flex-row items-center space-x-2">
          <MagnifyingGlassIcon size={20} color="#26667E" />
          <TextInput
            style={styles.searchBarItem}
            placeholder={"Search by Product.."}
            placeholderTextColor="#888888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={handleClearSearch}
              style={styles.clearButton}
            >
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 0, paddingTop: 0 }}
        vertical
        showsVerticalScrollIndicator={false}
        className="mx-5 pb-5"
      >
        {renderRecentViewItems(filteredProductsData)}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  titleCategory: {
    fontSize: 18,
    fontFamily: "Montserrat-Regular",
  },
  searchBar: {
    width: 300,
    height: 40,
    borderRadius: 20,
    borderColor: "#26667E",
    borderWidth: 1,
    alignItems: "center",
    paddingLeft: 15,
    flexDirection: "row",
    gap: 4,
  },
  searchBarItem: {
    fontSize: 12,
    fontFamily: "Montserrat-Regular",
    width: 220,
    color: "black",
  },
});

export default SearchScreen;
