import {
  Image,
  View,
  Text,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from "react-native";
import React, { useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import BackButton from "../../components/BackButton";
import ProductCard from "../../components/ProductCard";
import { useNavigation, useRoute } from "@react-navigation/native";
import Config from "../config";

const BrandScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { brandId, brandIMG, ProductsData, storeId } = route.params;

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
  const isIPhone15ProSize = width >= 390 && width <= 428;

  // Use more columns only for tablet-sized screens
  const numberOfColumns = isLargeScreen ? 3 : width >= 600 ? 2 : 1;

  // Create arrays for grid layout based on number of columns for larger screens
  const createProductGrid = () => {
    const grid = [];
    let row = [];

    const filteredProducts = ProductsData.filter((item) => {
      return item?.product?.brand?._id === brandId;
    });

    filteredProducts.forEach((item, index) => {
      row.push(item);

      if (
        row.length === numberOfColumns ||
        index === filteredProducts.length - 1
      ) {
        grid.push([...row]);
        row = [];
      }
    });

    return grid;
  };

  const productGrid = createProductGrid();

  // Calculate image height based on screen size
  const imageBrandHeight = isSmallScreen
    ? height * 0.15
    : isMediumScreen
    ? height * 0.2
    : height * 0.25;

  // Refresh the layout when screen changes orientation
  useFocusEffect(
    useCallback(() => {
      // This will re-render component when screen comes into focus
      return () => {};
    }, [width, height])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.ligne, { marginBottom: verticalSpacing }]}>
        <View
          style={[
            styles.imageClass,
            {
              height: imageBrandHeight,
              marginHorizontal: horizontalPadding,
            },
          ]}
        >
          <Image source={{ uri: brandIMG }} style={styles.imageBrand} />
          <View style={styles.backButtonContainer}>
            <BackButton />
          </View>
        </View>
      </View>

      <Text
        style={[
          styles.titleCategory,
          {
            fontSize: isSmallScreen ? 16 : isLargeScreen ? 22 : 18,
            marginBottom: smallSpacing,
            marginHorizontal: horizontalPadding,
          },
        ]}
      >
        Liste des produits
      </Text>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom:
              Platform.OS === "ios" ? height * 0.08 : height * 0.05,
          },
        ]}
        showsVerticalScrollIndicator={false}
        style={{ marginHorizontal: horizontalPadding }}
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
                      imgUrl={`${Config.API_URL.replace("/api", "")}/files/${
                        item?.product?.image
                      }`}
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
            ProductsData.filter((item) => {
              return item?.product?.brand?._id === brandId;
            }).map((item) => (
              <ProductCard
                key={item._id}
                ProductName={item?.product?.name + " " + item?.product?.size}
                ProductBrand={item?.product?.brand?.name}
                ProductPrice={item.selling}
                imgUrl={`${Config.API_URL.replace("/api", "")}/files/${
                  item?.product?.image
                }`}
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
  imageClass: {
    position: "relative",
  },
  imageBrand: {
    width: "100%",
    height: "90%",
    position: "absolute",
    left: 0,
    resizeMode: "contain",
  },
  ligne: {
    borderBottomColor: "#888888",
    borderBottomWidth: 0.5,
  },
  titleCategory: {
    fontFamily: "Montserrat-Regular",
  },
  scrollContent: {
    flexGrow: 1,
  },
  backButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "absolute",
    zIndex: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
});

export default BrandScreen;
