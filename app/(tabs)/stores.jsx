import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
} from "react-native";
import { useEffect, useState, useCallback } from "react";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import useAuthContext from "../hooks/useAuthContext";
import axios from "axios";
import Config from "../config";
import { useQuery } from "@tanstack/react-query";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import Search from "../loading/Search";
import Brands from "../loading/Brands";
import LoadingStores from "../loading/LoadingStores";
import NonLinkedStores from "../../components/NonLinkedStores";
import RequestButton from "../../components/RequestButton";

// Axios instance for base URL configuration
const api = axios.create({
  baseURL: Config.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const Stores = () => {
  const navigation = useNavigation();
  const { user } = useAuthContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAllStoresData, setFilteredAllStoresData] = useState([]);

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

  //--------------------------------------------APIs--------------------------------------------
  // Function to fetch public publicities data
  const fetchAllStoresData = async () => {
    try {
      const response = await api.get(`/Store/all/active/${user?.info?.id}`, {
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
    data: AllStoresData,
    error: AllStoresDataError,
    isLoading: AllStoresDataLoading,
    refetch: AllStoresDataRefetch,
  } = useQuery({
    queryKey: ["AllStoresData", user?.token], // Ensure token is part of the query key
    queryFn: fetchAllStoresData, // Pass token to the fetch function
    enabled: !!user?.token, // Only run the query if user is authenticated
    refetchInterval: 10000, // Refetch every 10 seconds
    refetchOnWindowFocus: true, // Optional: refetching on window focus for React Native
  });

  // Function to fetch stores data
  const fetchCategoriesData = async () => {
    try {
      const response = await api.get(`/Category`, {
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
          throw new Error("Error receiving categories data");
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
    data: CategoriesData,
    error: CategoriesDataError,
    isLoading: CategoriesDataLoading,
    refetch: CategoriesDataRefetch,
  } = useQuery({
    queryKey: ["CategoriesData", user?.token], // Ensure token is part of the query key
    queryFn: fetchCategoriesData, // Pass token to the fetch function
    enabled: !!user?.token, // Only run the query if user is authenticated
    refetchInterval: 10000, // Refetch every 10 seconds
    refetchOnWindowFocus: true, // Optional: refetching on window focus for React Native
  });

  // Refetch data when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (user?.token) {
        AllStoresDataRefetch();
        CategoriesDataRefetch();
      }
      return () => {};
    }, [user?.token])
  );

  // Update filteredAllStoresData whenever AllStoresData or searchQuery changes
  useEffect(() => {
    if (AllStoresData) {
      if (searchQuery.trim() === "") {
        // If search query is empty, show all stores
        setFilteredAllStoresData(AllStoresData);
      } else {
        // Filter stores based on search query
        const query = searchQuery.toLowerCase().trim();
        const filtered = AllStoresData?.filter(
          (store) =>
            (store.storeName &&
              store.storeName?.toLowerCase().includes(query)) ||
            (store.wilaya && store.wilaya?.toLowerCase().includes(query))
        );
        setFilteredAllStoresData(filtered);
      }
    } else {
      setFilteredAllStoresData([]);
    }
  }, [AllStoresData, searchQuery]);

  // Handle search clear function
  const handleClearSearch = () => {
    setSearchQuery("");
  };

  //--------------------------------------------Rendering--------------------------------------------
  if (AllStoresDataLoading || CategoriesDataLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View
          style={[styles.container, { marginHorizontal: horizontalPadding }]}
        >
          <View style={styles.containerLoadingtextScreen}>
            <ShimmerPlaceholder
              style={[styles.textScreen, { width: width * 0.6 }]}
            />
          </View>
          <Search />
          <View style={[styles.categoryStores, { gap: smallSpacing * 1.5 }]}>
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
            marginBottom: isSmallScreen ? smallSpacing : verticalSpacing * 0.7,
          },
        ]}
      >
        <View
          style={[
            styles.vide,
            {
              width: isSmallScreen ? 32 : isLargeScreen ? 48 : 40,
              height: isSmallScreen ? 32 : isLargeScreen ? 48 : 40,
            },
          ]}
        ></View>
        <Text
          style={[
            styles.titleScreen,
            {
              fontSize: isSmallScreen ? 18 : isLargeScreen ? 24 : 20,
            },
          ]}
        >
          Magasins
        </Text>
        <RequestButton CategoriesData={CategoriesData} />
      </View>

      <View
        style={[
          styles.searchBar,
          {
            marginHorizontal: horizontalPadding,
            marginBottom: smallSpacing,
            height: Math.max(45, height * 0.06),
          },
        ]}
      >
        <View style={styles.searchInputContainer}>
          <MagnifyingGlassIcon size={isSmallScreen ? 16 : 20} color="#63BBF5" />
          <TextInput
            style={[
              styles.searchBarItem,
              {
                width: isSmallScreen
                  ? width * 0.6
                  : isLargeScreen
                  ? width * 0.7
                  : width * 0.65,
                fontSize: isSmallScreen ? 11 : 12,
              },
            ]}
            placeholder="Rechercher par magasin..."
            placeholderTextColor="#888888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={handleClearSearch}
            style={styles.clearButton}
          >
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <View
        style={[
          styles.storesContainer,
          {
            paddingBottom: height * 0.03,
            paddingHorizontal: isLargeScreen ? horizontalPadding : 0,
          },
        ]}
      >
        <NonLinkedStores
          StoresData={filteredAllStoresData}
          CategoriesData={CategoriesData}
          AllStoresDataRefetch={AllStoresDataRefetch}
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
  container: {
    flexDirection: "column",
    gap: 16,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  searchBar: {
    borderColor: "#63BBF5",
    borderWidth: 1,
    alignItems: "center",
    paddingHorizontal: 15,
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  searchBarItem: {
    color: "black",
    fontFamily: "Montserrat-Regular",
    flex: 1,
  },
  clearButton: {
    padding: 5,
  },
  clearButtonText: {
    color: "#888888",
    fontSize: 14,
  },
  storesContainer: {
    flex: 1,
  },
  titleScreen: {
    fontFamily: "Montserrat-Regular",
    textAlign: "center",
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
  categoryStores: {
    flexDirection: "column",
    marginTop: 8,
  },
  vide: {
    // Dimensions set dynamically
  },
});

export default Stores;
