import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from "react-native";
import React, { useCallback } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import PopularProductCard from "../../components/PopularProductCard";
import BackButton from "../../components/BackButton";
import useAuthContext from "../hooks/useAuthContext";
import axios from "axios";
import Config from "../config";
import { useQuery } from "@tanstack/react-query";
import { FlatGrid } from "react-native-super-grid";

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

  // Grid dimensions based on screen size
  const gridItemDimension = isSmallScreen ? 110 : isMediumScreen ? 130 : 180;

  // Grid spacing based on screen size
  const gridSpacing = isSmallScreen ? 8 : isMediumScreen ? 12 : 16;

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
      return (await response.data) || [];
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
    refetchInterval: 10000, // Refetch every 10 seconds
    refetchOnWindowFocus: true, // Optional: refetching on window focus for React Native
  });

  // Refetch data when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (user?.token) {
        FavoriteProductsDataRefetch();
      }
      return () => {};
    }, [user?.token])
  );

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
        <View style={styles.titleContainer}>
          <Text
            style={[
              styles.titleScreen,
              {
                fontSize: isSmallScreen ? 18 : isLargeScreen ? 24 : 20,
              },
            ]}
          >
            Ma Liste de Souhaits
          </Text>
          <Text
            style={[
              styles.subtitleScreen,
              {
                fontSize: isSmallScreen ? 12 : isLargeScreen ? 16 : 14,
              },
            ]}
          >
            {storeName}
          </Text>
        </View>
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

      {FavoriteProductsData?.length > 0 ? (
        <FlatGrid
          itemDimension={gridItemDimension}
          spacing={gridSpacing}
          data={FavoriteProductsData}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <PopularProductCard
              key={item._id}
              ProductName={item?.product?.name + " " + item?.product?.size}
              imgUrl={`${Config.FILES_URL}/${
                item?.product?.image
              }`}
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
          style={[
            styles.gridView,
            {
              marginHorizontal: horizontalPadding / 2,
            },
          ]}
          contentContainerStyle={{
            paddingBottom: Platform.OS === "ios" ? 20 : 10,
          }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aucun produit trouvé</Text>
        </View>
      )}
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
  vide: {
    // Dimensions set dynamically
  },
  titleContainer: {
    alignItems: "center",
  },
  titleScreen: {
    fontFamily: "Montserrat-Regular",
  },
  subtitleScreen: {
    fontFamily: "Montserrat-Regular",
    color: "#8F8F8F",
  },
  gridView: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
  },
});

export default MyWishListScreen;
