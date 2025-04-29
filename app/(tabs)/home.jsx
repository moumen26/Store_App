import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  useWindowDimensions,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MagnifyingGlassIcon, BellIcon } from "react-native-heroicons/outline";
import { MapPinIcon } from "react-native-heroicons/solid";
import { useFocusEffect } from "@react-navigation/native";
import Store from "../../components/Store";
import SliderHome from "../../components/SliderHome";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStores, setFilteredStores] = useState([]);

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
    queryKey: ["PublicPublicitiesData", user?.token],
    queryFn: fetchPublicPublicitiesData,
    enabled: !!user?.token,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60 * 1, // Refetch every 1 minute
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
    queryKey: ["StoresData", user?.token],
    queryFn: fetchStoresData,
    enabled: !!user?.token,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60 * 1, // Refetch every 1 minute
    retry: 2,
    retryDelay: 1000,
  });

  // Function to fetch categories data
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
    queryKey: ["CategoriesData", user?.token],
    queryFn: fetchCategoriesData,
    enabled: !!user?.token,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60 * 1, // Refetch every 1 minute
    retry: 2,
    retryDelay: 1000,
  });

  // Function to fetch notification data
  const fetchNotificationData = async () => {
    try {
      const response = await api.get(
        `/Notification/client/nonRead/${user?.info?.id}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

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
    queryKey: ["NotificationData", user?.token],
    queryFn: fetchNotificationData,
    enabled: !!user?.token,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60 * 1, // Refetch every 1 minute
    retry: 2,
    retryDelay: 1000,
  });

  // Refetch data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (user?.token) {
        PublicPublicitiesDataRefetch();
        StoresDataRefetch();
        CategoriesDataRefetch();
        NotificationDataRefetch();
      }
      return () => {};
    }, [user?.token])
  );

  // Update filteredStores whenever StoresData or searchQuery changes
  useEffect(() => {
    if (StoresData) {
      if (searchQuery.trim() === "") {
        // If search query is empty, show all stores
        setFilteredStores(StoresData);
      } else {
        // Filter stores based on search query
        const query = searchQuery.toLowerCase().trim();
        const filtered = StoresData.filter(
          (store) =>
            store.store.storeName?.toLowerCase().includes(query) ||
            (store.store.wilaya &&
              store.store.wilaya?.toLowerCase().includes(query))
        );
        setFilteredStores(filtered);
      }
    } else {
      setFilteredStores([]);
    }
  }, [StoresData, searchQuery]);

  // Handle search clear function
  const handleClearSearch = () => {
    setSearchQuery("");
  };

  //--------------------------------------------RENDERING--------------------------------------------
  if (PublicPublicitiesDataError || StoresDataError || CategoriesDataError) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.errorText}>
          Oops! Something went wrong. Please try again later.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {PublicPublicitiesDataLoading ? (
        <View
          style={{
            marginHorizontal: horizontalPadding,
            marginBottom: verticalSpacing,
          }}
        >
          <TopHomeScreen />
        </View>
      ) : PublicPublicitiesData && PublicPublicitiesData?.length > 0 ? (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: horizontalPadding,
            marginBottom: smallSpacing,
          }}
        >
          <View style={[styles.topClass, { flex: 1 }]}>
            <Text
              style={[
                styles.text,
                { color: "#9CA3AF", fontSize: isSmallScreen ? 12 : 14 },
              ]}
            >
              Emplacement
            </Text>
            <View style={styles.iconText}>
              <MapPinIcon size={isSmallScreen ? 16 : 18} color="#26667E" />
              <Text
                style={[styles.text, { fontSize: isSmallScreen ? 12 : 14 }]}
              >
                Blida, Algeria
              </Text>
            </View>
          </View>
          {!NotificationDataError && (
            <TouchableOpacity
              style={[
                styles.notification,
                {
                  width: isSmallScreen ? 36 : 40,
                  height: isSmallScreen ? 36 : 40,
                  borderRadius: isSmallScreen ? 18 : 20,
                },
              ]}
              onPress={() =>
                navigation.navigate("Notifications/index", {
                  NotificationData: NotificationData,
                  NotificationDataRefetch: NotificationDataRefetch,
                  NotificationDataLoading: NotificationDataLoading,
                  user: user,
                })
              }
            >
              <View style={styles.bellContainer}>
                <BellIcon size={isSmallScreen ? 18 : 20} color="#26667E" />
                {NotificationData?.length > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {NotificationData.length > 9
                        ? "9+"
                        : NotificationData.length}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <></>
      )}

      {PublicPublicitiesDataLoading ? (
        <View
          style={{
            marginHorizontal: horizontalPadding,
            marginBottom: verticalSpacing,
          }}
        >
          <Search />
        </View>
      ) : PublicPublicitiesData && PublicPublicitiesData?.length > 0 ? (
        <View
          style={[
            styles.searchBar,
            {
              marginHorizontal: horizontalPadding,
              marginBottom: smallSpacing,
              marginTop: smallSpacing,
              height: Math.max(45, height * 0.06),
            },
          ]}
        >
          <View style={styles.searchInput}>
            <MagnifyingGlassIcon
              size={isSmallScreen ? 18 : 20}
              color="#26667E"
            />
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
      ) : (
        <></>
      )}

      {PublicPublicitiesDataLoading ? (
        <View
          style={{
            marginHorizontal: horizontalPadding,
            marginBottom: verticalSpacing,
          }}
        >
          <SpecialForYou />
        </View>
      ) : PublicPublicitiesData && PublicPublicitiesData?.length > 0 ? (
        <View
          style={{
            marginHorizontal: horizontalPadding,
            marginBottom: verticalSpacing,
          }}
        >
          <Text
            style={[
              styles.titleCategory,
              {
                fontSize: isSmallScreen ? 16 : isLargeScreen ? 20 : 18,
                marginBottom: smallSpacing,
              },
            ]}
          >
            #SpécialPourVous
          </Text>
          <SliderHome PublicPublicitiesData={PublicPublicitiesData} />
        </View>
      ) : (
        <></>
      )}

      {CategoriesDataLoading || StoresDataLoading ? (
        <View
          style={{
            marginHorizontal: horizontalPadding,
            marginBottom: verticalSpacing,
          }}
        >
          <ShimmerPlaceholder
            style={[styles.textLoading, { width: width * 0.3 }]}
          />
          <Brands />
          <View style={{ marginTop: height * 0.02 }}>
            <LoadingStores />
          </View>
        </View>
      ) : (CategoriesData && CategoriesData?.length > 0) ||
        (filteredStores && filteredStores?.length > 0) ? (
        <View style={[styles.stores, { marginHorizontal: horizontalPadding }]}>
          <Text
            style={[
              styles.titleCategory,
              {
                fontSize: isSmallScreen ? 16 : isLargeScreen ? 20 : 18,
                marginBottom: smallSpacing,
              },
            ]}
          >
            My Stores
          </Text>
          <Store StoresData={filteredStores} CategoriesData={CategoriesData} />
        </View>
      ) : (
        <></>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? 10 : 3,
    paddingBottom: 10,
    height: "100%",
  },
  stores: {
    flex: 1,
  },
  errorText: {
    textAlign: "center",
    marginTop: 20,
    color: "#FF033E",
    fontFamily: "Montserrat-Regular",
    fontSize: 14,
  },
  searchBar: {
    borderColor: "#26667E",
    borderWidth: 1,
    alignItems: "center",
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  searchInput: {
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
  topClass: {
    flexDirection: "column",
    gap: 4,
  },
  iconText: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  text: {
    fontFamily: "Montserrat-Regular",
  },
  notification: {
    borderColor: "#3E9CB9",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  bellContainer: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -12,
    right: -12,
    backgroundColor: "red",
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  titleCategory: {
    fontFamily: "Montserrat-Regular",
  },
  textLoading: {
    height: 20,
    borderRadius: 5,
    marginBottom: 15,
  },
});

export default home;
