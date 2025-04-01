import { View, Text, StyleSheet, TextInput, FlatList } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CartOrderItem from "../../components/CartOrderItem";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import useAuthContext from "../hooks/useAuthContext";
import axios from "axios";
import Config from "../config";
import { useQuery } from "@tanstack/react-query";
import Cart from "../loading/Cart";
import Search from "../loading/Search";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import ArchiveButton from "../../components/ArchiveButton";

// Axios instance for base URL configuration
const api = axios.create({
  baseURL: Config.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
const cart = () => {
  const { user } = useAuthContext();

  //--------------------------------------------APIs--------------------------------------------
  // Function to fetch public publicities data
  const fetchOrdersData = async () => {
    try {
      const response = await api.get(`/Receipt/client/all/${user?.info?.id}`, {
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
          throw new Error("Error receiving orders data");
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
    data: OrdersData,
    error: OrdersDataError,
    isLoading: OrdersDataLoading,
    refetch: OrdersDataRefetch,
  } = useQuery({
    queryKey: ["OrdersData", user?.token], // Ensure token is part of the query key
    queryFn: fetchOrdersData, // Pass token to the fetch function
    enabled: !!user?.token, // Only run the query if user is authenticated
    refetchInterval: 10000, // Refetch every 10 seconds
    refetchOnWindowFocus: true, // Optional: refetching on window focus for React Native
  });

  //--------------------------------------------Rendering--------------------------------------------
  if (OrdersDataLoading) {
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
        <View style={styles.Vide}></View>
        <Text className="text-center" style={styles.titleScreen}>
          Mes commandes{" "}
        </Text>
        <ArchiveButton />
      </View>
      <View
        style={styles.searchBar}
        className="flex-row mx-5 items-center space-x-2 mb-[20] rounded-3xl"
      >
        <MagnifyingGlassIcon size={20} color="#26667E" />
        <TextInput
          style={styles.searchBarItem}
          placeholder="Recherchez votre commande..."
          placeholderTextColor="#888888"
          // value={searchQuery}
          // onChangeText={setSearchQuery}
        />
      </View>
      <View style={styles.container}>
        {OrdersData?.length > 0 ? (
          <FlatList
            data={OrdersData.reverse()}
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
    // paddingBottom: 0,
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

export default cart;
