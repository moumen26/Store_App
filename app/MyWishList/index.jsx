import { View, Text, ScrollView } from "react-native";
import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import PopularProductCard from "../../components/PopularProductCard";
import BackButton from "../../components/BackButton";
import useAuthContext from "../hooks/useAuthContext";
import axios from "axios";
import Config from "../config";
import { useQuery } from "@tanstack/react-query";
import { FlatGrid } from 'react-native-super-grid';

// Axios instance for base URL configuration
const api = axios.create({
  baseURL: Config.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const MyWishListScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { storeId, favoriteId, storeName } = route.params;
  const { user } = useAuthContext();

  //--------------------------------------------APIs--------------------------------------------
  // Function to fetch favorite data
  const fetchFavoriteProductsData = async () => {
    try {
      const response = await api.get(`/Favorite/products/${favoriteId}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      // Return the data from the response
      return await response.data || [];
    } catch (error) {
      // Handle if the request fails with status code 401 or 404
      if (error?.response?.status === 401 || error?.response?.status === 404) {
        return []; // Return an empty array for 401 and 404 errors
      }
      throw new Error(error?.message || "Network error");
    }
  };
  const {
    data: FavoriteProductsData,
    error: FavoriteProductsDataError,
    isLoading: FavoriteProductsDataLoading,
    refetch: FavoriteProductsDataRefetch,
  } = useQuery({
    queryKey: ["FavoriteProductsData", user?.token], // Ensure token is part of the query key
    queryFn: fetchFavoriteProductsData, // Pass token to the fetch function
    enabled: !!user?.token, // Only run the query if user is authenticated
    refetchInterval: 10000, // Refetch every 1 minutes
    refetchOnWindowFocus: true, // Optional: refetching on window focus for React Native
  });
  
  return (
    <SafeAreaView className="bg-white pt-3 relative h-full">
      <View className="mx-5 mb-[20] flex-row items-center justify-between">
        <BackButton />
        <View style={styles.titleContainer}>
          <Text style={styles.titleScreen}>My Wishlist</Text>
          <Text style={styles.subtitleScreen}>{storeName}</Text>
        </View>
        <View style={styles.Vide}></View>
      </View>
      {FavoriteProductsData?.length > 0 ? (
        <FlatGrid
          itemDimension={130}
          data={FavoriteProductsData}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <PopularProductCard
              key={item._id}
              ProductName={item?.product?.name + " " + item?.product?.size}
              imgUrl={`${Config.API_URL.replace("/api", "")}/files/${item?.product?.image}`}
              onPress={() => 
                navigation.navigate("Product/index", {
                  data: {
                    ...item,
                    isFavorite: true,
                  },
                  storeId: storeId,
                })
              }
            />
          )}
          style={styles.gridView}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Montserrat-Regular",
            }}
          >
            No Product found
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  Vide: {
    width: 40,
    height: 40,
  },
  titleContainer: {
    alignItems: "center",
  },
  titleScreen: {
    fontSize: 20,
    fontFamily: "Montserrat-Regular",
  },
  subtitleScreen: {
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
    color: "#8F8F8F",
  },
  text: {
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
  },
  container: {
    flexGrow: 1,
    justifyContent: "space-between",
    flexDirection: "column",
  },
  gridView: {
    flex: 1,
    marginInline: 10
  },
});

export default MyWishListScreen;
