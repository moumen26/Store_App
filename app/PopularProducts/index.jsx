import { View, Text, ScrollView } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "../../components/BackButton";
import { StyleSheet } from "react-native";
import ProductCard from "../../components/ProductCard";
import { useNavigation, useRoute } from "@react-navigation/native";
import Config from "../config";

const PopularProductScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { popularProductsData, storeId } = route.params;

  return (
    <SafeAreaView className="bg-white pt-3 relative h-full">
      <View className="mx-5 mb-[20] flex-row items-center justify-between">
        <BackButton />
        <Text className="text-center" style={styles.titleScreen}>
          Popular Products
        </Text>
        <View style={styles.Vide}></View>
      </View>
      <ScrollView
        className="mx-5"
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {popularProductsData?.map((item) => (
          <ProductCard
            key={item._id}
            ProductName={item?.stock?.product?.name + " " + item?.stock?.product?.size}
            ProductBrand={item?.stock?.product?.brand?.name}
            ProductPrice={item?.stock.selling}
            imgUrl={`${Config.API_URL.replace("/api", "")}/files/${
              item?.stock?.product?.image
            }`}
            onPress={() => navigation.navigate("Product/index", { 
              data: item?.stock,
              storeId: storeId,
            })}
          />
        ))}
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
    gap: 8,
    flexDirection: "column",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-centre",
  },
});

export default PopularProductScreen;
