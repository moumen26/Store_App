import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
} from "react-native";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import SavedStoreItem from "../../components/SavedStoreItem";
import { useNavigation } from "expo-router";
import useAuthContext from "../hooks/useAuthContext";
import axios from "axios";
import Config from "../config";
import { useQuery } from "@tanstack/react-query";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import Search from "../loading/Search";
import StoreCart from "../loading/StoreCart";
import BackButton from "../../components/BackButton";

// Axios instance for base URL configuration
const api = axios.create({
  baseURL: Config.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const Saved = () => {
  const navigation = useNavigation();
  const { user } = useAuthContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFavoriteData, setFilteredFavoriteData] = useState([]);
  
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
  // Function to fetch favorite data
  const fetchFavoriteData = async () => {
    try {
      const response = await api.get(`/Favorite/${user?.info?.id}`, {
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
          throw new Error("Error receiving favorite data");
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
    data: FavoriteData,
    error: FavoriteDataError,
    isLoading: FavoriteDataLoading,
    refetch: FavoriteDataRefetch,
  } = useQuery({
    queryKey: ["FavoriteData", user?.token], // Ensure token is part of the query key
    queryFn: fetchFavoriteData, // Pass token to the fetch function
    enabled: !!user?.token, // Only run the query if user is authenticated
    refetchInterval: 10000, // Refetch every 10 seconds
    refetchOnWindowFocus: true, // Optional: refetching on window focus for React Native
  });

  // Refetch data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (user?.token) {
        FavoriteDataRefetch();
      }
      return () => {};
    }, [user?.token])
  );

  // Update filteredFavoriteData whenever FavoriteData or searchQuery changes
  useEffect(() => {
    if (FavoriteData) {
      if (searchQuery.trim() === "") {
        // If search query is empty, show all stores
        setFilteredFavoriteData(FavoriteData);
      } else {
        // Filter stores based on search query
        const query = searchQuery.toLowerCase().trim();
        const filtered = FavoriteData?.filter(
          (store) =>
            (store.store.storeName &&
              store.store.storeName?.toLowerCase().includes(query)) ||
            (store.store.wilaya &&
              store.store.wilaya?.toLowerCase().includes(query))
        );
        setFilteredFavoriteData(filtered);
      }
    } else {
      setFilteredFavoriteData([]);
    }
  }, [FavoriteData, searchQuery]);

  // Handle search clear function
  const handleClearSearch = () => {
    setSearchQuery("");
  };

  //--------------------------------------------Rendering--------------------------------------------
  if (FavoriteDataLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, { marginHorizontal: horizontalPadding }]}>
          <View style={styles.containerLoadingtextScreen}>
            <ShimmerPlaceholder 
              style={[styles.textScreen, { width: width * 0.6 }]} 
            />
          </View>
          <Search />
          <StoreCart />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[
        styles.headerContainer, 
        { 
          marginHorizontal: horizontalPadding, 
          marginBottom: isSmallScreen ? smallSpacing : verticalSpacing 
        }
      ]}>
        <View style={[
          styles.vide, 
          { 
            width: isSmallScreen ? 32 : isLargeScreen ? 48 : 40,
            height: isSmallScreen ? 32 : isLargeScreen ? 48 : 40 
          }
        ]}></View>
        <Text style={[
          styles.titleScreen,
          {
            fontSize: isSmallScreen ? 18 : isLargeScreen ? 24 : 20
          }
        ]}>
          Magasins Enregistrés
        </Text>
        <View style={[
          styles.vide, 
          { 
            width: isSmallScreen ? 32 : isLargeScreen ? 48 : 40,
            height: isSmallScreen ? 32 : isLargeScreen ? 48 : 40 
          }
        ]}></View>
      </View>

      <View style={[
        styles.searchBar, 
        { 
          marginHorizontal: horizontalPadding, 
          marginBottom: verticalSpacing,
          height: Math.max(45, height * 0.06)
        }
      ]}>
        <View style={styles.searchInputContainer}>
          <MagnifyingGlassIcon size={isSmallScreen ? 16 : 20} color="#26667E" />
          <TextInput
            style={[
              styles.searchBarItem,
              { 
                width: isSmallScreen ? width * 0.6 : 
                       isLargeScreen ? width * 0.7 : 
                       width * 0.65,
                fontSize: isSmallScreen ? 11 : 12
              }
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
      
      <View style={[
        styles.listContainer,
        { 
          paddingHorizontal: width * 0.05,
          paddingBottom: height * 0.03
        }
      ]}>
        {filteredFavoriteData?.length > 0 ? (
          <FlatList
            data={filteredFavoriteData}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <SavedStoreItem
                key={item._id}
                StoreName={item?.store?.storeName}
                onPress={() =>
                  navigation.navigate("MyWishList/index", {
                    storeId: item?.store?._id,
                    favoriteId: item?._id,
                    storeName: item?.store?.storeName,
                  })
                }
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.containerScroll,
              { 
                gap: height * 0.02,
                paddingBottom: height * 0.05 
              }
            ]}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Aucun magasin trouvé
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'android' ? 10 : 3,
    paddingBottom: 12,
    height: '100%',
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
    fontFamily: "Montserrat-Regular",
    textAlign: 'center',
  },
  textScreen: {
    height: 20,
    borderRadius: 4,
  },
  searchBar: {
    borderColor: "#26667E",
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
  vide: {
    // Dimensions set dynamically
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
});

export default Saved;