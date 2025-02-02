import React from "react";
import { View, Text, FlatList, StyleSheet, TextInput } from "react-native";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { SafeAreaView } from "react-native-safe-area-context";
import SavedStoreItem from "../../components/SavedStoreItem";
import { useNavigation } from "expo-router";
import useAuthContext from "../hooks/useAuthContext";
import axios from "axios";
import Config from "../config";
import { useQuery } from "@tanstack/react-query";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import Search from "../loading/Search";
import StoreCart from "../loading/StoreCart";
import BackButton from "../../components/BackButton";

// Axios instance for base URL configuration
const api = axios.create({
  baseURL: Config.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const Saved = () => {
  const navigation = useNavigation();
  const { user } = useAuthContext();

  //--------------------------------------------APIs--------------------------------------------
  // Function to fetch favorite data
  const fetchFavoriteData = async () => {
    try {
      const response = await api.get(`/Favorite/${user?.info?.id}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      // Check if the response is valid
      if (response.status !== 200) {
        const errorData = await response.data;
        if (errorData.error.statusCode == 404) {
          return []; // Return an empty array for 404 errors
        } else {
          throw new Error("Error receiving favorite data");
        }
      }

      // Return the data from the response
      return await response.data;
    } catch (error) {
      // Handle if the request fails with status code 401 or 404
      if (error?.response?.status === 401 || error?.response?.status === 404) {
        return []; // Return an empty array for 401 and 404 errors
      }
      throw new Error(error?.message || "Network error");
    }
  };
  const {
    data: FavoriteData,
    error: FavoriteDataError,
    isLoading: FavoriteDataLoading,
    refetch: FavoriteDataRefetch,
  } = useQuery({
    queryKey: ["FavoriteData", user?.token], // Ensure token is part of the query key
    queryFn: fetchFavoriteData, // Pass token to the fetch function
    enabled: !!user?.token, // Only run the query if user is authenticated
    refetchInterval: 10000, // Refetch every 1 minutes
    refetchOnWindowFocus: true, // Optional: refetching on window focus for React Native
  });

  //--------------------------------------------Rendering--------------------------------------------
  if (FavoriteDataLoading) {
    return (
      <SafeAreaView className="bg-white pt-3 pb-12 relative h-full">
        <View className="mx-5" style={styles.containerLoading}>
          <View style={styles.containerLoadingtextScreen}>
            <ShimmerPlaceholder style={styles.textScreen} />
          </View>
          <Search />
          <StoreCart />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-white pt-3 pb-12 relative h-full">
      <View className="mx-5 mb-[20] flex-row items-center justify-between">
        <View style={styles.Vide}></View>
        <Text className="text-center" style={styles.titleScreen}>
          Saved Stores
        </Text>
        <View style={styles.Vide}></View>
      </View>

      <View style={styles.searchBar}>
        <MagnifyingGlassIcon size={20} color="#26667E" />
        <TextInput
          style={styles.searchBarItem}
          placeholder="Search your store.."
          placeholderTextColor="#888888"
        />
      </View>
      <View style={styles.container}>
        {FavoriteData?.length > 0 ? (
          <FlatList
            data={FavoriteData}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <SavedStoreItem
                key={item._id}
                StoreName={item?.store?.storeName}
                onPress={() =>
                  navigation.navigate("MyWishList/index", {
                    storeId: item?.store?._id,
                    favoriteId: item?._id,
                    storeName: item?.store?.storeName,
                  })
                }
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.containerScroll}
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
              No Stores found
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  Vide: {
    width: 40,
    height: 40,
  },
  containerLoadingtextScreen: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  containerLoading: {
    flexDirection: "column",
    gap: 16,
  },
  safeArea: {
    backgroundColor: "white",
    paddingTop: 3,
    paddingBottom: 12,
    height: "100%",
  },
  titleScreen: {
    fontSize: 20,
    fontFamily: "Montserrat-Regular",
  },
  searchBar: {
    height: 50,
    borderColor: "#26667E",
    borderWidth: 1,
    alignItems: "center",
    paddingLeft: 15,
    borderRadius: 30,
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  searchBarItem: {
    color: "black",
    fontSize: 12,
    fontFamily: "Montserrat-Regular",
    width: 220,
  },
  container: {
    flex: 1,
    paddingBottom: 30,
    paddingLeft: 20,
    paddingRight: 20,
  },
  // listContainer: {
  //   paddingBottom: 50,
  //   paddingLeft: 20,
  //   paddingRight: 20,
  // },
});

export default Saved;
