import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Platform,
  useWindowDimensions,
} from "react-native";
import { useEffect, useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);

  // Get screen dimensions
  const { width, height } = useWindowDimensions();

  // Calculate responsive values
  const isSmallDevice = width < 375;
  const isMediumDevice = width >= 375 && width < 768;
  const isLargeDevice = width >= 768;

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

  // Refetch data when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (user?.token) {
        OrdersDataRefetch();
      }
      return () => {};
    }, [user?.token])
  );

  // Update filteredOrders whenever OrdersData or searchQuery changes
  useEffect(() => {
    if (OrdersData) {
      if (searchQuery.trim() === "") {
        // If search query is empty, show all stores
        setFilteredOrders(OrdersData);
      } else {
        // Filter stores based on search query
        const query = searchQuery.toLowerCase().trim();
        const filtered = OrdersData?.filter(
          (order) =>
            (order.store.storeName &&
              order.store.storeName?.toLowerCase().includes(query)) ||
            (order.type && order.type?.toLowerCase().includes(query)) ||
            (order._id && order._id?.toLowerCase().includes(query)) ||
            (order.total &&
              order.total.toString().toLowerCase().includes(query))
        );
        setFilteredOrders(filtered);
      }
    } else {
      setFilteredOrders([]);
    }
  }, [OrdersData, searchQuery]);

  // Handle search clear function
  const handleClearSearch = () => {
    setSearchQuery("");
  };

  //--------------------------------------------Rendering--------------------------------------------
  if (OrdersDataLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, { marginHorizontal: width * 0.05 }]}>
          <View style={styles.containerLoadingtextScreen}>
            <ShimmerPlaceholder
              style={[styles.textScreen, { width: width * 0.6 }]}
            />
          </View>
          <Search />
          <Cart />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View
        style={[
          styles.headerContainer,
          { marginHorizontal: width * 0.05, marginBottom: height * 0.025 },
        ]}
      >
        <View style={styles.vide}></View>
        <Text
          style={[
            styles.titleScreen,
            isSmallDevice && { fontSize: 18 },
            isLargeDevice && { fontSize: 24 },
          ]}
        >
          Mes commandes{" "}
        </Text>
        <ArchiveButton />
      </View>

      <View
        style={[
          styles.searchBar,
          {
            marginHorizontal: width * 0.05,
            marginBottom: height * 0.02,
            height: Math.max(45, height * 0.06),
          },
        ]}
      >
        <View style={styles.searchInputContainer}>
          <MagnifyingGlassIcon size={isSmallDevice ? 16 : 20} color="#19213D" />
          <TextInput
            style={[
              styles.searchBarItem,
              {
                width: isSmallDevice
                  ? width * 0.6
                  : isLargeDevice
                  ? width * 0.7
                  : width * 0.65,
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
          styles.listContainer,
          {
            paddingHorizontal: width * 0.05,
          },
        ]}
      >
        {filteredOrders?.length > 0 ? (
          <FlatList
            data={filteredOrders.sort(
              (a, b) => new Date(b.date) - new Date(a.date)
            )}
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
            contentContainerStyle={[
              styles.containerScroll,
              {
                gap: height * 0.02,
                paddingBottom: height * 0.05,
              },
            ]}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucune commande trouvée</Text>
          </View>
        )}
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
  listContainer: {
    flex: 1,
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
  titleScreen: {
    fontSize: 20,
    fontFamily: "Montserrat-Regular",
    textAlign: "center",
  },
  searchBar: {
    borderColor: "#E3EFFF",
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
    fontSize: 12,
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
  containerScroll: {
    flexDirection: "column",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#888888",
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
  },
  vide: {
    width: 40,
    height: 40,
  },
  textScreen: {
    height: 20,
    borderRadius: 4,
  },
});

export default cart;
