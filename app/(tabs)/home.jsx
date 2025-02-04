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
import SpecialForYou from "../loading/SpecialForYou";
import Search from "../loading/Search";
import TopHomeScreen from "../loading/TopHomeScreen";
import LoadingStores from "../loading/LoadingStores";
import Brands from "../loading/Brands";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import { MapPinIcon } from "react-native-heroicons/solid";
import { useNavigation } from "expo-router";

// Axios instance for base URL configuration
const api = axios.create({
  baseURL: Config.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const home = () => {
  const { user } = useAuthContext();
  const navigation = useNavigation();

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
    refetchInterval: 1000 * 60 * 1, // Refetch every 1 minutes
    retry: 2,
    retryDelay: 1000,
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
    refetchInterval: 1000 * 60 * 1, // Refetch every 1 minutes
    retry: 2,
    retryDelay: 1000,
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
    refetchInterval: 1000 * 60 * 1, // Refetch every 1 minutes
    retry: 2,
    retryDelay: 1000,
  });
  // Function to fetch public publicities data
  const fetchNotificationData = async () => {
    try {
      const response = await api.get(`/Notification/client/nonRead/${user?.info?.id}`, {
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
          throw new Error("Error receiving notification data");
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
    data: NotificationData,
    error: NotificationDataError,
    isLoading: NotificationDataLoading,
    refetch: NotificationDataRefetch,
  } = useQuery({
    queryKey: ["NotificationData", user?.token], // Ensure token is part of the query key
    queryFn: fetchNotificationData, // Pass token to the fetch function
    enabled: !!user?.token, // Only run the query if user is authenticated
    refetchOnWindowFocus: true, // Optional: refetching on window focus for React Native
    refetchInterval: 1000 * 60 * 1, // Refetch every 1 minutes
    retry: 2,
    retryDelay: 1000,
  });
  //--------------------------------------------RENDERING--------------------------------------------
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
    <SafeAreaView className="bg-white pt-3 pb-10 h-full">
      {PublicPublicitiesDataLoading ? (
        <View className="mx-5 mb-[20]">
          <TopHomeScreen />
        </View>
      ) : PublicPublicitiesData && PublicPublicitiesData?.length > 0 ? (
        <View className="flex-row items-center mx-5 space-x-3">
          <View style={styles.topClass}>
            <Text style={styles.text} className="text-gray-400">
              Location
            </Text>
            <View style={styles.iconText} className="flex-row">
              <MapPinIcon size={18} color="#26667E" />
              <Text style={styles.text}>Blida, Algeria</Text>
            </View>
          </View>
          {!NotificationDataError && 
            <TouchableOpacity
              style={styles.notification}
              onPress={() => navigation.navigate("Notifications/index",{
                NotificationData: NotificationData,
                NotificationDataRefetch: NotificationDataRefetch,
                NotificationDataLoading: NotificationDataLoading,
                user: user
              })}
            >
              <BellIcon size={20} color="#26667E" />
            </TouchableOpacity>
          }
        </View>
      ) : (
        <></>
      )}

      {PublicPublicitiesDataLoading ? (
        <View className="mx-5 mb-[20]">
          <Search />
        </View>
      ) : PublicPublicitiesData && PublicPublicitiesData?.length > 0 ? (
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
      ) : (
        <></>
      )}

      {PublicPublicitiesDataLoading ? (
        <View className="mx-5 mb-[20]">
          <SpecialForYou />
        </View>
      ) : PublicPublicitiesData && PublicPublicitiesData?.length > 0 ? (
        <View className="mx-5 mb-[20]">
          <Text style={styles.titleCategory}>#SpecialForYou</Text>
          <SliderHome PublicPublicitiesData={PublicPublicitiesData} />
        </View>
      ) : (
        <></>
      )}

      {CategoriesDataLoading || StoresDataLoading ? (
        <View className="mx-5 mb-[20]">
          <ShimmerPlaceholder style={styles.textLoading} />
          <Brands />
          <View style={styles.loadingStores}>
            <LoadingStores />
          </View>
        </View>
      ) : (CategoriesData && CategoriesData?.length > 0) ||
        (StoresData && StoresData?.length > 0) ? (
        <View style={styles.stores} className="mx-5">
          <Text style={styles.titleCategory}>My Stores</Text>
          <Store StoresData={StoresData} CategoriesData={CategoriesData} />
        </View>
      ) : (
        <></>
      )}
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
    flexDirection: "column",
    gap: 4,
  },
  iconText: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  text: {
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
  },
  notification: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  loadingText: {
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
    color: "#FF033E",
    fontWeight: "bold",
  },
  textLoading: {
    width: 100,
    borderRadius: 5,
    marginBottom: 15,
  },
  loadingStores: {
    marginTop: 16,
  },
});

export default home;
