import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MagnifyingGlassIcon, BellIcon } from "react-native-heroicons/outline";
import Store from "../../components/Store";
import SliderHome from "../../components/SliderHome";
import { TextInput } from "react-native";
import { useAuthContext } from "../hooks/useAuthContext";
import Config from "../config";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const LocationIconVector = require("../../assets/icons/Location.png");
// Axios instance for base URL configuration
const api = axios.create({
  baseURL: Config.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const home = () => {
  const { user } = useAuthContext();

  //--------------------------------------------APIs--------------------------------------------
  // Function to fetch public publicities data
  const fetchPublicPublicitiesData = async () => {
    try {
      const response = await api.get(`/Publicity/fetchAllPublicPublicities`, {
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
          throw new Error("Error receiving public publicities data");
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
    data: PublicPublicitiesData,
    error: PublicPublicitiesDataError,
    isLoading: PublicPublicitiesDataLoading,
    refetch: PublicPublicitiesDataRefetch,
  } = useQuery({
    queryKey: ["PublicPublicitiesData", user?.token], // Ensure token is part of the query key
    queryFn: fetchPublicPublicitiesData, // Pass token to the fetch function
    enabled: !!user?.token, // Only run the query if user is authenticated
    refetchOnWindowFocus: true, // Optional: refetching on window focus for React Native
  });
  // Function to fetch stores data
  const fetchStoresData = async () => {
    try {
      const response = await api.get(`/MyStores/${user?.info?.id}`, {
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
    data: StoresData,
    error: StoresDataError,
    isLoading: StoresDataLoading,
    refetch: StoresDataRefetch,
  } = useQuery({
    queryKey: ["StoresData", user?.token], // Ensure token is part of the query key
    queryFn: fetchStoresData, // Pass token to the fetch function
    enabled: !!user?.token, // Only run the query if user is authenticated
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
    refetchOnWindowFocus: true, // Optional: refetching on window focus for React Native
  });
  //--------------------------------------------RENDERING--------------------------------------------
  if (
    PublicPublicitiesDataLoading ||
    StoresDataLoading ||
    CategoriesDataLoading
  ) {
    return (
      <SafeAreaView className="bg-white h-full">
        <ActivityIndicator size="large" color="#6200EE" />
        <Text style={styles.loadingText}>Loading data...</Text>
      </SafeAreaView>
    );
  }

  if (PublicPublicitiesDataError || StoresDataError || CategoriesDataError) {
    return (
      <SafeAreaView className="bg-white h-full">
        <Text style={styles.errorText}>
          Oops! Something went wrong. Please try again later.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-white pt-5 pb-10 h-full">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="relative h-full"
      >
        <View className="flex-row items-center mx-5 space-x-3">
          <View style={styles.topClass}>
            <Text style={styles.text} className="text-gray-400">
              Location
            </Text>
            <View style={styles.iconText} className="flex-row">
              <Image source={LocationIconVector} />
              <Text style={styles.text}>Blida, Algeria</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notification}>
            <BellIcon size={18} color="#26667E" />
          </TouchableOpacity>
        </View>

        <View
          className="flex-row items-center space-x-2 mx-5 mb-5"
          style={styles.searchClass}
        >
          <View
            style={styles.searchButton}
            className="flex-1 flex-row items-center space-x-2 pl-5 h-12 border-1 rounded-3xl"
          >
            <MagnifyingGlassIcon color="#888888" size={20} />
            <TextInput
              style={styles.searchButto}
              placeholder="Search by Store.."
              placeholderTextColor="#888888"
              // value={searchQuery}
              // onChangeText={setSearchQuery}
            />
            {/* <Text style={styles.search}>Search by Store..</Text> */}
          </View>
        </View>

        <View className="mx-5" style={styles.specialForYou}>
          <Text style={styles.titleCategory}>#SpecialForYou</Text>
          <SliderHome PublicPublicitiesData={PublicPublicitiesData} />
        </View>

        <View style={styles.stores} className="mx-5 mt-[10]">
          <Text style={styles.titleCategory}>Stores</Text>
          <Store StoresData={StoresData} CategoriesData={CategoriesData} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  stores: {
    paddingBottom: 100,
  },
  specialForYou: {
    marginBottom: 10,
  },
  searchClass: {
    marginTop: 10,
    marginBottom: 10,
  },
  searchButton: {
    flex: 1,
    gap: 4,
    paddingLeft: 15,
    height: 50,
    borderWidth: 1,
    borderColor: "#26667E",
    borderRadius: 30,
    alignItems: "center",
  },
  topClass: {
    flex: 1,
    gap: 4,
    flexDirection: "column",
  },
  iconText: {
    gap: 4,
  },
  text: {
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
  },
  notification: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    borderColor: "#3E9CB9",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  search: {
    color: "#888888",
    fontSize: 12,
    fontFamily: "Montserrat-Regular",
  },
  titleCategory: {
    fontSize: 18,
    fontFamily: "Montserrat-Regular",
  },
});

export default home;
