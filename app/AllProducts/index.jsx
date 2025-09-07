import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from "react-native";
import React, { useCallback, useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import BackButton from "../../components/BackButton";
import ProductCard from "../../components/ProductCard";
import { useNavigation, useRoute } from "@react-navigation/native";
import Config from "../config";

const AllProductsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { productsData, storeId } = route.params;

  // Sort products alphabetically by name (A to Z)
  const sortedProductsData = useMemo(() => {
    return [...productsData].sort((a, b) => {
      const nameA = (a?.product?.name || "").toLowerCase();
      const nameB = (b?.product?.name || "").toLowerCase();
      return nameA.localeCompare(nameB);
    });
  }, [productsData]);

  // Get screen dimensions
  const { width, height } = useWindowDimensions();

  // Calculate responsive values
  const isSmallScreen = width < 375;
  const isMediumScreen = width >= 375 && width < 768;
  const isLargeScreen = width >= 768;

  // Responsive spacing calculations
  const horizontalPadding = width * 0.05;
  const verticalSpacing = height * 0.025;
  const smallSpacing = height * 0.01;

  // For iPhone 15 Pro and similar devices, use single column layout
  // iPhone 15 Pro has width of 393 in portrait mode
  const isIPhone15ProSize = width >= 390 && width <= 428;

  // Use more columns only for tablet-sized screens
  const numberOfColumns = isLargeScreen ? 3 : width >= 600 ? 2 : 1;

  // Create arrays for grid layout based on number of columns
  const createProductGrid = () => {
    const grid = [];
    let row = [];

    sortedProductsData.forEach((item, index) => {
      row.push(item);

      if (
        row.length === numberOfColumns ||
        index === sortedProductsData.length - 1
      ) {
        grid.push([...row]);
        row = [];
      }
    });

    return grid;
  };

  const productGrid = createProductGrid();

  // Refresh the layout when screen changes orientation
  useFocusEffect(
    useCallback(() => {
      // This will re-render component when screen comes into focus
      return () => {};
    }, [width, height])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View
        style={[
          styles.headerContainer,
          {
            marginHorizontal: horizontalPadding,
            marginBottom: isSmallScreen ? smallSpacing : verticalSpacing * 0.7,
          },
        ]}
      >
        <BackButton />
        <Text
          style={[
            styles.titleScreen,
            {
              fontSize: isSmallScreen ? 18 : isLargeScreen ? 24 : 20,
            },
          ]}
        >
          Tous les produits
        </Text>
        <View
          style={[
            styles.vide,
            {
              width: isSmallScreen ? 32 : 40,
              height: isSmallScreen ? 32 : 40,
            },
          ]}
        ></View>
      </View>

      <ScrollView
        style={{ marginHorizontal: horizontalPadding }}
        contentContainerStyle={[
          styles.container,
          { gap: smallSpacing, paddingBottom: height * 0.05 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {numberOfColumns > 1
          ? // Grid layout for medium and large screens
            productGrid.map((row, rowIndex) => (
              <View
                key={`row-${rowIndex}`}
                style={[
                  styles.row,
                  {
                    gap: horizontalPadding * 0.6,
                    marginBottom: smallSpacing,
                  },
                ]}
              >
                {row.map((item) => (
                  <View
                    key={item._id}
                    style={{
                      flex: 1,
                      maxWidth:
                        (width -
                          horizontalPadding * 2 -
                          horizontalPadding * 0.6 * (numberOfColumns - 1)) /
                        numberOfColumns,
                    }}
                  >
                    <ProductCard
                      ProductName={
                        item?.product?.name + " " + item?.product?.size
                      }
                      ProductBrand={item?.product?.brand?.name}
                      ProductPrice={item.selling}
                      imgUrl={`${Config.FILES_URL}/${item?.product?.image}`}
                      onPress={() =>
                        navigation.navigate("Product/index", {
                          data: item,
                          storeId: storeId,
                        })
                      }
                    />
                  </View>
                ))}

                {/* Add empty placeholders to maintain grid alignment for the last row */}
                {row.length < numberOfColumns &&
                  Array(numberOfColumns - row.length)
                    .fill()
                    .map((_, index) => (
                      <View
                        key={`empty-${index}`}
                        style={{
                          flex: 1,
                          maxWidth:
                            (width -
                              horizontalPadding * 2 -
                              horizontalPadding * 0.6 * (numberOfColumns - 1)) /
                            numberOfColumns,
                        }}
                      />
                    ))}
              </View>
            ))
          : // Column layout for small screens
            sortedProductsData.map((item) => (
              <ProductCard
                key={item._id}
                ProductName={item?.product?.name + " " + item?.product?.size}
                ProductBrand={item?.product?.brand?.name}
                ProductPrice={item.selling}
                imgUrl={`${Config.FILES_URL}/${item?.product?.image}`}
                onPress={() =>
                  navigation.navigate("Product/index", {
                    data: item,
                    storeId: storeId,
                  })
                }
              />
            ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? 10 : 3,
    height: "100%",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleScreen: {
    fontFamily: "Montserrat-Regular",
    textAlign: "center",
  },
  vide: {
    // Dimensions set dynamically
  },
  container: {
    flexGrow: 1,
    flexDirection: "column",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
});

export default AllProductsScreen;
