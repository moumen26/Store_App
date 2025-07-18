import {
  View,
  StyleSheet,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
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
  const [filteredArchiveOrdersData, setFilteredArchiveOrdersData] = useState(
    []
  );

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
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
    refetchOnWindowFocus: true, // Optional: refetching on window focus for React Native
  });

  // Refetch data when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (user?.token) {
        ArchiveOrdersDataRefetch();
      }
      return () => {};
    }, [user?.token])
  );

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
          {
            marginHorizontal: horizontalPadding,
            marginBottom: isSmallScreen ? smallSpacing : verticalSpacing * 0.7,
          },
        ]}
      >
        <BackButton />
        <Text
          style={[
            styles.titleScreen,
            {
              fontSize: isSmallScreen ? 18 : isLargeScreen ? 24 : 20,
            },
          ]}
        >
          Mes commandes archivées
        </Text>
        <View
          style={[
            styles.vide,
            {
              width: isSmallScreen ? 32 : isLargeScreen ? 48 : 40,
              height: isSmallScreen ? 32 : isLargeScreen ? 48 : 40,
            },
          ]}
        ></View>
      </View>

      <View
        style={[
          styles.searchBar,
          {
            marginHorizontal: horizontalPadding,
            marginBottom: verticalSpacing,
            height: Math.max(45, height * 0.06),
          },
        ]}
      >
        <View style={styles.searchInputContainer}>
          <MagnifyingGlassIcon size={isSmallScreen ? 16 : 20} color="#19213D" />
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
          styles.ordersContainer,
          {
            paddingHorizontal: horizontalPadding,
          },
        ]}
      >
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
            contentContainerStyle={[
              styles.containerScroll,
              {
                gap: height * 0.02,
                paddingBottom:
                  Platform.OS === "ios" ? height * 0.08 : height * 0.05,
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
  ordersContainer: {
    flex: 1,
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
  titleScreen: {
    fontFamily: "Montserrat-Regular",
    textAlign: "center",
  },
  searchBar: {
    borderColor: "#19213D",
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
  containerScroll: {
    flexDirection: "column",
  },
  vide: {
    // Dimensions set dynamically
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
});

export default ArchiveOrder;
