import { Image, View, Text, ScrollView } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "../../components/BackButton";
import ProductCard from "../../components/ProductCard";
import { useNavigation, useRoute } from "@react-navigation/native";
import Config from "../config";

const BrandScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { brandId, brandIMG, ProductsData, storeId } = route.params;

  return (
    <SafeAreaView className="bg-white pt-3 relative h-full">
      <View style={styles.ligne} className="relative mb-[20]">
        <View style={styles.imageClass} className="relative mx-5">
          <Image source={{ uri: brandIMG }} style={styles.imageBrand} />
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
        {ProductsData.filter((item) => {
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
            onPress={() => navigation.navigate("Product/index", { 
              data: item,
              storeId: storeId,
            })}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  imageClass: {
    height: 200,
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
    fontSize: 18,
    fontFamily: "Montserrat-Regular",
  },
});

export default BrandScreen;
