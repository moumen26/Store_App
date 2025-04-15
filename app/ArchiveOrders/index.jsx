import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredArchiveOrdersData, setFilteredArchiveOrdersData] = useState([]);
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

  // Update filteredArchiveOrdersData whenever ArchiveOrdersData or searchQuery changes
  useEffect(() => {
    if (ArchiveOrdersData) {
      if (searchQuery.trim() === "") {
        // If search query is empty, show all stores
        setFilteredArchiveOrdersData(ArchiveOrdersData);
      } else {
        // Filter stores based on search query
        const query = searchQuery.toLowerCase().trim();
        const filtered = ArchiveOrdersData?.filter(
          (order) =>
            (order.store.storeName &&
              order.store.storeName?.toLowerCase().includes(query)) ||
            (order.type && order.type?.toLowerCase().includes(query)) ||
            (order._id && order._id?.toLowerCase().includes(query)) ||
            (order.total &&
              order.total.toString().toLowerCase().includes(query))
        );
        setFilteredArchiveOrdersData(filtered);
      }
    } else {
      setFilteredArchiveOrdersData([]);
    }
  }, [ArchiveOrdersData, searchQuery]);

  // Handle search clear function
  const handleClearSearch = () => {
    setSearchQuery("");
  };
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
      <View style={styles.searchBar} className="mx-5 mb-6">
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
        {filteredArchiveOrdersData?.length > 0 ? (
          <FlatList
            data={filteredArchiveOrdersData?.reverse()}
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
