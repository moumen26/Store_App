import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";
import StoreCard from "../../components/StoreCard";
import useAuthContext from "../hooks/useAuthContext";
import axios from "axios";
import Config from "../config";
import { useQuery } from "@tanstack/react-query";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import Search from "../loading/Search";
import Brands from "../loading/Brands";
import LoadingStores from "../loading/LoadingStores";
import RequestStoresCard from "../../components/RequestStoresCard";
import BackButton from "../../components/BackButton";
import { useRoute } from "@react-navigation/core";

// Axios instance for base URL configuration
const api = axios.create({
  baseURL: Config.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const RequestStores = () => {
  const navigation = useNavigation();
  const { user } = useAuthContext();
  const route = useRoute();
  const { CategoriesData } = route.params;

  // Get screen dimensions
  const { width, height } = useWindowDimensions();

  // Calculate responsive values
  const isSmallScreen = width < 375;
  const isMediumScreen = width >= 375 && width < 768;
  const isLargeScreen = width >= 768;

  // Responsive spacing calculations
  const horizontalPadding = width * 0.05;
  const verticalSpacing = height * 0.025;
  const searchBarHeight = isSmallScreen ? 45 : isLargeScreen ? 55 : 50;
  const searchBarFontSize = isSmallScreen ? 11 : isLargeScreen ? 14 : 12;

  //--------------------------------------------APIs--------------------------------------------
  // Function to fetch public publicities data
  const fetchAllNonActiveStoresData = async () => {
    try {
      const response = await api.get(`/MyStores/nonActive/${user?.info?.id}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      // Check if the response is valid
      if (response.status !== 200) {
        const errorData = await response.data;
        if (errorData.error.statusCode == 404) {
          return []; // Return an empty array for 404
        } else {
          throw new Error("Error receiving stores data");
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
    data: AllNonActiveStoresData,
    error: AllNonActiveStoresDataError,
    isLoading: AllNonActiveStoresDataLoading,
    refetch: AllNonActiveStoresDataRefetch,
  } = useQuery({
    queryKey: ["AllNonActiveStoresData", user?.token], // Ensure token is part of the query key
    queryFn: fetchAllNonActiveStoresData, // Pass token to the fetch function
    enabled: !!user?.token, // Only run the query if user is authenticated
    refetchInterval: 10000, // Refetch every 10 seconds
    refetchOnWindowFocus: true, // Optional: refetching on window focus for React Native
  });

  //--------------------------------------------Rendering--------------------------------------------
  if (AllNonActiveStoresDataLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View
          style={[
            styles.containerLoading,
            { marginHorizontal: horizontalPadding },
          ]}
        >
          <View style={styles.containerLoadingtextScreen}>
            <ShimmerPlaceholder
              style={[styles.textScreen, { width: width * 0.6 }]}
            />
          </View>
          <Search />
          <View style={styles.CategoryStores}>
            <Brands />
            <LoadingStores />
          </View>
        </View>
      </SafeAreaView>
    );
  }
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
            { fontSize: isSmallScreen ? 18 : isLargeScreen ? 24 : 20 },
          ]}
        >
          Demandes de Magasins
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
      <View
        style={[
          styles.searchBar,
          {
            height: searchBarHeight,
            borderRadius: isSmallScreen ? 25 : 30,
            paddingLeft: isSmallScreen ? 12 : 15,
            marginHorizontal: horizontalPadding,
            marginBottom: verticalSpacing * 0.5,
          },
        ]}
      >
        <MagnifyingGlassIcon
          size={isSmallScreen ? 18 : isLargeScreen ? 22 : 20}
          color="#19213D"
        />
        <TextInput
          style={[styles.searchBarItem, { fontSize: searchBarFontSize }]}
          placeholder="Recherchez votre magasin.."
          placeholderTextColor="#888888"
          // value={searchQuery}
          // onChangeText={setSearchQuery}
        />
      </View>
      <View style={[styles.container, { marginHorizontal: horizontalPadding }]}>
        <RequestStoresCard
          StoresData={AllNonActiveStoresData}
          CategoriesData={CategoriesData}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? 10 : 3,
    paddingBottom: 12,
    height: "100%",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  container: {
    flex: 1,
    paddingBottom: 30,
  },
  titleCategory: {
    fontSize: 18,
    fontFamily: "Montserrat-Regular",
  },
  titleScreen: {
    fontFamily: "Montserrat-Regular",
    textAlign: "center",
  },
  searchBar: {
    borderColor: "#19213D",
    borderWidth: 1,
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
  },
  searchBarItem: {
    color: "black",
    fontFamily: "Montserrat-Regular",
    flex: 1,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
    color: "#FF033E",
    fontWeight: "bold",
  },
  containerLoadingtextScreen: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  textScreen: {
    height: 20,
    borderRadius: 4,
  },
  containerLoading: {
    flexDirection: "column",
    gap: 16,
  },
  CategoryStores: {
    flexDirection: "column",
    gap: 16,
    marginTop: 8,
  },
  vide: {
    // Dimensions set dynamically
  },
});

export default RequestStores;
