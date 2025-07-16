import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  useWindowDimensions,
  Platform,
} from "react-native";
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

  // Get screen dimensions
  const { width, height } = useWindowDimensions();

  // Calculate responsive values
  const isSmallScreen = width < 375;
  const isMediumScreen = width >= 375 && width < 768;
  const isLargeScreen = width >= 768;

  // Responsive spacing calculations
  const horizontalPadding = width * 0.05;
  const searchBarWidth = width * 0.75; // 75% of screen width
  const searchBarHeight = isSmallScreen ? 36 : isLargeScreen ? 44 : 40;
  const searchBarRadius = isSmallScreen ? 18 : 20;
  const searchIconSize = isSmallScreen ? 18 : isLargeScreen ? 22 : 20;

  const renderRecentViewItems = (data) => {
    const items = [];

    for (let i = 0; i < data?.length; i += 1) {
      const rowItems = data?.slice(i, i + 1).map((item) => (
        <ProductCard
          key={item._id}
          ProductName={item?.product?.name + " " + item?.product?.size}
          ProductBrand={item?.product?.brand?.name}
          ProductPrice={item.selling}
          imgUrl={`${Config.FILES_URL}/${
            item?.product?.image
          }`}
          onPress={() =>
            navigation.navigate("Product/index", {
              data: item,
              storeId: storeId,
            })
          }
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
      if (searchQuery.trim() === "") {
        // If search query is empty, show all stores
        setFilteredProductsData(ProductsData);
      } else {
        // Filter stores based on search query
        const query = searchQuery.toLowerCase().trim();
        const filtered = ProductsData?.filter(
          (item) =>
            (item?.product?.name &&
              item?.product?.name?.toLowerCase().includes(query)) ||
            (item?.product?.size &&
              item?.product?.size?.toLowerCase().includes(query)) ||
            (item?.product?.brand?.name &&
              item?.product?.brand?.name?.toLowerCase().includes(query)) ||
            (item?.selling &&
              item?.selling?.toString().toLowerCase().includes(query))
        );
        setFilteredProductsData(filtered);
      }
    } else {
      setFilteredProductsData([]);
    }
  }, [ProductsData, searchQuery]);

  // Handle search clear function
  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View
        style={[
          styles.headerContainer,
          {
            marginHorizontal: horizontalPadding,
            marginBottom: isSmallScreen ? 15 : 20,
          },
        ]}
      >
        <BackButton />
        <View
          style={[
            styles.searchBar,
            {
              width: searchBarWidth,
              height: searchBarHeight,
              borderRadius: searchBarRadius,
              paddingLeft: isSmallScreen ? 12 : 15,
              paddingRight: isSmallScreen ? 12 : 15,
            },
          ]}
        >
          <View style={styles.searchContent}>
            <MagnifyingGlassIcon size={searchIconSize} color="#63BBF5" />
            <TextInput
              style={[
                styles.searchBarItem,
                {
                  fontSize: isSmallScreen ? 11 : isLargeScreen ? 14 : 12,
                  flex: 1,
                },
              ]}
              placeholder="Rechercher un produit..."
              placeholderTextColor="#888888"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={handleClearSearch}
              style={styles.clearButton}
            >
              <Text
                style={[
                  styles.clearButtonText,
                  { fontSize: isSmallScreen ? 16 : isLargeScreen ? 20 : 18 },
                ]}
              >
                ✕
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: horizontalPadding,
          paddingTop: 0,
          paddingBottom: Platform.OS === "ios" ? 20 : 10,
        }}
        vertical
        showsVerticalScrollIndicator={false}
      >
        {renderRecentViewItems(filteredProductsData)}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 20,
    height: "100%",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleCategory: {
    fontSize: 18,
    fontFamily: "Montserrat-Regular",
  },
  searchBar: {
    borderColor: "#63BBF5",
    borderWidth: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 4,
  },
  searchContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  searchBarItem: {
    fontFamily: "Montserrat-Regular",
    color: "black",
  },
  clearButton: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  clearButtonText: {
    color: "#63BBF5",
    textAlign: "center",
  },
  row: {
    width: "100%",
  },
});

export default SearchScreen;
