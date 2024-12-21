import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  Dimensions,
} from "react-native";
import React from "react";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import StoreCard from "../../components/StoreCard";
import useAuthContext from "../hooks/useAuthContext";
import axios from "axios";
import Config from "../config";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator } from "react-native";
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

  //--------------------------------------------APIs--------------------------------------------
  // Function to fetch public publicities data
  const fetchAllStoresData = async () => {
    try {
      const response = await api.get(`/Store/all/active`, {
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
    refetchOnWindowFocus: true, // Optional: refetching on window focus for React Native
  });
  
//--------------------------------------------Rendering--------------------------------------------
  if (AllStoresDataLoading) {
    return (
      <SafeAreaView className="bg-white pt-5 pb-12 relative h-full">
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color="#FF033E" />
          <Text style={styles.loadingText}>
            Please wait till the request is being processed...
          </Text>
        </View>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView className="bg-white pt-5 pb-12 relative h-full">
      <Text className="text-center mb-[20]" style={styles.titleScreen}>
        My Stores
      </Text>
      <View
        style={styles.searchBar}
        className="flex-row mx-5 items-center space-x-2 mb-[20]"
      >
        <MagnifyingGlassIcon size={20} color="#26667E" />
        <TextInput
          style={styles.searchBarItem}
          placeholder="Search your store.."
          placeholderTextColor="#888888"
          // value={searchQuery}
          // onChangeText={setSearchQuery}
        />
      </View>
      <View style={styles.container}>
        {AllStoresData?.length > 0 ? 
          <ScrollView className="mx-5" showsVerticalScrollIndicator={false}>
            {AllStoresData?.map((item) => (
              <StoreCard
                key={item._id}
                title={item?.storeName}
                sousTitle={`${item?.wilaya}, ${item?.commune}`}
                onPress={() =>
                  alert("Ask for access to the store")
                }
              />
            ))}
          </ScrollView>
          :
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
              No stores found
            </Text>
          </View>
        }
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: hp(100),
    paddingBottom: 250,
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
});

export default stores;
