import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "../../components/BackButton";
import ProductCard from "../../components/ProductCard";
import { useNavigation, useRoute } from "@react-navigation/native";
import Config from "../config";

const PopularProductScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { popularProductsData, storeId } = route.params;

  // Get screen dimensions
  const { width, height } = useWindowDimensions();

  // Calculate responsive values
  const isSmallScreen = width < 375;
  const isMediumScreen = width >= 375 && width < 768;
  const isLargeScreen = width >= 768;

  // Responsive spacing calculations
  const horizontalPadding = width * 0.05;
  const verticalSpacing = height * 0.025;
  const cardGap = isSmallScreen ? 6 : isLargeScreen ? 12 : 8;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View
        style={[
          styles.headerContainer,
          {
            marginHorizontal: horizontalPadding,
            marginBottom: verticalSpacing,
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
          Produits Populaires
        </Text>
        <View
          style={[
            styles.vide,
            {
              width: isSmallScreen ? 32 : 40,
              height: isSmallScreen ? 32 : 40,
            },
          ]}
        />
      </View>
      <ScrollView
        style={{ marginHorizontal: horizontalPadding }}
        contentContainerStyle={[
          styles.container,
          {
            gap: cardGap,
            paddingBottom: Platform.OS === "ios" ? 30 : 20,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {popularProductsData?.map((item) => (
          <ProductCard
            key={item._id}
            ProductName={
              item?.stock?.product?.name + " " + item?.stock?.product?.size
            }
            ProductBrand={item?.stock?.product?.brand?.name}
            ProductPrice={item?.stock.selling}
            imgUrl={`${Config.FILES_URL}/${
              item?.stock?.product?.image
            }`}
            onPress={() =>
              navigation.navigate("Product/index", {
                data: item?.stock,
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
  titleCategory: {
    fontSize: 18,
    fontFamily: "Montserrat-Regular",
    textAlign: "center",
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
    justifyContent: "space-centre",
  },
});

export default PopularProductScreen;
