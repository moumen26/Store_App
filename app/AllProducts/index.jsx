import { View, Text, ScrollView } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "../../components/BackButton";
import { StyleSheet } from "react-native";
import ProductCard from "../../components/ProductCard";
import { useNavigation, useRoute } from "@react-navigation/native";
import { API_URL } from "@env";

const AllProductsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { productsData } = route.params;

  return (
    <SafeAreaView className="bg-white relative h-full">
      <View className="mx-5 mb-[20] flex-row items-center justify-between">
        <BackButton />
        <Text className="text-center" style={styles.titleScreen}>
          All Product
        </Text>
        <View style={styles.Vide}></View>
      </View>
      <ScrollView
        className="mx-5"
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {productsData.map((item) => (
          <ProductCard
            key={item._id}
            ProductName={item?.product?.name + ' ' + item?.product?.size}
            ProductBrand={item?.product?.brand?.name}
            ProductPrice={item.selling}
            imgUrl={`${API_URL.replace('/api', '')}/files/${item?.product?.image}`}
            onPress={() => navigation.navigate("Product/index", { data: item })}
          />
        ))
        }
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
