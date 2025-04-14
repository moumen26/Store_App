import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
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

const stores = () => {
  const navigation = useNavigation();
  const { user } = useAuthContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAllStoresData, setFilteredAllStoresData] = useState([]);
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
      <SafeAreaView className="bg-white pt-3 pb-12 relative h-full">
        <View className="mx-5" style={styles.containerLoading}>
          <View style={styles.containerLoadingtextScreen}>
            <ShimmerPlaceholder style={styles.textScreen} />
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
    <SafeAreaView className="bg-white pt-3 pb-12 relative h-full">
      <View className="mx-5 mb-[20] flex-row items-center justify-between">
        <View style={styles.Vide}></View>
        <Text className="text-center" style={styles.titleScreen}>
          Magasins
        </Text>
        <RequestButton CategoriesData={CategoriesData} />
      </View>
      <View style={styles.searchBar} className="mx-5 mb-2">
        <View className="flex-row items-center gap-x-4">
          <MagnifyingGlassIcon size={20} color="#26667E" />
          <TextInput
            style={styles.searchBarItem}
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
      <View style={styles.container}>
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
  container: {
    flex: 1,
    paddingBottom: 30,
  },
  titleCategory: {
    fontSize: 18,
    fontFamily: "Montserrat-Regular",
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
    justifyContent: "space-between",
    paddingRight: 15,
    gap: 4,
  },
  searchBarItem: {
    color: "black",
    fontSize: 12,
    fontFamily: "Montserrat-Regular",
    width: 220,
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
  containerLoading: {
    flexDirection: "column",
    gap: 16,
  },
  CategoryStores: {
    flexDirection: "column",
    gap: 16,
    marginTop: 8,
  },
  Vide: {
    width: 40,
    height: 40,
  },
});

export default stores;
