import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  TextInput,
  FlatList,
} from "react-native";
import React from "react";
import BackButton from "../../components/BackButton";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import useAuthContext from "../hooks/useAuthContext";
import axios from "axios";
import Config from "../config";
import { useQuery } from "@tanstack/react-query";
import Cart from "../loading/Cart";
import Search from "../loading/Search";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import CartOrderItem from "../../components/CartOrderItem";

// Axios instance for base URL configuration
const api = axios.create({
  baseURL: Config.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const ArchiveOrder = () => {
  const { user } = useAuthContext();

  //--------------------------------------------APIs--------------------------------------------
  // Function to fetch public publicities data
  const fetchArchiveOrdersData = async () => {
    try {
      const response = await api.get(
        `/Receipt/client/archive/${user?.info?.id}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

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
    data: ArchiveOrdersData,
    error: ArchiveOrdersDataError,
    isLoading: ArchiveOrdersDataLoading,
    refetch: ArchiveOrdersDataRefetch,
  } = useQuery({
    queryKey: ["ArchiveOrdersData", user?.token], // Ensure token is part of the query key
    queryFn: fetchArchiveOrdersData, // Pass token to the fetch function
    enabled: !!user?.token, // Only run the query if user is authenticated
    refetchInterval: 1000 * 60 * 5, // Refetch every 10 seconds
    refetchOnWindowFocus: true, // Optional: refetching on window focus for React Native
  });
  //--------------------------------------------Rendering--------------------------------------------
  if (ArchiveOrdersDataLoading) {
    return (
      <SafeAreaView className="bg-white pt-3 pb-12 relative h-full">
        <View className="mx-5" style={styles.containerLoading}>
          <View style={styles.containerLoadingtextScreen}>
            <ShimmerPlaceholder style={styles.textScreen} />
          </View>
          <Search />
          <Cart />
        </View>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView className="bg-white pt-3 pb-12 relative h-full">
      <View className="mx-5 mb-[20] flex-row items-center justify-between">
        <BackButton />
        <Text className="text-center" style={styles.titleScreen}>
          Mes commandes archivées
        </Text>
        <View style={styles.Vide}></View>
      </View>
      <View
        style={styles.searchBar}
        className="flex-row mx-5 items-center space-x-2 mb-[20] rounded-3xl"
      >
        <MagnifyingGlassIcon size={20} color="#26667E" />
        <TextInput
          style={styles.searchBarItem}
          placeholder="Search your order.."
          placeholderTextColor="#888888"
          // value={searchQuery}
          // onChangeText={setSearchQuery}
        />
      </View>
      <View style={styles.container}>
        {ArchiveOrdersData?.length > 0 ? (
          <FlatList
            data={ArchiveOrdersData?.reverse()}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <CartOrderItem
                key={item._id}
                OrderStoreName={item?.store?.storeName}
                OrderID={item._id}
                OrderType={item.type}
                OrderDeliveryAddress={item?.deliveredLocation?.address}
                OrderDate={item?.date}
                OrderStatus={item.status}
                OrderSubTotal={item.total}
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
                color: "#888888",
                fontSize: 14,
                fontFamily: "Montserrat-Regular",
              }}
            >
              Aucune commande trouvée
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerLoadingtextScreen: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  containerLoading: {
    flexDirection: "column",
    gap: 16,
  },
  container: {
    flex: 1,
    // paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
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
  containerScroll: {
    flexDirection: "column",
    gap: 16,
    paddingBottom: 38,
  },
  Vide: {
    width: 40,
    height: 40,
  },
});

export default ArchiveOrder;
